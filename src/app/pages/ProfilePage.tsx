import { Link, useNavigate } from "react-router";
import { useClientAuth } from "../contexts/ClientAuthContext";
import { Crown, Heart, Calendar, ChevronRight, LogOut, Settings, Bell, Shield, HelpCircle, Gift, Map, Star, Sparkles } from "lucide-react";

const tierInfo = {
  essentiel: { label: "Essentiel", color: "text-muted-foreground", bg: "bg-muted/50" },
  prestige:  { label: "Prestige",  color: "text-primary",          bg: "bg-primary/10" },
  elite:     { label: "Élite",     color: "text-amber-400",        bg: "bg-amber-500/10" },
};

export function ProfilePage() {
  const { client, isAuthenticated, logout } = useClientAuth();
  const navigate = useNavigate();

  if (!isAuthenticated || !client) {
    return (
      <div className="max-w-lg mx-auto px-5 pb-28 pt-6 flex flex-col items-center justify-center min-h-[70vh] text-center">
        <div className="w-20 h-20 rounded-3xl bg-card border border-border flex items-center justify-center mb-6">
          <span style={{ fontFamily: "var(--font-heading)", fontSize: "2rem" }} className="text-muted-foreground">E</span>
        </div>
        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.6rem" }} className="mb-2">Mon profil</h2>
        <p className="text-muted-foreground text-sm mb-8 max-w-xs">
          Créez un compte pour accéder à vos favoris, réservations et offres exclusives.
        </p>
        <div className="w-full max-w-xs space-y-3">
          <Link to="/client/register" className="block w-full py-4 bg-primary text-primary-foreground rounded-2xl text-center text-sm">
            Créer un compte
          </Link>
          <Link to="/client/login" className="block w-full py-4 border border-border rounded-2xl text-center text-sm text-muted-foreground hover:text-foreground transition-colors">
            Se connecter
          </Link>
        </div>
        <div className="mt-8 pt-6 border-t border-border/50 w-full max-w-xs">
          <Link to="/partner/login" className="text-xs text-muted-foreground hover:text-primary transition-colors">
            Espace partenaire →
          </Link>
        </div>
      </div>
    );
  }

  const tier = tierInfo[client.membershipTier];

  const menuSections = [
    {
      title: "Mon compte",
      items: [
        { icon: Crown,    label: "Mon abonnement",    to: "/client/dashboard" },
        { icon: Heart,    label: "Mes favoris",       to: "/favorites" },
        { icon: Calendar, label: "Mes réservations",  to: "/reservations" },
        { icon: Star,     label: "EliteWay Rewards",  to: "/rewards" },
        { icon: Gift,     label: "Offres exclusives", to: "/category/offres-exclusives" },
      ],
    },
    {
      title: "Découverte",
      items: [
        { icon: Sparkles, label: "EliteWay Selection", to: "/elite-selection" },
        { icon: Map,      label: "Carte Côte d'Azur",  to: "/map" },
        { icon: Bell,     label: "Notifications",      to: "/notifications" },
      ],
    },
    {
      title: "Paramètres",
      items: [
        { icon: Shield,     label: "Confidentialité",  to: "#" },
        { icon: Settings,   label: "Paramètres",       to: "/settings" },
        { icon: HelpCircle, label: "Aide & support",   to: "#" },
      ],
    },
  ];

  return (
    <div className="max-w-lg mx-auto pb-28 pt-4">

      {/* Profile card */}
      <div className="mx-5 mb-6 bg-card border border-border/60 rounded-2xl p-5 flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center shrink-0">
          <span style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem" }} className="text-primary">
            {client.firstName[0]}{client.lastName[0]}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p style={{ fontFamily: "var(--font-heading)", fontSize: "1.2rem" }} className="leading-tight">
            {client.firstName} {client.lastName}
          </p>
          <p className="text-xs text-muted-foreground truncate">{client.email}</p>
          <div className={`inline-flex items-center gap-1.5 mt-1.5 px-2.5 py-0.5 rounded-full text-xs ${tier.bg} ${tier.color}`}>
            <Crown className="w-3 h-3" />
            Membre {tier.label}
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3 mx-5 mb-7">
        {[
          { label: "Réservations", value: "2" },
          { label: "Favoris",      value: "0" },
          { label: "Points",       value: "240" },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border/50 rounded-xl p-3 text-center">
            <p style={{ fontFamily: "var(--font-heading)", fontSize: "1.4rem" }} className="text-primary">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Rewards mini-card */}
      <Link to="/rewards" className="block mx-5 mb-5">
        <div className={`border rounded-2xl p-4 relative overflow-hidden ${
          client.membershipTier === "elite" ? "border-amber-500/30 bg-amber-500/5" :
          client.membershipTier === "prestige" ? "border-primary/30 bg-primary/5" :
          "border-border/60 bg-card"
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              client.membershipTier === "elite" ? "bg-amber-500/15" : "bg-primary/10"
            }`}>
              <Star className={`w-5 h-5 ${client.membershipTier === "elite" ? "fill-amber-400 text-amber-400" : "fill-primary text-primary"}`} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">EliteWay Rewards</p>
              <p className={`text-xs ${client.membershipTier === "elite" ? "text-amber-400" : "text-primary"}`}>
                240 pts · Niveau {tier.label}
                {client.membershipTier === "elite" && " ★"}
                {client.membershipTier === "prestige" && " ✦"}
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
          </div>
        </div>
      </Link>

      {/* Upgrade banner if essentiel */}
      {client.membershipTier === "essentiel" && (
        <Link to="/membership" className="block mx-5 mb-6 bg-primary/8 border border-primary/20 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm mb-0.5" style={{ fontFamily: "var(--font-heading)", fontSize: "1rem" }}>Passez à Prestige</p>
              <p className="text-xs text-muted-foreground">Offres exclusives & conciergerie</p>
            </div>
            <div className="flex items-center gap-1 text-primary text-xs">
              Voir <ChevronRight className="w-3 h-3" />
            </div>
          </div>
        </Link>
      )}

      {/* Menu sections */}
      {menuSections.map((section) => (
        <div key={section.title} className="mx-5 mb-5">
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2 px-1">{section.title}</p>
          <div className="bg-card border border-border/50 rounded-2xl overflow-hidden divide-y divide-border/50">
            {section.items.map(({ icon: Icon, label, to }) => (
              <Link
                key={label}
                to={to}
                className="flex items-center gap-3 px-4 py-3.5 hover:bg-accent/50 transition-colors"
              >
                <div className="w-8 h-8 rounded-xl bg-muted/60 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-muted-foreground" />
                </div>
                <span className="flex-1 text-sm">{label}</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
              </Link>
            ))}
          </div>
        </div>
      ))}

           {/* Logout */}
      <div className="mx-5">
        <button
          onClick={() => { logout(); navigate("/"); }}
          className="w-full flex items-center justify-center gap-2 py-3.5 border border-border/60 rounded-2xl text-sm text-muted-foreground hover:text-foreground hover:border-border transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Se déconnecter
        </button>
      </div>

      {/* Mentions légales */}
      <div className="mt-10 mb-2 flex items-center justify-center gap-5 flex-wrap px-5">
        <Link to="/mentions-legales" className="text-xs text-muted-foreground/60 hover:text-primary transition-colors">
          Mentions légales
        </Link>
        <Link to="/confidentialite" className="text-xs text-muted-foreground/60 hover:text-primary transition-colors">
          Confidentialité
        </Link>
        <Link to="/cgu" className="text-xs text-muted-foreground/60 hover:text-primary transition-colors">
          CGU
        </Link>
      </div>
      <p className="text-center text-[10px] text-muted-foreground/40 mt-3 mb-4">
        © 2026 EliteWay SAS · Paris, France
      </p>

    </div>
  );
}
