import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft, Check, Building2, MapPin, Phone, Mail, FileText, ChevronRight } from "lucide-react";
import { LogoMark } from "../../components/LogoMark";

const CATEGORIES = [
  { id: "gastronomie",       label: "Restaurant / Bar" },
  { id: "navigation",        label: "Yachts / Bateaux" },
  { id: "bien-etre",         label: "Spa / Bien-être / Hôtel" },
  { id: "aviation",          label: "Aviation / Hélicoptères" },
  { id: "oenologie",         label: "Vignoble / Cave / Bar à vins" },
  { id: "evenements",        label: "Événements / Lieu privatisable" },
  { id: "offres-exclusives", label: "Autre / Offre exclusive" },
];

const STEPS = ["Votre établissement", "Contact & accès", "Votre offre", "Confirmation"];

export function PartnerRegister() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "", category: "", city: "", address: "", website: "",
    firstName: "", lastName: "", email: "", phone: "",
    description: "", priceFrom: "", dressCode: "", parking: "",
    acceptTerms: false,
  });

  const set = (k: keyof typeof form, v: string | boolean) => setForm(f => ({ ...f, [k]: v }));

  const canNext = [
    form.name && form.category && form.city,
    form.firstName && form.lastName && form.email && form.phone,
    form.description && form.priceFrom,
    form.acceptTerms,
  ][step];

  const handleNext = () => {
    if (step < 3) setStep(s => s + 1);
    else {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-5 bg-background">
        <div className="max-w-sm w-full text-center">
          <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-emerald-400" />
          </div>
          <p className="text-xs uppercase tracking-[0.2em] text-primary mb-3">Demande envoyée</p>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "1.9rem", lineHeight: 1.1 }} className="mb-3">
            Bienvenue dans<br />la famille EliteWay !
          </h1>
          <p className="text-sm text-muted-foreground mb-7 leading-relaxed">
            Votre demande a été transmise à notre équipe. Nous vous contactons sous <strong className="text-foreground">48h ouvrées</strong> pour valider votre dossier.
          </p>
          <div className="space-y-3">
            <Link to="/" className="block w-full py-4 bg-primary text-primary-foreground rounded-2xl text-sm text-center">
              Retour à l'accueil
            </Link>
            <Link to="/partner/login" className="block w-full py-3 border border-border/60 rounded-2xl text-sm text-muted-foreground text-center">
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border/40 px-5 py-3">
        <div className="max-w-sm mx-auto flex items-center gap-3">
          <button onClick={() => step > 0 ? setStep(s => s - 1) : navigate("/")}
            className="w-9 h-9 rounded-xl bg-card border border-border/60 flex items-center justify-center">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2">
            <LogoMark size={20} className="text-primary" />
            <span style={{ fontFamily: "var(--font-heading)", letterSpacing: "0.2em", fontSize: "0.75rem" }}>Espace Partenaire</span>
          </div>
        </div>
      </div>

      <div className="max-w-sm mx-auto px-5 pb-16 pt-6">
        {/* Step indicator */}
        <div className="flex items-center gap-1.5 mb-7">
          {STEPS.map((s, i) => (
            <div key={s} className={`h-1 flex-1 rounded-full transition-colors ${i <= step ? "bg-primary" : "bg-border/50"}`} />
          ))}
        </div>
        <p className="text-xs uppercase tracking-[0.18em] text-primary mb-1">Étape {step + 1}/{STEPS.length}</p>
        <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "1.7rem", lineHeight: 1.1 }} className="mb-6">
          {STEPS[step]}
        </h1>

        {/* ── Step 0 : Établissement ────────────────────────────── */}
        {step === 0 && (
          <div className="space-y-5">
            <div>
              <label className="block text-sm mb-2">Nom de l'établissement *</label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input value={form.name} onChange={e => set("name", e.target.value)}
                  placeholder="Le Belvédère, Spa Azuréen…"
                  className="w-full pl-11 pr-4 py-3 bg-input-background border border-border/60 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2">Catégorie *</label>
              <div className="grid grid-cols-1 gap-2">
                {CATEGORIES.map((cat) => (
                  <button key={cat.id} type="button" onClick={() => set("category", cat.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm text-left transition-colors ${form.category === cat.id ? "border-primary/50 bg-primary/5 text-primary" : "border-border/60 bg-card text-muted-foreground hover:text-foreground"}`}>
                    {form.category === cat.id && <Check className="w-4 h-4 text-primary shrink-0" />}
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2">Ville *</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input value={form.city} onChange={e => set("city", e.target.value)}
                  placeholder="Nice, Cannes, Monaco…"
                  className="w-full pl-11 pr-4 py-3 bg-input-background border border-border/60 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2">Adresse</label>
              <input value={form.address} onChange={e => set("address", e.target.value)}
                placeholder="24 Avenue des Fleurs, 06000 Nice"
                className="w-full px-4 py-3 bg-input-background border border-border/60 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>

            <div>
              <label className="block text-sm mb-2">Site web</label>
              <input value={form.website} onChange={e => set("website", e.target.value)}
                placeholder="https://monestablissement.fr"
                className="w-full px-4 py-3 bg-input-background border border-border/60 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
          </div>
        )}

        {/* ── Step 1 : Contact ──────────────────────────────────── */}
        {step === 1 && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm mb-2">Prénom *</label>
                <input value={form.firstName} onChange={e => set("firstName", e.target.value)} placeholder="Jean"
                  className="w-full px-4 py-3 bg-input-background border border-border/60 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
              <div>
                <label className="block text-sm mb-2">Nom *</label>
                <input value={form.lastName} onChange={e => set("lastName", e.target.value)} placeholder="Martin"
                  className="w-full px-4 py-3 bg-input-background border border-border/60 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2">Email professionnel *</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="contact@monestablissement.fr"
                  className="w-full pl-11 pr-4 py-3 bg-input-background border border-border/60 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2">Téléphone *</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="tel" value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="+33 6 XX XX XX XX"
                  className="w-full pl-11 pr-4 py-3 bg-input-background border border-border/60 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/15 rounded-xl p-4">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Un conseiller EliteWay vous contactera pour valider votre dossier et vous accompagner dans la configuration de votre espace.
              </p>
            </div>
          </div>
        )}

        {/* ── Step 2 : Offre ────────────────────────────────────── */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <label className="block text-sm mb-2">Description de votre établissement *</label>
              <textarea value={form.description} onChange={e => set("description", e.target.value)} rows={5}
                placeholder="Décrivez ce qui rend votre établissement unique, votre univers, vos services…"
                className="w-full px-4 py-3 bg-input-background border border-border/60 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none" />
            </div>

            <div>
              <label className="block text-sm mb-2">Prix à partir de *</label>
              <input value={form.priceFrom} onChange={e => set("priceFrom", e.target.value)} placeholder="Ex : 35€ par personne"
                className="w-full px-4 py-3 bg-input-background border border-border/60 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>

            <div>
              <label className="block text-sm mb-2">Dress code</label>
              <input value={form.dressCode} onChange={e => set("dressCode", e.target.value)} placeholder="Ex : Tenue élégante requise"
                className="w-full px-4 py-3 bg-input-background border border-border/60 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>

            <div>
              <label className="block text-sm mb-2">Parking & accès</label>
              <input value={form.parking} onChange={e => set("parking", e.target.value)} placeholder="Ex : Parking gratuit sur place"
                className="w-full px-4 py-3 bg-input-background border border-border/60 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
          </div>
        )}

        {/* ── Step 3 : Confirmation ────────────────────────────── */}
        {step === 3 && (
          <div className="space-y-5">
            {/* Summary */}
            <div className="bg-card border border-border/60 rounded-2xl divide-y divide-border/40">
              {[
                { label: "Établissement", value: form.name },
                { label: "Catégorie", value: CATEGORIES.find(c => c.id === form.category)?.label ?? "" },
                { label: "Ville", value: form.city },
                { label: "Contact", value: `${form.firstName} ${form.lastName}` },
                { label: "Email", value: form.email },
                { label: "Téléphone", value: form.phone },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between px-4 py-3">
                  <span className="text-xs text-muted-foreground">{label}</span>
                  <span className="text-xs text-foreground max-w-[180px] text-right truncate">{value}</span>
                </div>
              ))}
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <div onClick={() => set("acceptTerms", !form.acceptTerms)}
                className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${form.acceptTerms ? "bg-primary border-primary" : "border-border"}`}>
                {form.acceptTerms && <Check className="w-3 h-3 text-primary-foreground" />}
              </div>
              <span className="text-sm text-muted-foreground">
                J'accepte les{" "}
                <Link to="/cgu" className="text-primary hover:underline">conditions générales</Link>
                {" "}de la plateforme EliteWay et la{" "}
                <Link to="/confidentialite" className="text-primary hover:underline">politique de confidentialité</Link>.
              </span>
            </label>

            <div className="bg-primary/5 border border-primary/15 rounded-xl p-4">
              <p className="text-xs text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Commission EliteWay :</strong> 12% sur chaque réservation effectuée via la plateforme. Aucun frais fixe.
              </p>
            </div>
          </div>
        )}

        {/* CTA */}
        <button
          onClick={handleNext}
          disabled={!canNext}
          className="w-full py-4 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center gap-2 mt-8 disabled:opacity-40 hover:bg-primary/85 transition-colors"
        >
          {step === 3 ? "Envoyer ma demande" : "Continuer"}
          <ChevronRight className="w-4 h-4" />
        </button>

        {step === 0 && (
          <p className="text-center text-xs text-muted-foreground mt-4">
            Déjà partenaire ?{" "}
            <Link to="/partner/login" className="text-primary hover:underline">Se connecter</Link>
          </p>
        )}
      </div>
    </div>
  );
}
