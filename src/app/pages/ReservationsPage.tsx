import { Link } from "react-router";
import { Calendar, Clock, MapPin, ChevronRight, Plus } from "lucide-react";
import { useClientAuth } from "../contexts/ClientAuthContext";

const MOCK_BOOKINGS = [
  {
    id: "b1",
    name: "Azur Dreams",
    type: "Croisière privée · 4h",
    location: "Cannes, France",
    date: "12 Juillet 2026",
    time: "10h00",
    status: "confirmed",
    price: "€€€€",
    image: "https://images.unsplash.com/photo-1593351415075-3bac9f45c877?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
  },
  {
    id: "b2",
    name: "Spa Sérénité",
    type: "Soin signature · 2h",
    location: "Courchevel, France",
    date: "28 Juin 2026",
    time: "14h30",
    status: "pending",
    price: "€€€",
    image: "https://images.unsplash.com/photo-1488345979593-09db0f85545f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
  },
];

export function ReservationsPage() {
  const { client, isAuthenticated } = useClientAuth();

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

  return (
    <div className="max-w-lg mx-auto px-5 pb-28 pt-4">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.18em] text-primary mb-1">Agenda</p>
        <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "1.8rem" }}>
          Mes réservations
        </h1>
      </div>

      {/* Upcoming */}
      <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">À venir</p>
      <div className="space-y-4 mb-8">
        {MOCK_BOOKINGS.map((b) => (
          <div key={b.id} className="bg-card border border-border/60 rounded-2xl overflow-hidden">
            <div className="relative" style={{ height: "110px" }}>
              <img src={b.image} alt={b.name} className="w-full h-full object-cover opacity-60" />
              <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent" />
              <div className="absolute bottom-3 left-4">
                <p style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem" }} className="mb-0.5">{b.name}</p>
                <p className="text-xs text-muted-foreground">{b.type}</p>
              </div>
              <div className="absolute top-3 right-3">
                <span className={`text-xs px-2.5 py-1 rounded-full ${b.status === "confirmed" ? "bg-emerald-500/15 text-emerald-400" : "bg-amber-500/15 text-amber-400"}`}>
                  {b.status === "confirmed" ? "Confirmée" : "En attente"}
                </span>
              </div>
            </div>
            <div className="px-4 py-3 flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{b.date}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{b.time}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3" />{b.location}
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
        ))}
      </div>

      {/* Empty state + CTA */}
      <div className="border border-dashed border-border/60 rounded-2xl p-6 flex flex-col items-center text-center">
        <Plus className="w-6 h-6 text-muted-foreground mb-3" />
        <p className="text-sm text-muted-foreground mb-4">Réservez votre prochaine expérience</p>
        <Link
          to="/categories"
          className="px-6 py-3 bg-primary text-primary-foreground rounded-xl text-sm"
        >
          Explorer les expériences
        </Link>
      </div>
    </div>
  );
}
