import { useState, useRef, useEffect } from "react";
import { Send, Sparkles } from "lucide-react";
import { useConcierge, ConciergeFormattedContent } from "../contexts/ConciergeContext";

export function MessagesPage() {
  const { messages, isTyping, suggestions, sendMessage } = useConcierge();
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (text: string) => {
    sendMessage(text);
    setInputValue("");
  };

  const showSuggestions = messages.length <= 1;

  return (
    <div className="max-w-lg mx-auto pb-28 pt-4 flex flex-col" style={{ minHeight: "calc(100svh - 3.5rem)" }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-5 mb-5">
        <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
          <Sparkles className="w-4.5 h-4.5 text-primary" />
        </div>
        <div>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "1.3rem" }} className="leading-tight">
            Conciergerie EliteWay
          </h1>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-[10px] text-emerald-400">En ligne</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 space-y-3 mb-3">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-card"
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
            <div className="bg-card rounded-2xl px-4 py-3">
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
        <div className="px-5 pb-2 shrink-0">
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
      <div className="px-5 pt-2 shrink-0">
        <div className="flex items-center gap-2">
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSend(inputValue); }}
            placeholder="Votre demande..."
            className="flex-1 px-4 py-3 bg-card border border-border/60 rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
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
  );
}
