import { useState } from "react";
import { Mail, Phone, Send, CheckCircle } from "lucide-react";

export function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  // Confirmation simulée en attendant la connexion des données — l'envoi
  // réel d'email sera branché une fois le backend relié au formulaire.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="max-w-lg mx-auto px-5 pb-28 pt-6">
      <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "1.7rem" }} className="mb-2">
        Nous contacter
      </h1>
      <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
        Notre équipe est à votre écoute pour toute question sur vos expériences ou votre compte.
      </p>

      <div className="flex flex-col gap-2.5 mb-8">
        <a href="mailto:support@eliteway.fr" className="flex items-center gap-2.5 text-sm text-primary hover:underline">
          <Mail className="w-4 h-4" /> support@eliteway.fr
        </a>
        <a href="tel:+33100000000" className="flex items-center gap-2.5 text-sm text-primary hover:underline">
          <Phone className="w-4 h-4" /> +33 1 00 00 00 00
        </a>
      </div>

      <div className="pt-8 border-t border-border/30">
        {sent ? (
          <div className="text-center py-6">
            <CheckCircle className="w-8 h-8 text-primary mx-auto mb-3" />
            <p className="text-sm mb-1">Message envoyé</p>
            <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
              Merci, nous revenons vers vous rapidement à l'adresse indiquée.
            </p>
            <button onClick={() => setSent(false)} className="text-xs text-primary hover:underline mt-4">
              Envoyer un autre message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <p className="text-xs uppercase tracking-wider text-muted-foreground/60 mb-1">Ou écrivez-nous directement</p>
            <input
              type="text"
              required
              placeholder="Nom"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full px-3.5 py-3 bg-input-background border border-border/60 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/40"
            />
            <input
              type="email"
              required
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="w-full px-3.5 py-3 bg-input-background border border-border/60 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/40"
            />
            <textarea
              required
              placeholder="Votre message"
              rows={4}
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              className="w-full px-3.5 py-3 bg-input-background border border-border/60 rounded-xl text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/40"
            />
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary text-primary-foreground rounded-xl text-sm"
            >
              <Send className="w-3.5 h-3.5" /> Envoyer
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
