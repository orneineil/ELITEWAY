import { useState, useRef, useEffect } from "react";
import { Link } from "react-router";
import { X, Send, Sparkles, ChevronDown, Maximize2 } from "lucide-react";
import { useConcierge, ConciergeFormattedContent } from "../contexts/ConciergeContext";

export function AIAssistant() {
  const { messages, isTyping, suggestions, sendMessage } = useConcierge();
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleSend = (text: string) => {
    sendMessage(text);
    setInputValue("");
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
            <div className="flex items-center gap-2">
              <Link
                to="/messages"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-xl bg-muted/60 flex items-center justify-center hover:bg-muted transition-colors"
                aria-label="Ouvrir en plein écran"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-xl bg-muted/60 flex items-center justify-center hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
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
                      <ConciergeFormattedContent content={msg.content} />
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
                    {new Date(msg.timestamp).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
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
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSend(s)}
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
                onKeyDown={(e) => { if (e.key === "Enter") handleSend(inputValue); }}
                placeholder="Votre demande..."
                className="flex-1 px-4 py-3 bg-background border border-border/60 rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
              <button
                onClick={() => handleSend(inputValue)}
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
