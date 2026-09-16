import { createContext, useContext, useState, ReactNode } from "react";

export interface ConciergeMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  links?: Array<{ label: string; href: string }>;
}

export const CONCIERGE_SUGGESTIONS = [
  "Week-end romantique Cannes",
  "Dîner anniversaire Nice",
  "Journée détente spa",
  "Sortie yacht Monaco",
];

const MOCK_RESPONSES: Record<string, { content: string; links: Array<{ label: string; href: string }> }> = {
  "Week-end romantique Cannes": {
    content: `Voici un week-end romantique parfait sur la Côte d'Azur — budget estimé : 240€/pers.

**Vendredi soir** — Arrivée & dîner
La Palme d'Or, à l'Hôtel Martinez, pour un dîner étoilé face à la mer. Décor Art déco, cuisine méditerranéenne raffinée et rosé local.

**Samedi matin** — Spa & bien-être
Villa Thalgo à Cannes : massage en duo + accès piscine d'eau de mer vue baie. Réservez tôt, places limitées (dès 45€/pers.).

**Samedi après-midi** — Sortie voilier
Nomad Yachting : demi-journée en mer avec pique-nique aux Îles de Lérins. Snorkeling & coucher de soleil inoubliable (55€/pers.).

**Dimanche** — Brunch & retour
Marché Forville le matin puis déjeuner terrasse.`,
    links: [
      { label: "La Palme d'Or", href: "/establishment/palme-dor" },
      { label: "Villa Thalgo", href: "/establishment/villa-thalgo-cannes" },
      { label: "Nomad Yachting", href: "/establishment/nomad-yachting-cannes" },
    ],
  },
  "Dîner anniversaire Nice": {
    content: `Pour un dîner d'anniversaire mémorable à Nice, voici ma sélection :

**Le Chantecler** — Table étoilée de l'Hôtel Negresco
Salle Régence classée, cuisine gastronomique raffinée. Cadre historique idéal pour une soirée d'exception sur la Promenade des Anglais.

Pensez à réserver à l'avance, les tables sont très demandées. Je recommande le menu dégustation avec le rosé de Bellet, un grand cru de Nice.

Budget estimé : 140-260€/pers.`,
    links: [
      { label: "Réserver Le Chantecler", href: "/establishment/chantecler" },
      { label: "Château de Bellet (vins)", href: "/establishment/chateau-de-bellet-nice" },
    ],
  },
  "Journée détente spa": {
    content: `Voici la journée détente idéale sur la Côte d'Azur :

**Matin** — Soins signature (9h)
Villa Thalgo à Cannes : soins visage et corps aux extraits marins, accès piscine d'eau de mer vue baie (dès 45€).

**Milieu de journée** — Spa d'exception (11h)
Spa Valmont Monte-Carlo : rituel visage à la cosmétique cellulaire suisse Valmont, piscine intérieure signée Karl Lagerfeld.

**Après-midi** — Thalasso (15h)
Thermes Marins de Monte-Carlo pour la piscine d'eau de mer chauffée face au Rocher. Détente ultime (accès journée dès 190€).

Une journée de pur bien-être entre Cannes et Monaco.`,
    links: [
      { label: "Villa Thalgo", href: "/establishment/villa-thalgo-cannes" },
      { label: "Spa Valmont Monte-Carlo", href: "/establishment/spa-valmont-metropole" },
      { label: "Thermes Marins de Monte-Carlo", href: "/establishment/thermes-marins-monaco" },
    ],
  },
  "Sortie yacht Monaco": {
    content: `Pour une sortie yacht au départ de Monaco :

**Option 1 — Charter Fraser Yachts**
Fraser Yachts organise des sorties sur mesure autour du Rocher, avec possibilité de coucher de soleil, champagne et catering à bord — sur devis selon le yacht choisi.

**Option 2 — Journée Saint-Tropez avec Y.CO**
Y.CO peut organiser une journée personnalisée vers Saint-Tropez à bord d'un yacht de sa sélection, avec chef privé et activités nautiques.

Je recommande l'option 1 pour une soirée magique avec la vue sur le Rocher illuminé.`,
    links: [
      { label: "Fraser Yachts", href: "/establishment/fraser-yachts-monaco" },
      { label: "Y.CO", href: "/establishment/yco-monaco" },
    ],
  },
};

