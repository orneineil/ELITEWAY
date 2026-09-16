import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "../lib/supabase";

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  membershipTier: "essentiel" | "prestige" | "elite";
  createdAt: string;
}

interface RegisterResult {
  success: boolean;
  error?: string;
  requiresEmailConfirmation?: boolean;
}

interface ClientAuthContextType {
  client: Client | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<RegisterResult>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const ClientAuthContext = createContext<ClientAuthContextType | undefined>(undefined);

function splitFullName(fullName: string | null | undefined): { firstName: string; lastName: string } {
  const parts = (fullName || "").trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] || "",
    lastName: parts.slice(1).join(" "),
  };
}

// Va chercher le profil (nom, email, niveau d'abonnement) dans la table
// "profiles" — créée automatiquement par Supabase à l'inscription.
async function loadProfile(userId: string, fallbackEmail: string, createdAt: string): Promise<Client | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, email, membership_tier")
    .eq("id", userId)
    .maybeSingle();

  if (error || !data) return null;

  const { firstName, lastName } = splitFullName(data.full_name);
  return {
    id: data.id,
    firstName,
    lastName,
    email: data.email || fallbackEmail,
    membershipTier: (data.membership_tier as Client["membershipTier"]) || "essentiel",
    createdAt,
  };
}

export function ClientAuthProvider({ children }: { children: ReactNode }) {
  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    // Session déjà ouverte (retour sur l'app, rafraîchissement de page…)
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!active) return;
      if (session?.user) {
        const profile = await loadProfile(session.user.id, session.user.email ?? "", session.user.created_at);
        if (active) setClient(profile);
      }
      if (active) setIsLoading(false);
    });

    // Connexion / déconnexion / rafraîchissement de session en direct
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!active) return;
      if (session?.user) {
        const profile = await loadProfile(session.user.id, session.user.email ?? "", session.user.created_at);
        if (active) setClient(profile);
      } else {
        setClient(null);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const register = async (data: RegisterData): Promise<RegisterResult> => {
    if (data.password.length < 8) {
      return { success: false, error: "Le mot de passe doit contenir au moins 8 caractères." };
    }
    if (!/[A-Z]/.test(data.password)) {
      return { success: false, error: "Le mot de passe doit contenir au moins une majuscule." };
    }
    if (!/[0-9]/.test(data.password)) {
      return { success: false, error: "Le mot de passe doit contenir au moins un chiffre." };
    }

    const emailLower = data.email.toLowerCase().trim();
    const fullName = `${data.firstName.trim()} ${data.lastName.trim()}`.trim();

    const { data: signUpData, error } = await supabase.auth.signUp({
      email: emailLower,
      password: data.password,
      options: { data: { full_name: fullName } },
    });

    if (error) {
      const msg = error.message.toLowerCase();
      if (msg.includes("already registered") || msg.includes("already exists") || msg.includes("user already")) {
        return { success: false, error: "Un compte avec cet email existe déjà." };
      }
      return { success: false, error: error.message };
    }

    if (!signUpData.user) {
      return { success: false, error: "Une erreur est survenue, réessaie dans un instant." };
    }

    // Si la confirmation email est active côté Supabase, aucune session
    // n'est ouverte tant que le lien reçu par email n'a pas été cliqué.
    if (!signUpData.session) {
      return { success: true, requiresEmailConfirmation: true };
    }

    const profile = await loadProfile(signUpData.user.id, emailLower, signUpData.user.created_at);
    setClient(
      profile ?? {
        id: signUpData.user.id,
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        email: emailLower,
        membershipTier: "essentiel",
        createdAt: signUpData.user.created_at,
      }
    );

    return { success: true };
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase().trim(),
      password,
    });

    if (error) {
      return { success: false, error: "Email ou mot de passe incorrect." };
    }
    if (!data.user) {
      return { success: false, error: "Une erreur est survenue, réessaie dans un instant." };
    }

    const profile = await loadProfile(data.user.id, data.user.email ?? "", data.user.created_at);
    setClient(profile);

    return { success: true };
  };

  const logout = () => {
    supabase.auth.signOut();
    setClient(null);
  };

  return (
    <ClientAuthContext.Provider value={{ client, login, register, logout, isAuthenticated: !!client, isLoading }}>
      {children}
    </ClientAuthContext.Provider>
  );
}

export function useClientAuth() {
  const context = useContext(ClientAuthContext);
  if (!context) throw new Error("useClientAuth must be used within ClientAuthProvider");
  return context;
}
