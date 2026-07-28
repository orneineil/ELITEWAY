import { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  Bell, Globe, Lock, Moon, Trash2, ChevronRight, LogOut,
  Shield, HelpCircle, Mail, Phone, User, Eye, EyeOff,
  Check, X, Crown, Star, MessageCircle, ChevronDown,
} from "lucide-react";
import { useClientAuth } from "../contexts/ClientAuthContext";

// ── Toggle row ────────────────────────────────────────────────────────────────
function Toggle({ label, desc, value, onChange }: { label: string; desc?: string; value: boolean; onChange: () => void }) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-border/40 last:border-0">
      <div className="flex-1 min-w-0 mr-4">
        <p className="text-sm">{label}</p>
        {desc && <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>}
      </div>
      <button
        onClick={onChange}
        className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${value ? "bg-primary" : "bg-muted"}`}
        aria-checked={value}
        role="switch"
      >
        <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${value ? "translate-x-6" : "translate-x-1"}`} />
      </button>
    </div>
  );
}

// ── Section header ────────────────────────────────────────────────────────────
function SectionTitle({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <p className="text-xs uppercase tracking-wider text-muted-foreground/60 mb-2.5 flex items-center gap-2 px-1">
      <Icon className="w-3.5 h-3.5" /> {label}
    </p>
  );
}

// ── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ msg, onClose }: { msg: string; onClose: () => void }) {
  return (
    <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 bg-foreground text-background rounded-2xl shadow-xl text-sm max-w-xs">
      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
      <span>{msg}</span>
      <button onClick={onClose} className="ml-auto shrink-0"><X className="w-3.5 h-3.5 opacity-50" /></button>
    </div>
  );
}

