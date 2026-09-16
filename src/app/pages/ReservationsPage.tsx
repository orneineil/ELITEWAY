import { Link } from "react-router";
import { useEffect, useState } from "react";
import { Calendar, Clock, MapPin, ChevronRight, Plus, Loader } from "lucide-react";
import { useClientAuth } from "../contexts/ClientAuthContext";
import { supabase } from "../lib/supabase";
import { establishments } from "../data/establishments";

interface Booking {
  id: string;
  establishment_id: string;
  guests: number;
  total_amount: number | null;
  status: "pending" | "confirmed" | "cancelled";
  created_at: string;
  reservation_date: string | null;
  reservation_time: string | null;
}

function isPast(b: Booking) {
  if (!b.reservation_date) return false;
  const d = new Date(b.reservation_date);
  return d.getTime() < new Date().setHours(0, 0, 0, 0);
}

export function ReservationsPage() {
  const { client, isAuthenticated } = useClientAuth();
  const [bookings, setBookings] = useState<Booking[] | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !client) return;
    let cancelled = false;
    supabase
      .from("bookings")
      .select("id, establishment_id, guests, total_amount, status, created_at, reservation_date, reservation_time")
      .eq("client_id", client.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (!cancelled) setBookings((data as Booking[] | null) ?? []);
      });
    return () => { cancelled = true; };
  }, [isAuthenticated, client]);

  if (!isAuthenticated) {
    return (
      <div className="max-w-lg mx-auto px-5 pb-28 pt-6 flex flex-col items-center justify-center min-h-[70vh] text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
          <Calendar className="w-7 h-7 text-primary" />
        </div>
        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.6rem" }} className="mb-3">
          Vos réservations
        </h2>
        <p className="text-muted-foreground text-sm mb-7 max-w-xs leading-relaxed">
          Connectez-vous pour accéder à vos réservations et gérer vos expériences à venir.
        </p>
        <Link
          to="/client/login"
          className="w-full max-w-xs py-4 bg-primary text-primary-foreground rounded-2xl text-center text-sm"
        >
          Se connecter
        </Link>
        <Link to="/client/register" className="mt-3 text-xs text-muted-foreground hover:text-primary transition-colors">
          Pas encore de compte ? S'inscrire
        </Link>
      </div>
    );
  }

  const upcoming = (bookings ?? []).filter((b) => b.status !== "cancelled" && !isPast(b));
  const completed = (bookings ?? []).filter((b) => b.status !== "cancelled" && isPast(b));
  const cancelled = (bookings ?? []).filter((b) => b.status === "cancelled");

  function BookingCard({ b }: { b: Booking }) {
    const est = establishments.find((e) => e.id === b.establishment_id);
    return (
      <Link to={est ? `/establishment/${est.id}` : "#"} className="block bg-card rounded-2xl overflow-hidden">
        <div className="relative" style={{ height: "84px" }}>
          <img src={est?.imageUrl} alt={est?.name ?? ""} className="w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent" />
          <div className="absolute bottom-3 left-4">
            <p style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem" }} className="mb-0.5">{est?.name ?? "Établissement"}</p>
            <p className="text-xs text-muted-foreground">{est?.city}</p>
          </div>
          <div className="absolute top-3 right-3">
            <span className={`text-xs px-2.5 py-1 rounded-full ${b.status === "confirmed" ? "bg-emerald-500/15 text-emerald-400" : b.status === "cancelled" ? "bg-red-500/15 text-red-400" : "bg-amber-500/15 text-amber-400"}`}>
              {b.status === "confirmed" ? "Confirmée" : b.status === "cancelled" ? "Annulée" : "En attente"}
            </span>
          </div>
        </div>
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              {b.reservation_date && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(b.reservation_date).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}
                </span>
              )}
              {b.reservation_time && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{b.reservation_time}</span>}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="w-3 h-3" />{b.guests} pers.
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </div>
      </Link>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-5 pb-28 pt-4">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.18em] text-primary mb-1">Agenda</p>
        <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "1.8rem" }}>
          Mes réservations
        </h1>
      </div>

      {bookings === null ? (
        <div className="flex justify-center py-16">
          <Loader className="w-5 h-5 text-primary animate-spin" />
        </div>
      ) : (
        <>
          {upcoming.length > 0 && (
            <div className="mb-8">
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">À venir</p>
              <div className="space-y-4">
                {upcoming.map((b) => <BookingCard key={b.id} b={b} />)}
              </div>
            </div>
          )}

          {completed.length > 0 && (
            <div className="mb-8">
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Passées</p>
              <div className="space-y-4">
                {completed.map((b) => <BookingCard key={b.id} b={b} />)}
              </div>
            </div>
          )}

          {cancelled.length > 0 && (
            <div className="mb-8">
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Annulées</p>
              <div className="space-y-4">
                {cancelled.map((b) => <BookingCard key={b.id} b={b} />)}
              </div>
            </div>
          )}

          {upcoming.length === 0 && completed.length === 0 && cancelled.length === 0 && (
            <div className="pt-6 border-t border-border/30 flex flex-col items-center text-center">
              <Plus className="w-6 h-6 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground mb-4">Réservez votre prochaine expérience</p>
              <Link
                to="/categories"
                className="px-6 py-3 bg-primary text-primary-foreground rounded-xl text-sm"
              >
                Explorer les expériences
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
