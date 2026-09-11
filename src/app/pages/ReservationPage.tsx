import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { ArrowLeft, Calendar, Users, Clock, ChevronRight, MessageSquare, Check } from "lucide-react";
import { establishments } from "../data/establishments";

const TIME_SLOTS = ["12h00", "12h30", "13h00", "13h30", "19h00", "19h30", "20h00", "20h30", "21h00", "21h30"];

function getNextDays(n: number) {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return d;
  });
}

const STEPS = [
  { key: "date",   label: "Date",         icon: Calendar },
  { key: "heure",  label: "Heure",        icon: Clock },
  { key: "pers",   label: "Personnes",    icon: Users },
  { key: "recap",  label: "Confirmation", icon: Check },
];

export function ReservationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const establishment = establishments.find((e) => e.id === id);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [guests, setGuests] = useState(2);
  const [note, setNote] = useState("");
  const [step, setStep] = useState(0); // 0=date 1=heure 2=personnes 3=recap

  const days = getNextDays(14);

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

  const goNext = () => setStep((s) => Math.min(3, s + 1));
  const goBack = () => {
    if (step === 0) navigate(`/establishment/${id}`);
    else setStep((s) => s - 1);
  };

  const canProceed = [
    !!selectedDate,
    !!selectedTime,
    guests > 0,
    true,
  ][step];

  return (
    <div className="max-w-sm mx-auto px-5 pb-24 pt-4">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={goBack} className="w-9 h-9 rounded-xl bg-card border border-border/60 flex items-center justify-center">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <p className="text-xs text-muted-foreground">Réserver</p>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.2rem" }}>{establishment.name}</h2>
        </div>
      </div>

      {/* Step indicator avec icônes */}
      <div className="flex items-center justify-between mb-8 px-1">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const active = i === step;
          const done = i < step;
          return (
            <div key={s.key} className="flex flex-col items-center gap-1.5 flex-1">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                active ? "bg-primary text-primary-foreground" : done ? "bg-primary/20 text-primary" : "bg-card border border-border/60 text-muted-foreground"
              }`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className={`text-[10px] ${active ? "text-primary" : "text-muted-foreground"}`}>{s.label}</span>
            </div>
          );
        })}
      </div>

      {/* ── Étape Date ── */}
      {step === 0 && (
        <div>
          <p className="text-sm font-medium mb-4">Sélectionnez une date</p>
          <div className="grid grid-cols-3 gap-2.5">
            {days.map((d, i) => {
              const sel = selectedDate?.toDateString() === d.toDateString();
              return (
                <button
                  key={i}
                  onClick={() => setSelectedDate(d)}
                  className={`flex flex-col items-center py-3.5 rounded-xl text-xs transition-all ${sel ? "bg-primary text-primary-foreground" : "bg-card border border-border/60 text-muted-foreground hover:border-primary/40"}`}
                >
                  <span className="text-[10px] uppercase">{d.toLocaleDateString("fr-FR", { weekday: "short" })}</span>
                  <span className="text-lg leading-tight my-0.5">{d.getDate()}</span>
                  <span className="text-[10px]">{d.toLocaleDateString("fr-FR", { month: "short" })}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Étape Heure ── */}
      {step === 1 && (
        <div>
          <p className="text-sm font-medium mb-4">Sélectionnez une heure</p>
          <div className="grid grid-cols-2 gap-3">
            {TIME_SLOTS.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTime(t)}
                className={`py-3.5 rounded-xl text-sm transition-all ${selectedTime === t ? "bg-primary text-primary-foreground" : "bg-card border border-border/60 text-muted-foreground hover:border-primary/40"}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Étape Personnes ── */}
      {step === 2 && (
        <div>
          <p className="text-sm font-medium mb-4">Nombre de personnes</p>
          <div className="flex items-center justify-between bg-card border border-border/60 rounded-2xl px-6 py-6 mb-6">
            <button
              onClick={() => setGuests((g) => Math.max(1, g - 1))}
              className="w-11 h-11 rounded-xl bg-muted flex items-center justify-center text-xl leading-none hover:bg-accent transition-colors"
            >—</button>
            <span style={{ fontFamily: "var(--font-heading)", fontSize: "1.8rem" }}>{guests} pers.</span>
            <button
              onClick={() => setGuests((g) => Math.min(8, g + 1))}
              className="w-11 h-11 rounded-xl bg-muted flex items-center justify-center text-xl leading-none hover:bg-accent transition-colors"
            >+</button>
          </div>

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
      )}

      {/* ── Étape Récapitulatif ── */}
      {step === 3 && (
        <div>
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

          <div className="bg-card border border-border/60 rounded-2xl p-4 mb-5">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{basePrice}€ × {guests} pers.</span>
                <span>{total}€</span>
              </div>
              <div className="pt-2 border-t border-border/50 flex justify-between font-medium">
                <span>Total</span>
                <span className="text-primary text-lg" style={{ fontFamily: "var(--font-heading)" }}>{total}€</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 px-4 py-3 bg-primary/5 border border-primary/20 rounded-xl mb-6 text-sm">
            <span className="text-primary">★</span>
            <span className="text-muted-foreground">Vous gagnerez <strong className="text-primary">{total} points</strong></span>
          </div>
        </div>
      )}

      {/* CTA — commun à toutes les étapes */}
      <button
        onClick={step === 3
          ? () => navigate(`/establishment/${id}/payment?total=${total}&guests=${guests}&date=${selectedDate?.toISOString()}&time=${selectedTime}`)
          : goNext}
        disabled={!canProceed}
        className="w-full py-4 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center gap-2 disabled:opacity-40 hover:bg-primary/85 transition-colors mt-7"
      >
        {step === 3 ? `Procéder au paiement — ${total}€` : "Suivant"}
        <ChevronRight className="w-4 h-4" />
      </button>
      {step === 3 && (
        <p className="text-center text-xs text-muted-foreground mt-3">Annulation gratuite jusqu'à 24h avant</p>
      )}
    </div>
  );
}
