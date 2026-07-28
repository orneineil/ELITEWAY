import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { ArrowLeft, Calendar, Users, Clock, ChevronRight, MessageSquare } from "lucide-react";
import { establishments } from "../data/establishments";

const TIME_SLOTS = ["12h00", "12h30", "13h00", "13h30", "19h00", "19h30", "20h00", "20h30", "21h00", "21h30"];
const GUEST_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8];

// Simple date helpers
function getNextDays(n: number) {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return d;
  });
}

function formatDay(d: Date) {
  return d.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric" });
}

export function ReservationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const establishment = establishments.find((e) => e.id === id);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [guests, setGuests] = useState(2);
  const [note, setNote] = useState("");
  const [step, setStep] = useState<1 | 2>(1);

  const days = getNextDays(14);
  const canProceed = selectedDate && selectedTime;

  if (!establishment) {
    return (
      <div className="max-w-sm mx-auto px-5 pt-20 text-center">
        <p className="text-muted-foreground">Établissement introuvable.</p>
        <Link to="/" className="text-primary hover:underline">Retour</Link>
      </div>
    );
  }

  const basePrice = establishment.priceRange?.min ?? 45;
  const total = basePrice * guests;

  if (step === 2) {
    return (
      <div className="max-w-sm mx-auto px-5 pb-24 pt-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-7">
          <button onClick={() => setStep(1)} className="w-9 h-9 rounded-xl bg-card border border-border/60 flex items-center justify-center">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <p className="text-xs text-muted-foreground">Réservation</p>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.2rem" }}>{establishment.name}</h2>
          </div>
        </div>

        {/* Summary card */}
        <div className="bg-card border border-border/60 rounded-2xl overflow-hidden mb-5">
          <div className="relative h-28">
            <img src={establishment.imageUrl} alt="" className="w-full h-full object-cover opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent" />
            <div className="absolute bottom-3 left-4">
              <p style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem" }}>{establishment.name}</p>
              <p className="text-xs text-muted-foreground">{establishment.location}</p>
            </div>
          </div>
          <div className="p-4 space-y-2.5">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground"><Calendar className="w-4 h-4" /><span>Date</span></div>
              <span>{selectedDate?.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground"><Clock className="w-4 h-4" /><span>Heure</span></div>
              <span>{selectedTime}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground"><Users className="w-4 h-4" /><span>Personnes</span></div>
              <span>{guests} pers.</span>
            </div>
          </div>
        </div>

        {/* Price breakdown */}
        <div className="bg-card border border-border/60 rounded-2xl p-4 mb-5">
          <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1rem" }} className="mb-3">Détail du prix</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Prix par personne</span>
              <span>{basePrice}€</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">× {guests} personne{guests > 1 ? "s" : ""}</span>
              <span>{total}€</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground text-xs">Frais de service EliteWay</span>
              <span className="text-xs">Offerts</span>
            </div>
            <div className="pt-2 border-t border-border/50 flex justify-between font-medium">
              <span>Total</span>
              <span className="text-primary text-lg" style={{ fontFamily: "var(--font-heading)" }}>{total}€</span>
            </div>
          </div>
        </div>

        {/* Note */}
        {note && (
          <div className="bg-card border border-border/60 rounded-2xl p-4 mb-5 flex gap-3">
            <MessageSquare className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-sm text-muted-foreground">{note}</p>
          </div>
        )}

        {/* Points earn */}
        <div className="flex items-center gap-2 px-4 py-3 bg-primary/5 border border-primary/20 rounded-xl mb-6 text-sm">
          <span className="text-primary">★</span>
          <span className="text-muted-foreground">Vous gagnerez <strong className="text-primary">{total} points</strong> EliteWay Rewards</span>
        </div>

        {/* CTA */}
        <button
          onClick={() => navigate(`/establishment/${id}/payment?total=${total}&guests=${guests}&date=${selectedDate?.toISOString()}&time=${selectedTime}`)}
          className="w-full py-4 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center gap-2 hover:bg-primary/85 transition-colors"
        >
          Procéder au paiement — {total}€
          <ChevronRight className="w-4 h-4" />
        </button>
        <p className="text-center text-xs text-muted-foreground mt-3">Annulation gratuite jusqu'à 24h avant</p>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto px-5 pb-24 pt-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-7">
        <Link to={`/establishment/${id}`} className="w-9 h-9 rounded-xl bg-card border border-border/60 flex items-center justify-center">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <p className="text-xs text-muted-foreground">Réserver</p>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.2rem" }}>{establishment.name}</h2>
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-1 mb-7">
        {[1, 2].map((s) => (
          <div key={s} className={`h-1 flex-1 rounded-full transition-colors ${s <= step ? "bg-primary" : "bg-border/50"}`} />
        ))}
      </div>

      {/* Date */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-4 h-4 text-primary" />
          <p className="text-sm font-medium">Choisir une date</p>
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {days.map((d, i) => {
            const sel = selectedDate?.toDateString() === d.toDateString();
            return (
              <button
                key={i}
                onClick={() => setSelectedDate(d)}
                className={`shrink-0 flex flex-col items-center px-3 py-2.5 rounded-xl text-xs transition-all ${sel ? "bg-primary text-primary-foreground" : "bg-card border border-border/60 text-muted-foreground hover:border-primary/40"}`}
              >
                <span className="text-[10px] uppercase">{d.toLocaleDateString("fr-FR", { weekday: "short" })}</span>
                <span className="text-base leading-tight">{d.getDate()}</span>
                <span className="text-[10px]">{d.toLocaleDateString("fr-FR", { month: "short" })}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-primary" />
          <p className="text-sm font-medium">Choisir une heure</p>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {TIME_SLOTS.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTime(t)}
              className={`py-2 rounded-xl text-xs transition-all ${selectedTime === t ? "bg-primary text-primary-foreground" : "bg-card border border-border/60 text-muted-foreground hover:border-primary/40"}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Guests */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-4 h-4 text-primary" />
          <p className="text-sm font-medium">Nombre de personnes</p>
        </div>
        <div className="flex items-center justify-between bg-card border border-border/60 rounded-xl px-4 py-3">
          <button
            onClick={() => setGuests((g) => Math.max(1, g - 1))}
            className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-lg leading-none hover:bg-accent transition-colors"
          >—</button>
          <span style={{ fontFamily: "var(--font-heading)", fontSize: "1.3rem" }}>{guests} pers.</span>
          <button
            onClick={() => setGuests((g) => Math.min(8, g + 1))}
            className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-lg leading-none hover:bg-accent transition-colors"
          >+</button>
        </div>
      </div>

      {/* Special request */}
      <div className="mb-7">
        <div className="flex items-center gap-2 mb-3">
          <MessageSquare className="w-4 h-4 text-primary" />
          <p className="text-sm font-medium">Demandes spéciales (optionnel)</p>
        </div>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Allergie, occasion spéciale, préférence de table…"
          rows={3}
          className="w-full px-4 py-3 bg-input-background border border-border/60 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none placeholder:text-muted-foreground/60"
        />
      </div>

      {/* CTA */}
      <button
        onClick={() => setStep(2)}
        disabled={!canProceed}
        className="w-full py-4 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center gap-2 disabled:opacity-40 hover:bg-primary/85 transition-colors"
      >
        Vérifier ma réservation
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
