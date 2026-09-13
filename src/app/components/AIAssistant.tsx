import { useState, useRef, useEffect } from "react";
import { X, Send, Sparkles, ChevronDown } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  links?: Array<{ label: string; href: string }>;
}

const SUGGESTIONS = [
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

function formatContent(content: string) {
  return content.split("\n").map((line, i) => {
    if (line.startsWith("**") && line.endsWith("**")) {
      return <p key={i} className="font-medium text-foreground mt-2 mb-0.5">{line.replace(/\*\*/g, "")}</p>;
    }
    if (line.includes("**")) {
      const parts = line.split("**");
      return (
        <p key={i} className="text-xs leading-relaxed mb-0.5">
          {parts.map((p, j) => j % 2 === 1 ? <strong key={j}>{p}</strong> : p)}
        </p>
      );
    }
    if (!line.trim()) return null;
    return <p key={i} className="text-xs leading-relaxed mb-0.5">{line}</p>;
  });
}

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "0",
      role: "assistant",
      content: "Bonjour ! Je suis votre conciergerie EliteWay. Comment puis-je vous aider à concevoir votre prochaine expérience sur la Côte d'Azur ?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      const response = getResponse(text);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.content,
        links: response.links,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 900);
  };

  const showSuggestions = messages.length <= 1;

  return (
    <>
      {/* Floating button — above BottomNav */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed right-5 z-50 w-12 h-12 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center hover:bg-primary/90 transition-all"
        style={{ bottom: 88 }}
        aria-label="Conciergerie EliteWay"
      >
        {isOpen ? (
          <ChevronDown className="w-5 h-5" />
        ) : (
          <div className="relative">
            <Sparkles className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-primary animate-pulse" />
          </div>
        )}
      </button>

      {/* Chat sheet */}
      {isOpen && (
        <div
          className="fixed left-0 right-0 z-40 flex flex-col bg-card border-t border-border/60 rounded-t-3xl shadow-2xl overflow-hidden"
          style={{ bottom: 0, height: "70vh" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border/40 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p style={{ fontFamily: "var(--font-heading)", fontSize: "1rem" }}>
                  Conciergerie EliteWay ✦
                </p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-[10px] text-emerald-400">En ligne</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-xl bg-muted/60 flex items-center justify-center hover:bg-muted transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/60"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <div className="space-y-0.5 text-xs leading-relaxed">
                      {formatContent(msg.content)}
                      {msg.links && msg.links.length > 0 && (
                        <div className="mt-3 space-y-1.5 pt-2 border-t border-border/40">
                          {msg.links.map((link) => (
                            <a
                              key={link.href}
                              href={link.href}
                              className="flex items-center gap-2 text-primary hover:underline text-xs"
                              onClick={() => setIsOpen(false)}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                              {link.label}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm">{msg.content}</p>
                  )}
                  <p className="text-[9px] opacity-50 mt-1">
                    {msg.timestamp.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-muted/60 rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-1">
                    {[0, 150, 300].map((delay) => (
                      <span
                        key={delay}
                        className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"
                        style={{ animationDelay: `${delay}ms` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions chips */}
          {showSuggestions && (
            <div className="px-4 pb-2 shrink-0">
              <p className="text-[10px] text-muted-foreground mb-2 uppercase tracking-wider">Suggestions</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="px-3 py-1.5 rounded-full text-xs bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="px-4 pb-5 pt-2 border-t border-border/40 shrink-0">
            <div className="flex items-center gap-2">
              <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") sendMessage(inputValue); }}
                placeholder="Votre demande..."
                className="flex-1 px-4 py-3 bg-background border border-border/60 rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
              <button
                onClick={() => sendMessage(inputValue)}
                disabled={!inputValue.trim()}
                className="w-11 h-11 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
