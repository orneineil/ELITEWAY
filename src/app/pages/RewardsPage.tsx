import { useClientAuth } from "../contexts/ClientAuthContext";
import { Link } from "react-router";
import { Crown, Star, Gift, MessageSquare, Users, Calendar, Lock, CheckCircle } from "lucide-react";

const TIERS = [
  { id: "essentiel", label: "Essentiel", minPts: 0,    maxPts: 999,  color: "text-muted-foreground", bg: "bg-muted/40",     border: "border-border/60",          badge: "●" },
  { id: "prestige",  label: "Prestige",  minPts: 1000, maxPts: 4999, color: "text-primary",           bg: "bg-primary/10",   border: "border-primary/30",         badge: "✦" },
  { id: "elite",     label: "Élite",     minPts: 5000, maxPts: null, color: "text-amber-400",          bg: "bg-amber-500/10", border: "border-amber-500/30",       badge: "★" },
];

const EARNING_RULES = [
  { icon: Gift,         label: "100 € dépensés",           pts: 100 },
  { icon: MessageSquare,label: "Laisser un avis",           pts: 20 },
  { icon: Users,        label: "Parrainer un ami",          pts: 500 },
  { icon: Calendar,     label: "Anniversaire",              pts: 200 },
];

const REWARDS = [
  { id: "r1", label: "-10% sur prochaine réservation", pts: 200,  icon: "🎁" },
  { id: "r2", label: "Accès spa privatif",              pts: 500,  icon: "🧖" },
  { id: "r3", label: "Upgrade suite",                   pts: 1000, icon: "🛎️" },
  { id: "r4", label: "Expérience privée Chef",          pts: 2000, icon: "👨‍🍳" },
  { id: "r5", label: "Croisière exclusive",             pts: 5000, icon: "⛵" },
];

const HISTORY = [
  { id: "h1", label: "Réservation Spa Azuréen",    pts: +45,  date: "12 juin 2026",  sign: "+" },
  { id: "h2", label: "Avis publié",                pts: +20,  date: "10 juin 2026",  sign: "+" },
  { id: "h3", label: "Réservation Azur Sailing",   pts: +55,  date: "2 juin 2026",   sign: "+" },
  { id: "h4", label: "Récompense utilisée",        pts: -200, date: "25 mai 2026",   sign: "-" },
  { id: "h5", label: "Parrainage accepté",         pts: +500, date: "15 mai 2026",   sign: "+" },
];

