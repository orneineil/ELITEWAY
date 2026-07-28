import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Eye, EyeOff, Check, X } from "lucide-react";
import { useClientAuth } from "../../contexts/ClientAuthContext";
import { LogoFull } from "../../components/LogoMark";

function PasswordRule({ ok, label }: { ok: boolean; label: string }) {
  return (
    <li className={`flex items-center gap-2 text-xs ${ok ? "text-emerald-400" : "text-muted-foreground"}`}>
      {ok ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
      {label}
    </li>
  );
}

export function ClientRegister() {
  const { register } = useClientAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", confirm: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const pw = form.password;
  const rules = {
    length: pw.length >= 8,
    upper: /[A-Z]/.test(pw),
    digit: /[0-9]/.test(pw),
    match: pw.length > 0 && pw === form.confirm,
  };

  const valid = Object.values(rules).every(Boolean) && agreed &&
    form.firstName.trim() && form.lastName.trim() && form.email.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    setLoading(true);
    setError("");
    const result = await register({
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      password: form.password,
    });
    setLoading(false);
    if (result.success) {
      navigate("/client/dashboard");
    } else {
      setError(result.error || "Une erreur est survenue.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex justify-center mb-6">
            <LogoFull markSize={48} />
          </Link>
          <h1 className="mb-2">Créer un compte</h1>
          <p className="text-muted-foreground text-sm">Rejoignez la communauté EliteWay</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-2">Prénom</label>
                <input
                  type="text"
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  placeholder="Jean"
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-2">Nom</label>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  placeholder="Dupont"
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2">Adresse email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="vous@exemple.fr"
                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-2">Mot de passe</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
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
              {form.password && (
                <ul className="mt-2 space-y-1 pl-1">
                  <PasswordRule ok={rules.length} label="8 caractères minimum" />
                  <PasswordRule ok={rules.upper} label="Une majuscule" />
                  <PasswordRule ok={rules.digit} label="Un chiffre" />
                </ul>
              )}
            </div>

            <div>
              <label className="block text-sm mb-2">Confirmer le mot de passe</label>
              <input
                type="password"
                value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                placeholder="••••••••"
                className={`w-full px-4 py-3 bg-input-background border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-sm ${
                  form.confirm && !rules.match ? "border-red-500/50" : "border-border"
                }`}
                required
              />
              {form.confirm && !rules.match && (
                <p className="text-xs text-red-400 mt-1">Les mots de passe ne correspondent pas.</p>
              )}
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <div
                onClick={() => setAgreed(!agreed)}
                className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                  agreed ? "bg-primary border-primary" : "border-border"
                }`}
              >
                {agreed && <Check className="w-3 h-3 text-primary-foreground" />}
              </div>
              <span className="text-sm text-muted-foreground">
                J'accepte les{" "}
                <Link to="/cgu" className="text-primary hover:underline">conditions d'utilisation</Link>
                {" "}et la{" "}
                <Link to="/confidentialite" className="text-primary hover:underline">politique de confidentialité</Link>.
              </span>
            </label>

            {error && (
              <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={!valid || loading}
              className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/85 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? "Création en cours…" : "Créer mon compte"}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Déjà membre ?{" "}
            <Link to="/client/login" className="text-primary hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
