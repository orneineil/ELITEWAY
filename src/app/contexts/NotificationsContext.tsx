import { createContext, useContext, useState, ReactNode } from "react";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "offer" | "table" | "event" | "loyalty";
  time: string;
  read: boolean;
  link?: string;
  group: "today" | "week";
}

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  markRead: (id: string) => void;
  markAllRead: () => void;
  dismissNotification: (id: string) => void;
}

const NotificationsContext = createContext<NotificationsContextType | null>(null);

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    title: "Table libérée — Le Belvédère",
    message: "Une table pour 2 vient de se libérer ce soir à 20h30. Réservez maintenant !",
    type: "table",
    time: "Il y a 5 min",
    read: false,
    link: "/establishment/restaurant-le-grand",
    group: "today",
  },
  {
    id: "n2",
    title: "Offre yacht — Azur Sailing",
    message: "Profitez de -20% sur votre sortie yacht ce week-end. Offre valable jusqu'à ce soir.",
    type: "offer",
    time: "Il y a 1h",
    read: false,
    link: "/establishment/yacht-azur",
    group: "today",
  },
  {
    id: "n3",
    title: "Événement VIP — Rooftop Éclat",
    message: "La prochaine soirée privative membres a lieu vendredi 20 juin. Places limitées.",
    type: "event",
    time: "Il y a 3h",
    read: false,
    link: "/establishment/rooftop-eclat",
    group: "today",
  },
  {
    id: "n4",
    title: "Points EliteWay crédités",
    message: "Vous avez reçu +55 points suite à votre visite chez Azur Sailing. Solde : 240 pts.",
    type: "loyalty",
    time: "Il y a 2 jours",
    read: true,
    link: "/rewards",
    group: "week",
  },
  {
    id: "n5",
    title: "Offre exclusive — Spa Azuréen",
    message: "Soin signature + accès spa : 65 € au lieu de 90 €. Réservez avant dimanche.",
    type: "offer",
    time: "Il y a 3 jours",
    read: true,
    link: "/establishment/spa-serenite",
    group: "week",
  },
];

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotificationsContext.Provider
      value={{ notifications, unreadCount, markRead, markAllRead, dismissNotification }}
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
