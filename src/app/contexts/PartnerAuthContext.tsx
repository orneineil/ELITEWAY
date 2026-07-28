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
        name: "Le Grand",
        email: "contact@legrand.fr",
        password: "demo123",
        establishmentId: "restaurant-le-grand"
      },
      {
        id: "partner-2",
        name: "Azur Dreams",
        email: "contact@azurdreams.fr",
        password: "demo123",
        establishmentId: "yacht-azur"
      },
      {
        id: "partner-3",
        name: "Spa Sérénité",
        email: "contact@spaserenite.fr",
        password: "demo123",
        establishmentId: "spa-serenite"
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