function getResponse(msg: string): { content: string; links: Array<{ label: string; href: string }> } {
  const lower = msg.toLowerCase();
  for (const [key, val] of Object.entries(MOCK_RESPONSES)) {
    if (lower.includes(key.toLowerCase().split(" ")[0]) || lower === key.toLowerCase()) {
      return val;
    }
  }
  if (lower.includes("restaurant") || lower.includes("dîner") || lower.includes("manger")) {
    return {
      content: "Pour une table d'exception sur la Côte d'Azur, je recommande Le Chantecler à Nice (étoilé, Hôtel Negresco) ou La Palme d'Or à Cannes (2 étoiles Michelin, Hôtel Martinez). Souhaitez-vous une suggestion personnalisée ?",
      links: [
        { label: "Le Chantecler", href: "/establishment/chantecler" },
        { label: "La Palme d'Or", href: "/establishment/palme-dor" },
      ],
    };
  }
  if (lower.includes("spa") || lower.includes("bien-être") || lower.includes("massage")) {
    return {
      content: "Notre spa partenaire le plus prestigieux est les Thermes Marins de Monte-Carlo — institut de thalassothérapie mythique face au Rocher, dès 190€. Pour une adresse plus accessible, Villa Thalgo à Cannes est excellente (dès 45€).",
      links: [
        { label: "Thermes Marins de Monte-Carlo", href: "/establishment/thermes-marins-monaco" },
        { label: "Villa Thalgo", href: "/establishment/villa-thalgo-cannes" },
      ],
    };
  }
  if (lower.includes("yacht") || lower.includes("bateau") || lower.includes("voilier")) {
    return {
      content: "Pour une sortie en mer, Nomad Yachting propose des journées ou demi-journées aux Îles de Lérins au départ de Cannes — idéal pour les familles. Pour un charter de superyacht plus exclusif, Camper & Nicholsons ou Y.CO organisent des séjours sur mesure en Méditerranée.",
      links: [
        { label: "Nomad Yachting", href: "/establishment/nomad-yachting-cannes" },
        { label: "Camper & Nicholsons", href: "/establishment/camper-nicholsons-antibes" },
      ],
    };
  }
  return {
    content: "Je suis votre conciergerie EliteWay, spécialiste de la Côte d'Azur. Dites-moi ce que vous cherchez : gastronomie, navigation, bien-être, aviation, œnologie… ou choisissez une suggestion ci-dessus pour commencer.",
    links: [],
  };
}

const STORAGE_KEY = "eliteway-concierge-messages";

function welcomeMessage(): ConciergeMessage {
  return {
    id: "0",
    role: "assistant",
    content: "Bonjour ! Je suis votre conciergerie EliteWay. Comment puis-je vous aider à concevoir votre prochaine expérience sur la Côte d'Azur ?",
    timestamp: new Date().toISOString(),
  };
}

function loadInitialMessages(): ConciergeMessage[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // ignore corrupted storage
  }
  return [welcomeMessage()];
}

interface ConciergeContextType {
  messages: ConciergeMessage[];
  isTyping: boolean;
  suggestions: string[];
  sendMessage: (text: string) => void;
}

const ConciergeContext = createContext<ConciergeContextType | undefined>(undefined);

// Concierge par messagerie : un seul fil de conversation, partagé entre la
// bulle flottante (accessible partout) et la page Messagerie en plein écran —
// comme chez les conciergeries digitales type Velocity Black, où la demande
// se fait par message plutôt que par formulaire, et reste consultable ensuite.
export function ConciergeProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ConciergeMessage[]>(loadInitialMessages);
  const [isTyping, setIsTyping] = useState(false);

  const persist = (msgs: ConciergeMessage[]) => {
    setMessages(msgs);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs));
    } catch {
      // stockage indisponible — la conversation reste fonctionnelle pour la session en cours
    }
  };

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: ConciergeMessage = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date().toISOString(),
    };
    const withUser = [...messages, userMsg];
    persist(withUser);
    setIsTyping(true);

    setTimeout(() => {
      const response = getResponse(text);
      const aiMsg: ConciergeMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.content,
        links: response.links,
        timestamp: new Date().toISOString(),
      };
      persist([...withUser, aiMsg]);
      setIsTyping(false);
    }, 900);
  };

  return (
    <ConciergeContext.Provider value={{ messages, isTyping, suggestions: CONCIERGE_SUGGESTIONS, sendMessage }}>
      {children}
    </ConciergeContext.Provider>
  );
}

export function useConcierge() {
  const ctx = useContext(ConciergeContext);
  if (!ctx) {
    throw new Error("useConcierge must be used within ConciergeProvider");
  }
  return ctx;
}

export function ConciergeFormattedContent({ content }: { content: string }) {
  return (
    <>
      {content.split("\n").map((line, i) => {
        if (line.startsWith("**") && line.endsWith("**")) {
          return (
            <p key={i} className="font-medium text-foreground mt-2 mb-0.5">
              {line.replace(/\*\*/g, "")}
            </p>
          );
        }
        if (line.includes("**")) {
          const parts = line.split("**");
          return (
            <p key={i} className="text-xs leading-relaxed mb-0.5">
              {parts.map((p, j) => (j % 2 === 1 ? <strong key={j}>{p}</strong> : p))}
            </p>
          );
        }
        if (!line.trim()) return null;
        return (
          <p key={i} className="text-xs leading-relaxed mb-0.5">
            {line}
          </p>
        );
      })}
    </>
  );
}
