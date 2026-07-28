import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Eye, EyeOff } from "lucide-react";
import { useClientAuth } from "../../contexts/ClientAuthContext";
import { LogoFull } from "../../components/LogoMark";

export function ClientLogin() {
  const { login } = useClientAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      navigate("/client/dashboard");
    } else {
      setError(result.error || "Une erreur est survenue.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex justify-center mb-6">
            <LogoFull markSize={48} />
          </Link>
          <h1 className="mb-2">Connexion</h1>
          <p className="text-muted-foreground text-sm">Accédez à votre espace membre</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@exemple.fr"
                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm">Mot de passe</label>
                <a href="#" className="text-xs text-primary hover:underline">Mot de passe oublié ?</a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/85 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? "Connexion…" : "Se connecter"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              Pas encore de compte ?{" "}
              <Link to="/client/register" className="text-primary hover:underline">
                S'inscrire gratuitement
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Vous êtes un établissement ?{" "}
          <Link to="/partner/login" className="text-primary hover:underline">
            Espace partenaire
          </Link>
        </p>
      </div>
    </div>
  );
}