export function SettingsPage() {
  const { client, logout } = useClientAuth();
  const navigate = useNavigate();

  // Toast
  const [toast, setToast] = useState("");
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  // Profile edit
  const [editProfile, setEditProfile] = useState(false);
  const [profile, setProfile] = useState({
    firstName: client?.firstName ?? "",
    lastName: client?.lastName ?? "",
    email: client?.email ?? "",
  });

  // Change password
  const [showPwd, setShowPwd] = useState(false);
  const [pwd, setPwd] = useState({ current: "", next: "", confirm: "" });
  const [showPwdVis, setShowPwdVis] = useState({ current: false, next: false });
  const pwdValid = pwd.current.length >= 4 && pwd.next.length >= 8 && pwd.next === pwd.confirm;

  // Phone
  const [showPhone, setShowPhone] = useState(false);
  const [phone, setPhone] = useState("+33 6 ");

  // Notifications
  const [notifs, setNotifs] = useState({
    tables: true, offers: true, events: false, rewards: true, marketing: false,
  });

  // Apparence
  const [lang, setLang] = useState("fr");
  const [currency, setCurrency] = useState("EUR");

  // Privacy
  const [privacy, setPrivacy] = useState({
    profileVisible: true, shareData: false, analytics: true,
  });

  // Delete confirm
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");

  // FAQ
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const faqs = [
    { q: "Comment annuler une réservation ?", a: "Rendez-vous dans Mes Réservations, sélectionnez la réservation puis appuyez sur Annuler. L'annulation est gratuite jusqu'à 24h avant." },
    { q: "Comment accéder aux offres Prestige ?", a: "Souscrivez à l'abonnement Prestige depuis la page Membership. Vous débloquez immédiatement toutes les offres exclusives." },
    { q: "Mes points expirent-ils ?", a: "Les points EliteWay Rewards sont valables 24 mois à partir de leur date d'obtention." },
    { q: "Comment contacter un établissement partenaire ?", a: "Depuis la fiche de l'établissement, appuyez sur le bouton Contacter ou Réserver pour entrer en relation directement." },
  ];

  return (
    <div className="max-w-sm mx-auto pb-32 pt-4 px-5">
      {/* Header */}
      <p className="text-xs uppercase tracking-[0.2em] text-primary mb-1">Compte & Préférences</p>
      <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "1.8rem" }} className="mb-6">Paramètres</h1>

      {/* ── PROFIL ─────────────────────────────────────────────────────────── */}
      <div className="mb-6">
        <SectionTitle icon={User} label="Mon profil" />
        <div className="bg-card border border-border/50 rounded-2xl overflow-hidden">
          {/* Profile header */}
          <div className="flex items-center gap-4 px-4 py-4 border-b border-border/40">
            <div className="w-12 h-12 rounded-2xl bg-primary/15 flex items-center justify-center shrink-0">
              <span style={{ fontFamily: "var(--font-heading)", fontSize: "1.2rem" }} className="text-primary">
                {(client?.firstName?.[0] ?? "E")}{(client?.lastName?.[0] ?? "")}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm">{client ? `${client.firstName} ${client.lastName}` : "Non connecté"}</p>
              <p className="text-xs text-muted-foreground truncate">{client?.email ?? "—"}</p>
              {client && (
                <div className="flex items-center gap-1 mt-1">
                  <Crown className="w-3 h-3 text-primary" />
                  <span className="text-xs text-primary capitalize">{client.membershipTier}</span>
                </div>
              )}
            </div>
            <button onClick={() => setEditProfile(!editProfile)} className="text-xs text-primary hover:underline shrink-0">
              {editProfile ? "Fermer" : "Modifier"}
            </button>
          </div>

          {/* Edit form */}
          {editProfile && (
            <div className="px-4 py-4 bg-muted/20 border-b border-border/40 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">Prénom</label>
                  <input value={profile.firstName} onChange={e => setProfile({ ...profile, firstName: e.target.value })}
                    className="w-full px-3 py-2 bg-input-background border border-border/60 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">Nom</label>
                  <input value={profile.lastName} onChange={e => setProfile({ ...profile, lastName: e.target.value })}
                    className="w-full px-3 py-2 bg-input-background border border-border/60 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
              </div>
              <button onClick={() => { setEditProfile(false); showToast("Profil mis à jour"); }}
                className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl text-sm hover:bg-primary/85 transition-colors">
                Enregistrer
              </button>
            </div>
          )}

          {/* Mon abonnement */}
          <Link to="/membership" className="flex items-center justify-between px-4 py-3.5 hover:bg-accent/50 transition-colors border-b border-border/40">
            <div className="flex items-center gap-3">
              <Crown className="w-4 h-4 text-primary" />
              <span className="text-sm">Mon abonnement</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-primary capitalize">{client?.membershipTier ?? "—"}</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground/40" />
            </div>
          </Link>

          {/* Programme fidélité */}
          <Link to="/rewards" className="flex items-center justify-between px-4 py-3.5 hover:bg-accent/50 transition-colors">
            <div className="flex items-center gap-3">
              <Star className="w-4 h-4 text-primary fill-primary" />
              <span className="text-sm">EliteWay Rewards</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-primary">240 pts</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground/40" />
            </div>
          </Link>
        </div>
      </div>

      {/* ── SÉCURITÉ ───────────────────────────────────────────────────────── */}
      <div className="mb-6">
        <SectionTitle icon={Lock} label="Sécurité" />
        <div className="bg-card border border-border/50 rounded-2xl overflow-hidden divide-y divide-border/40">

          {/* Changer le mot de passe */}
          <button onClick={() => setShowPwd(!showPwd)}
            className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-accent/50 transition-colors">
            <div className="flex items-center gap-3">
              <Lock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">Changer le mot de passe</span>
            </div>
            <ChevronDown className={`w-4 h-4 text-muted-foreground/40 transition-transform ${showPwd ? "rotate-180" : ""}`} />
          </button>
          {showPwd && (
            <div className="px-4 py-4 bg-muted/20 space-y-3">
              {[
                { key: "current", label: "Mot de passe actuel", vis: showPwdVis.current, toggle: () => setShowPwdVis(v => ({ ...v, current: !v.current })) },
                { key: "next",    label: "Nouveau mot de passe",  vis: showPwdVis.next,    toggle: () => setShowPwdVis(v => ({ ...v, next: !v.next })) },
                { key: "confirm", label: "Confirmer",              vis: showPwdVis.next,    toggle: () => {} },
              ].map(({ key, label, vis, toggle }) => (
                <div key={key}>
                  <label className="block text-xs text-muted-foreground mb-1">{label}</label>
                  <div className="relative">
                    <input
                      type={vis ? "text" : "password"}
                      value={(pwd as any)[key]}
                      onChange={e => setPwd({ ...pwd, [key]: e.target.value })}
                      className="w-full pl-3 pr-9 py-2.5 bg-input-background border border-border/60 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="••••••••"
                    />
                    {key !== "confirm" && (
                      <button type="button" onClick={toggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        {vis ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {pwd.next && pwd.confirm && pwd.next !== pwd.confirm && (
                <p className="text-xs text-red-400">Les mots de passe ne correspondent pas.</p>
              )}
              <button
                disabled={!pwdValid}
                onClick={() => { setShowPwd(false); setPwd({ current: "", next: "", confirm: "" }); showToast("Mot de passe mis à jour"); }}
                className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl text-sm disabled:opacity-40 hover:bg-primary/85 transition-colors">
                Enregistrer
              </button>
            </div>
          )}

          {/* Modifier l'email */}
          <div className="px-4 py-3.5">
            <div className="flex items-center gap-3 mb-0.5">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">Adresse email</span>
            </div>
            <p className="text-xs text-muted-foreground pl-7">{client?.email ?? "Non renseignée"}</p>
          </div>

          {/* Téléphone */}
          <button onClick={() => setShowPhone(!showPhone)}
            className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-accent/50 transition-colors">
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">Numéro de téléphone</span>
            </div>
            <ChevronDown className={`w-4 h-4 text-muted-foreground/40 transition-transform ${showPhone ? "rotate-180" : ""}`} />
          </button>
          {showPhone && (
            <div className="px-4 py-3 bg-muted/20 flex gap-2">
              <input value={phone} onChange={e => setPhone(e.target.value)} type="tel" placeholder="+33 6 XX XX XX XX"
                className="flex-1 px-3 py-2.5 bg-input-background border border-border/60 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
              <button onClick={() => { setShowPhone(false); showToast("Téléphone enregistré"); }}
                className="px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm">OK</button>
            </div>
          )}
        </div>
      </div>

      {/* ── NOTIFICATIONS ──────────────────────────────────────────────────── */}
      <div className="mb-6">
        <SectionTitle icon={Bell} label="Notifications" />
        <div className="bg-card border border-border/50 rounded-2xl px-4">
          <Toggle label="Table libérée" desc="Alertes en temps réel" value={notifs.tables} onChange={() => setNotifs(n => ({ ...n, tables: !n.tables }))} />
          <Toggle label="Offres exclusives" desc="Nouveautés membres" value={notifs.offers} onChange={() => setNotifs(n => ({ ...n, offers: !n.offers }))} />
          <Toggle label="Événements à venir" value={notifs.events} onChange={() => setNotifs(n => ({ ...n, events: !n.events }))} />
          <Toggle label="Programme fidélité" desc="Points et récompenses" value={notifs.rewards} onChange={() => setNotifs(n => ({ ...n, rewards: !n.rewards }))} />
          <Toggle label="Communications marketing" value={notifs.marketing} onChange={() => setNotifs(n => ({ ...n, marketing: !n.marketing }))} />
        </div>
      </div>

      {/* ── APPARENCE & LANGUE ─────────────────────────────────────────────── */}
      <div className="mb-6">
        <SectionTitle icon={Moon} label="Apparence & Langue" />
        <div className="bg-card border border-border/50 rounded-2xl overflow-hidden divide-y divide-border/40">
          {/* Mode sombre — toujours actif */}
          <div className="flex items-center justify-between px-4 py-3.5">
            <span className="text-sm">Mode sombre</span>
            <div className="w-11 h-6 rounded-full bg-primary relative opacity-70 cursor-not-allowed">
              <span className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full shadow" />
            </div>
          </div>
          {/* Langue */}
          <div className="flex items-center justify-between px-4 py-3.5">
            <span className="text-sm">Langue</span>
            <div className="flex gap-1.5">
              {[["fr", "Français"], ["en", "English"]].map(([l, name]) => (
                <button key={l} onClick={() => { setLang(l); showToast(`Langue changée : ${name}`); }}
                  className={`px-3 py-1 rounded-lg text-xs transition-colors ${lang === l ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  {name}
                </button>
              ))}
            </div>
          </div>
          {/* Devise */}
          <div className="flex items-center justify-between px-4 py-3.5">
            <span className="text-sm">Devise</span>
            <div className="flex gap-1.5">
              {["EUR", "USD", "GBP"].map((c) => (
                <button key={c} onClick={() => { setCurrency(c); showToast(`Devise : ${c}`); }}
                  className={`px-2.5 py-1 rounded-lg text-xs transition-colors ${currency === c ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── CONFIDENTIALITÉ ────────────────────────────────────────────────── */}
      <div className="mb-6">
        <SectionTitle icon={Shield} label="Confidentialité" />
        <div className="bg-card border border-border/50 rounded-2xl px-4">
          <Toggle label="Profil visible" desc="Autres membres peuvent voir votre statut" value={privacy.profileVisible} onChange={() => setPrivacy(p => ({ ...p, profileVisible: !p.profileVisible }))} />
          <Toggle label="Partage des données partenaires" desc="Pour des recommandations personnalisées" value={privacy.shareData} onChange={() => setPrivacy(p => ({ ...p, shareData: !p.shareData }))} />
          <Toggle label="Statistiques d'utilisation anonymes" value={privacy.analytics} onChange={() => setPrivacy(p => ({ ...p, analytics: !p.analytics }))} />
        </div>
        <div className="bg-card border border-border/50 rounded-2xl overflow-hidden divide-y divide-border/40 mt-2">
          {[["Politique de confidentialité", "/confidentialite"], ["CGU", "/cgu"], ["Mentions légales", "/mentions-legales"]].map(([label, href]) => (
            <Link key={label} to={href} className="flex items-center justify-between px-4 py-3.5 hover:bg-accent/50 transition-colors">
              <span className="text-sm">{label}</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground/40" />
            </Link>
          ))}
        </div>
      </div>

      {/* ── AIDE & FAQ ─────────────────────────────────────────────────────── */}
      <div className="mb-6">
        <SectionTitle icon={HelpCircle} label="Aide & Support" />
        <div className="bg-card border border-border/50 rounded-2xl overflow-hidden mb-2">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-border/40 last:border-0">
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-accent/50 transition-colors text-left">
                <span className="text-sm pr-3">{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-muted-foreground/40 shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
              </button>
              {openFaq === i && (
                <div className="px-4 pb-4">
                  <p className="text-xs text-muted-foreground leading-relaxed bg-muted/30 rounded-xl p-3">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="bg-card border border-border/50 rounded-2xl overflow-hidden divide-y divide-border/40">
          <a href="mailto:support@eliteway.fr" className="flex items-center gap-3 px-4 py-3.5 hover:bg-accent/50 transition-colors">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">support@eliteway.fr</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground/40 ml-auto" />
          </a>
          <a href="tel:+33100000000" className="flex items-center gap-3 px-4 py-3.5 hover:bg-accent/50 transition-colors">
            <Phone className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">+33 1 00 00 00 00</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground/40 ml-auto" />
          </a>
          <div className="flex items-center justify-between px-4 py-3.5">
            <div className="flex items-center gap-3">
              <MessageCircle className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Version de l'app</span>
            </div>
            <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">1.0.0 MVP</span>
          </div>
        </div>
      </div>

      {/* ── DÉCONNEXION & SUPPRESSION ──────────────────────────────────────── */}
      <div className="mb-6">
        <div className="bg-card border border-border/50 rounded-2xl overflow-hidden divide-y divide-border/40">
          {client && (
            <button onClick={() => { logout(); navigate("/"); }}
              className="w-full flex items-center gap-3 px-4 py-4 text-muted-foreground hover:bg-accent/50 transition-colors">
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Se déconnecter</span>
            </button>
          )}
          <button onClick={() => setDeleteConfirm(true)}
            className="w-full flex items-center gap-3 px-4 py-4 text-red-400 hover:bg-red-500/5 transition-colors">
            <Trash2 className="w-4 h-4" />
            <span className="text-sm">Supprimer mon compte</span>
          </button>
        </div>
      </div>

      {/* ── MODALE SUPPRESSION ─────────────────────────────────────────────── */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: "rgba(0,0,0,0.7)" }}>
          <div className="w-full max-w-sm bg-card rounded-t-3xl p-6 pb-10">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-400" />
            </div>
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.3rem" }} className="text-center mb-2">
              Supprimer le compte ?
            </h3>
            <p className="text-xs text-muted-foreground text-center mb-5 leading-relaxed">
              Cette action est irréversible. Toutes vos données, réservations et points Rewards seront définitivement supprimés.
            </p>
            <p className="text-xs text-muted-foreground mb-2">Tapez <strong className="text-foreground">SUPPRIMER</strong> pour confirmer :</p>
            <input value={deleteInput} onChange={e => setDeleteInput(e.target.value)}
              placeholder="SUPPRIMER"
              className="w-full px-4 py-3 bg-input-background border border-border/60 rounded-xl text-sm mb-4 focus:outline-none focus:ring-1 focus:ring-red-500 tracking-widest" />
            <button
              disabled={deleteInput !== "SUPPRIMER"}
              onClick={() => { logout(); navigate("/"); }}
              className="w-full py-3.5 bg-red-500 text-white rounded-2xl text-sm mb-3 disabled:opacity-30 hover:bg-red-600 transition-colors">
              Supprimer définitivement
            </button>
            <button onClick={() => { setDeleteConfirm(false); setDeleteInput(""); }}
              className="w-full py-3 border border-border/60 rounded-2xl text-sm text-muted-foreground">
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* ── TOAST ──────────────────────────────────────────────────────────── */}
      {toast && <Toast msg={toast} onClose={() => setToast("")} />}
    </div>
  );
}
