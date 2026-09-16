import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "../lib/supabase";
import { useClientAuth } from "./ClientAuthContext";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "offer" | "table" | "event" | "loyalty" | "booking";
  time: string;
  read: boolean;
  link?: string;
  group: "today" | "week" | "earlier";
}

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  markRead: (id: string) => void;
  markAllRead: () => void;
  dismissNotification: (id: string) => void;
}

const NotificationsContext = createContext<NotificationsContextType | null>(null);

// Notifications réelles, tirées de la table `notifications` (schema_v2_catalog.sql)
// — remplace l'ancienne liste codée en dur. Elles sont générées côté base par
// un trigger à la confirmation d'une réservation ; d'autres types (offer,
// table, event) viendront s'y ajouter au fur et à mesure que les mécaniques
// correspondantes (disponibilités réelles, partenaires) seront branchées.
function relativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "À l'instant";
  if (minutes < 60) return `Il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  return `Il y a ${days} j`;
}

function groupFor(iso: string): "today" | "week" | "earlier" {
  const diffMs = Date.now() - new Date(iso).getTime();
  const days = diffMs / 86400000;
  if (days < 1) return "today";
  if (days < 7) return "week";
  return "earlier";
}

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const { client, isAuthenticated } = useClientAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !client) {
      setNotifications([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    supabase
      .from("notifications")
      .select("id, title, message, type, link, read, created_at")
      .eq("user_id", client.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (cancelled) return;
        setNotifications(
          (data ?? []).map((n) => ({
            id: n.id,
            title: n.title,
            message: n.message,
            type: n.type,
            link: n.link ?? undefined,
            read: n.read,
            time: relativeTime(n.created_at),
            group: groupFor(n.created_at),
          }))
        );
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, [isAuthenticated, client]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    supabase.from("notifications").update({ read: true }).eq("id", id).then();
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    if (client) supabase.from("notifications").update({ read: true }).eq("user_id", client.id).then();
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    supabase.from("notifications").delete().eq("id", id).then();
  };

  return (
    <NotificationsContext.Provider
      value={{ notifications, unreadCount, loading, markRead, markAllRead, dismissNotification }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error("useNotifications must be used inside NotificationsProvider");
  return ctx;
}
