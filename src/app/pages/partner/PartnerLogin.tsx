import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Lock, Mail, ArrowLeft } from "lucide-react";
import { usePartnerAuth } from "../../contexts/PartnerAuthContext";

export function PartnerLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = usePartnerAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        navigate("/partner/dashboard");
      } else {
        setError("Email ou mot de passe incorrect");
      }
    } catch (err) {
      setError("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour au site</span>
        </Link>

        <div className="bg-card border border-border rounded-lg p-8">
          <div className="text-center mb-8">
            <h1 className="mb-2">Espace Partenaire</h1>
            <p className="text-muted-foreground">
              Connectez-vous pour gérer votre établissement
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="votre@email.fr"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border">
            <p className="text-sm text-muted-foreground mb-2">
              Comptes de démonstration :
            </p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• contact@legrand.fr / demo123</li>
              <li>• contact@azurdreams.fr / demo123</li>
              <li>• contact@spaserenite.fr / demo123</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
