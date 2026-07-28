import { useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";
import { LogoFull } from "../components/LogoMark";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-16 bg-background">
      <div className="w-full max-w-sm">

        <div className="flex justify-center mb-8">
          <LogoFull markSize={48} />
        </div>

        {!sent ? (
          <div className="bg-card border border-border/60 rounded-2xl p-7">
            <Link to="/client/login" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary mb-6 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Retour à la connexion
            </Link>

            <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "1.6rem" }} className="mb-2">
              Mot de passe oublié ?
            </h1>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              Entrez votre email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm mb-2">Adresse email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vous@exemple.fr"
                    className="w-full pl-11 pr-4 py-3 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !email}
                className="w-full py-3.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/85 transition-colors disabled:opacity-40 text-sm"
              >
                {loading ? "Envoi en cours…" : "Envoyer le lien"}
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-card border border-border/60 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem" }} className="mb-2">Email envoyé !</h2>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              Un lien de réinitialisation a été envoyé à <strong className="text-foreground">{email}</strong>.
              Vérifiez votre boîte de réception.
            </p>
            <Link
              to="/client/login"
              className="block w-full py-3.5 bg-primary text-primary-foreground rounded-xl text-sm text-center hover:bg-primary/85 transition-colors"
            >
              Retour à la connexion
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
