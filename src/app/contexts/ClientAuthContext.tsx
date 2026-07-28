import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  membershipTier: "essentiel" | "prestige" | "elite";
  createdAt: string;
}

interface ClientAuthContextType {
  client: Client | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const ClientAuthContext = createContext<ClientAuthContextType | undefined>(undefined);

// Simulated secure password hashing (in production: use bcrypt via Supabase)
function hashPassword(password: string): string {
  // Simple deterministic hash for demo — replace with real hashing in production
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    hash = ((hash << 5) - hash) + password.charCodeAt(i);
    hash |= 0;
  }
  return `hashed_${Math.abs(hash).toString(36)}`;
}

const STORAGE_KEY = "eliteway-client";
const CLIENTS_KEY = "eliteway-clients-db";

export function ClientAuthProvider({ children }: { children: ReactNode }) {
  const [client, setClient] = useState<Client | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (client) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(client));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [client]);

  const getClientsDb = (): Array<Client & { passwordHash: string }> => {
    try {
      const db = localStorage.getItem(CLIENTS_KEY);
      return db ? JSON.parse(db) : [];
    } catch {
      return [];
    }
  };

  const saveClientsDb = (clients: Array<Client & { passwordHash: string }>) => {
    localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients));
  };

  const register = async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
    if (data.password.length < 8) {
      return { success: false, error: "Le mot de passe doit contenir au moins 8 caractères." };
    }
    if (!/[A-Z]/.test(data.password)) {
      return { success: false, error: "Le mot de passe doit contenir au moins une majuscule." };
    }
    if (!/[0-9]/.test(data.password)) {
      return { success: false, error: "Le mot de passe doit contenir au moins un chiffre." };
    }

    const clients = getClientsDb();
    const emailLower = data.email.toLowerCase().trim();

    if (clients.find((c) => c.email === emailLower)) {
      return { success: false, error: "Un compte avec cet email existe déjà." };
    }

    const newClient: Client & { passwordHash: string } = {
      id: `client-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      email: emailLower,
      membershipTier: "essentiel",
      createdAt: new Date().toISOString(),
      passwordHash: hashPassword(data.password),
    };

    saveClientsDb([...clients, newClient]);

    const { passwordHash: _, ...clientData } = newClient;
    setClient(clientData);
    return { success: true };
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const clients = getClientsDb();
    const emailLower = email.toLowerCase().trim();
    const found = clients.find(
      (c) => c.email === emailLower && c.passwordHash === hashPassword(password)
    );

    if (!found) {
      return { success: false, error: "Email ou mot de passe incorrect." };
    }

    const { passwordHash: _, ...clientData } = found;
    setClient(clientData);
    return { success: true };
  };

  const logout = () => {
    setClient(null);
  };

  return (
    <ClientAuthContext.Provider value={{ client, login, register, logout, isAuthenticated: !!client }}>
      {children}
    </ClientAuthContext.Provider>
  );
}

export function useClientAuth() {
  const context = useContext(ClientAuthContext);
  if (!context) throw new Error("useClientAuth must be used within ClientAuthProvider");
  return context;
}
