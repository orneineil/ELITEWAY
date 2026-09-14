import { useState } from "react";
import { Link, Outlet, ScrollRestoration, useLocation } from "react-router";
import { Mail, Phone, Send, CheckCircle } from "lucide-react";
import { Header } from "./components/Header";
import { BottomNav } from "./components/BottomNav";
import { LogoFull } from "./components/LogoMark";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import { PartnerAuthProvider } from "./contexts/PartnerAuthContext";
import { ClientAuthProvider } from "./contexts/ClientAuthContext";
import { NotificationsProvider } from "./contexts/NotificationsContext";
import { AIAssistant } from "./components/AIAssistant";

export function Root() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  // Fiche de contact du footer — confirmation simulée en attendant la
  // connexion des données (l'envoi réel d'email sera branché ensuite).
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [contactSent, setContactSent] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSent(true);
    setContactForm({ name: "", email: "", message: "" });
  };

  return (
    <ClientAuthProvider>
      <PartnerAuthProvider>
        <NotificationsProvider>
        <FavoritesProvider>
          <div className="min-h-screen bg-background">
            <Header />
            <main className={isHome ? "pt-0" : "pt-14"}>
              <Outlet />
            </main>

            {/* ── Footer léger : identité + contact ─────────────────────── */}
            <footer className="border-t border-border/30 pt-10 pb-10 mt-16">
              <div className="max-w-lg mx-auto px-5">
                <div className="flex flex-col items-center text-center mb-8">
                  <LogoFull markSize={32} className="mb-2.5" />
                  <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
                    La plateforme des expériences haut de gamme — gastronomie, navigation,
                    bien-être, aviation et bien plus.
                  </p>
                </div>

                <div className="pt-8 border-t border-border/30 text-left">
                  <p className="text-sm mb-1 text-center">Vous souhaitez nous contacter ?</p>
                  <p className="text-xs text-muted-foreground mb-5 max-w-xs mx-auto leading-relaxed text-center">
                    Notre équipe est à votre écoute pour toute question sur vos expériences
                    ou votre compte.
                  </p>

                  {contactSent ? (
                    <div className="flex flex-col items-center text-center py-4">
                      <CheckCircle className="w-8 h-8 text-primary mb-3" />
                      <p className="text-sm mb-1">Message envoyé</p>
                      <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
                        Merci, nous revenons vers vous rapidement à l'adresse indiquée.
                      </p>
                      <button
                        onClick={() => setContactSent(false)}
                        className="text-xs text-primary hover:underline mt-4"
                      >
                        Envoyer un autre message
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-3 max-w-xs mx-auto">
                      <input
                        type="text"
                        required
                        placeholder="Nom"
                        value={contactForm.name}
                        onChange={(e) => setContactForm((f) => ({ ...f, name: e.target.value }))}
                        className="w-full px-3.5 py-2.5 bg-input-background border border-border/60 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                      <input
                        type="email"
                        required
                        placeholder="Email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm((f) => ({ ...f, email: e.target.value }))}
                        className="w-full px-3.5 py-2.5 bg-input-background border border-border/60 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                      <textarea
                        required
                        placeholder="Votre message"
                        rows={3}
                        value={contactForm.message}
                        onChange={(e) => setContactForm((f) => ({ ...f, message: e.target.value }))}
                        className="w-full px-3.5 py-2.5 bg-input-background border border-border/60 rounded-xl text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                      <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground rounded-xl text-sm"
                      >
                        <Send className="w-3.5 h-3.5" /> Envoyer
                      </button>

                      <div className="flex flex-col items-center gap-2 pt-2">
                        <a href="mailto:support@eliteway.fr" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors">
                          <Mail className="w-3 h-3" /> support@eliteway.fr
                        </a>
                        <a href="tel:+33100000000" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors">
                          <Phone className="w-3 h-3" /> +33 1 00 00 00 00
                        </a>
                      </div>
                    </form>
                  )}
                </div>

                <div className="mt-8 pt-6 border-t border-border/30 flex items-center justify-center gap-5 flex-wrap">
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
                <p className="text-center text-[10px] text-muted-foreground/40 mt-3">
                  © 2026 EliteWay SAS · Paris, France
                </p>
              </div>
            </footer>

            <AIAssistant />
            <BottomNav />
            <ScrollRestoration />
          </div>
        </FavoritesProvider>
        </NotificationsProvider>
      </PartnerAuthProvider>
    </ClientAuthProvider>
  );
}
