import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface Partner {
  id: string;
  name: string;
  email: string;
  establishmentId: string;
}

interface PartnerAuthContextType {
  partner: Partner | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const PartnerAuthContext = createContext<PartnerAuthContextType | undefined>(undefined);

export function PartnerAuthProvider({ children }: { children: ReactNode }) {
  const [partner, setPartner] = useState<Partner | null>(() => {
    const saved = localStorage.getItem("eliteway-partner");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (partner) {
      localStorage.setItem("eliteway-partner", JSON.stringify(partner));
    } else {
      localStorage.removeItem("eliteway-partner");
    }
  }, [partner]);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication - À remplacer par Supabase
    const mockPartners = [
      {
        id: "partner-1",
        name: "Le Chantecler",
        email: "contact@chantecler.fr",
        password: "demo123",
        establishmentId: "chantecler"
      },
      {
        id: "partner-2",
        name: "Nomad Yachting",
        email: "contact@nomadyachting.fr",
        password: "demo123",
        establishmentId: "nomad-yachting-cannes"
      },
      {
        id: "partner-3",
        name: "Thermes Marins de Monte-Carlo",
        email: "contact@thermesmarins.mc",
        password: "demo123",
        establishmentId: "thermes-marins-monaco"
      }
    ];

    const foundPartner = mockPartners.find(
      p => p.email === email && p.password === password
    );

    if (foundPartner) {
      const { password: _, ...partnerData } = foundPartner;
      setPartner(partnerData);
      return true;
    }

    return false;
  };

  const logout = () => {
    setPartner(null);
  };

  return (
    <PartnerAuthContext.Provider
      value={{
        partner,
        login,
        logout,
        isAuthenticated: !!partner
      }}
    >
      {children}
    </PartnerAuthContext.Provider>
  );
}

export function usePartnerAuth() {
  const context = useContext(PartnerAuthContext);
  if (!context) {
    throw new Error("usePartnerAuth must be used within PartnerAuthProvider");
  }
  return context;
}