export function RewardsPage() {
  const { client } = useClientAuth();
  const userPoints = 240;
  const currentTier = TIERS[0]; // essentiel for mock
  const nextTier = TIERS[1];
  const progressPct = (userPoints / nextTier.minPts) * 100;

  return (
    <div className="max-w-lg mx-auto px-5 pb-28 pt-4">

      {/* Header */}
      <div className="text-center mb-7">
        <p className="text-xs uppercase tracking-[0.2em] text-primary mb-2">Programme fidélité</p>
        <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "1.9rem" }} className="leading-tight mb-2">
          EliteWay Rewards
        </h1>
        <p className="text-sm text-muted-foreground">
          Chaque expérience vous rapproche de l'excellence
        </p>
      </div>

      {/* Member card */}
      <div className="bg-card border border-primary/20 rounded-2xl p-5 mb-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">{client ? `${client.firstName} ${client.lastName}` : "Membre EliteWay"}</p>
              <p style={{ fontFamily: "var(--font-heading)", fontSize: "2.2rem" }} className="text-primary leading-none">{userPoints}</p>
              <p className="text-xs text-muted-foreground">points</p>
            </div>
            <div className={`px-3 py-1.5 rounded-xl text-xs border ${currentTier.bg} ${currentTier.border} ${currentTier.color}`}>
              {currentTier.badge} Membre {currentTier.label}
            </div>
          </div>

          {/* Progress to next tier */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-xs text-muted-foreground">Vers {nextTier.label} {nextTier.badge}</p>
              <p className="text-xs text-primary">{userPoints} / {nextTier.minPts} pts</p>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${Math.min(progressPct, 100)}%` }}
              />
            </div>
            <p className="text-[10px] text-muted-foreground mt-1.5">
              Plus que {nextTier.minPts - userPoints} points pour atteindre le niveau Prestige
            </p>
          </div>
        </div>
      </div>

      {/* Tiers */}
      <div className="mb-6">
        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Niveaux</p>
        <div className="space-y-3">
          {TIERS.map((tier) => (
            <div
              key={tier.id}
              className={`flex items-center gap-4 p-4 rounded-2xl border ${tier.bg} ${tier.border} ${tier.id === currentTier.id ? "ring-1 ring-primary/30" : ""}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${tier.id === "elite" ? "animate-pulse" : ""}`}
                style={tier.id === "elite" ? { background: "linear-gradient(135deg, rgba(245,158,11,0.2), rgba(245,158,11,0.05))" } : {}}>
                <span className={tier.color}>{tier.badge}</span>
              </div>
              <div className="flex-1">
                <p className={`text-sm font-medium ${tier.color}`}>
                  {tier.label}
                  {tier.id === currentTier.id && (
                    <span className="ml-2 text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">Actuel</span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground">
                  {tier.maxPts ? `${tier.minPts} – ${tier.maxPts} points` : `À partir de ${tier.minPts} points`}
                </p>
              </div>
              <Crown className={`w-4 h-4 ${tier.color}`} />
            </div>
          ))}
        </div>
      </div>

      {/* How to earn */}
      <div className="mb-6">
        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Comment gagner des points</p>
        <div className="grid grid-cols-2 gap-3">
          {EARNING_RULES.map((rule) => {
            const Icon = rule.icon;
            return (
              <div key={rule.label} className="bg-card border border-border/60 rounded-2xl p-4">
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground mb-1">{rule.label}</p>
                <p style={{ fontFamily: "var(--font-heading)", fontSize: "1.2rem" }} className="text-primary">+{rule.pts} pts</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rewards */}
      <div className="mb-6">
        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Mes récompenses disponibles</p>
        <div className="space-y-3">
          {REWARDS.map((reward) => {
            const unlocked = userPoints >= reward.pts;
            return (
              <div
                key={reward.id}
                className={`flex items-center gap-4 p-4 rounded-2xl border ${unlocked ? "bg-card border-border/60" : "bg-muted/20 border-border/30"}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${unlocked ? "bg-primary/10" : "bg-muted/30"}`}>
                  {reward.icon}
                </div>
                <div className="flex-1">
                  <p className={`text-sm ${unlocked ? "text-foreground" : "text-muted-foreground"}`}>{reward.label}</p>
                  <p className={`text-xs mt-0.5 ${unlocked ? "text-primary" : "text-muted-foreground/60"}`}>{reward.pts} points</p>
                </div>
                {unlocked ? (
                  <button className="px-3 py-1.5 bg-primary text-primary-foreground rounded-xl text-xs flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Utiliser
                  </button>
                ) : (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground/60">
                    <Lock className="w-3 h-3" />
                    <span>Verrouillé</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* History */}
      <div className="mb-6">
        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Historique des points</p>
        <div className="bg-card border border-border/60 rounded-2xl overflow-hidden divide-y divide-border/40">
          {HISTORY.map((item) => (
            <div key={item.id} className="flex items-center gap-3 px-4 py-3.5">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold ${item.sign === "+" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                {item.sign}
              </div>
              <div className="flex-1">
                <p className="text-sm">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.date}</p>
              </div>
              <p className={`text-sm font-medium ${item.sign === "+" ? "text-emerald-400" : "text-red-400"}`}>
                {item.sign}{Math.abs(item.pts)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Link to profile */}
      <div className="text-center">
        <Link to="/profile" className="text-xs text-muted-foreground hover:text-primary transition-colors">
          Retour au profil →
        </Link>
      </div>

    </div>
  );
}
