import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { Eye, EyeOff, Check, X, CheckCircle } from "lucide-react";
import { LogoFull } from "../components/LogoMark";
import { supabase } from "../lib/supabase";

// Page ouverte via le lien reçu par email après "Mot de passe oublié".
// Supabase place automatiquement une session temporaire de récupération
// quand on arrive ici depuis ce lien (detectSessionInUrl: true).
export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Laisse le temps au client Supabase de lire le token de récupération
    // présent dans l'URL avant d'afficher le formulaire.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
        setReady(true);
      }
    });
    const timer = setTimeout(() => setReady(true), 1500);
    return () => {
      subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  const rules = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    digit: /[0-9]/.test(password),
    match: password.length > 0 && password === confirm,
  };
  const valid = Object.values(rules).every(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    setLoading(true);
    setError("");
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (updateError) {
      setError("Ce lien n'est plus valide, refais une demande depuis \"Mot de passe oublié\".");
      return;
    }
    setDone(true);
    setTimeout(() => navigate("/client/login"), 2500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-16 bg-background">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <LogoFull markSize={48} />
        </div>

        {done ? (
          <div className="bg-card rounded-2xl p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem" }} className="mb-2">
              Mot de passe mis à jour
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Tu vas être redirigée vers la connexion…
            </p>
          </div>
        ) : !ready ? (
          <div className="bg-card rounded-2xl p-8 text-center">
            <p className="text-sm text-muted-foreground">Vérification du lien…</p>
          </div>
        ) : (
          <div className="bg-card rounded-2xl p-7">
            <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "1.6rem" }} className="mb-2">
              Nouveau mot de passe
            </h1>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              Choisis un nouveau mot de passe pour ton compte EliteWay.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm mb-2">Nouveau mot de passe</label>
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
                {password && (
                  <ul className="mt-3 space-y-1.5 pl-1">
                    <li className={`flex items-center gap-2 text-xs ${rules.length ? "text-emerald-400" : "text-muted-foreground"}`}>
                      {rules.length ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />} 8 caractères minimum
                    </li>
                    <li className={`flex items-center gap-2 text-xs ${rules.upper ? "text-emerald-400" : "text-muted-foreground"}`}>
                      {rules.upper ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />} Une majuscule
                    </li>
                    <li className={`flex items-center gap-2 text-xs ${rules.digit ? "text-emerald-400" : "text-muted-foreground"}`}>
                      {rules.digit ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />} Un chiffre
                    </li>
                  </ul>
                )}
              </div>

              <div>
                <label className="block text-sm mb-2">Confirmer le mot de passe</label>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 bg-input-background border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-sm ${
                    confirm && !rules.match ? "border-red-500/50" : "border-border"
                  }`}
                  required
                />
              </div>

              {error && (
                <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={!valid || loading}
                className="w-full py-3.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/85 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? "Mise à jour…" : "Mettre à jour le mot de passe"}
              </button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              <Link to="/client/login" className="text-primary hover:underline">
                Retour à la connexion
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
