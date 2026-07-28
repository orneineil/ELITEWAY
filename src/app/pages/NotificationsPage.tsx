import { useNotifications, Notification } from "../contexts/NotificationsContext";
import { Link } from "react-router";
import { Bell, Gift, Utensils, Calendar, Star, Trash2, CheckCheck } from "lucide-react";

const TYPE_CONFIG: Record<Notification["type"], { icon: React.ComponentType<any>; color: string; bg: string }> = {
  offer:   { icon: Gift,     color: "text-emerald-400", bg: "bg-emerald-500/10" },
  table:   { icon: Utensils, color: "text-orange-400",  bg: "bg-orange-500/10"  },
  event:   { icon: Calendar, color: "text-purple-400",  bg: "bg-purple-500/10"  },
  loyalty: { icon: Star,     color: "text-primary",     bg: "bg-primary/10"     },
};

export function NotificationsPage() {
  const { notifications, unreadCount, markRead, markAllRead, dismissNotification } = useNotifications();

  const todayNotifs = notifications.filter((n) => n.group === "today");
  const weekNotifs = notifications.filter((n) => n.group === "week");

  if (notifications.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-5 pb-28 pt-4 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-16 h-16 rounded-2xl bg-card border border-border flex items-center justify-center mb-4">
          <Bell className="w-7 h-7 text-muted-foreground" />
        </div>
        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.4rem" }} className="mb-2">Aucune notification</h2>
        <p className="text-sm text-muted-foreground">Vous êtes à jour ! Revenez bientôt pour les offres et événements.</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto pb-28 pt-4">

      {/* Header */}
      <div className="flex items-center justify-between px-5 mb-5">
        <div>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "1.6rem" }} className="leading-tight">
            Notifications
          </h1>
          {unreadCount > 0 && (
            <p className="text-xs text-muted-foreground">{unreadCount} non lue{unreadCount > 1 ? "s" : ""}</p>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Tout lire
          </button>
        )}
      </div>

      {/* Grouped list */}
      {todayNotifs.length > 0 && (
        <section className="mb-6 px-5">
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Aujourd'hui</p>
          <div className="space-y-3">
            {todayNotifs.map((notif) => (
              <NotifCard
                key={notif.id}
                notif={notif}
                onRead={() => markRead(notif.id)}
                onDismiss={() => dismissNotification(notif.id)}
              />
            ))}
          </div>
        </section>
      )}

      {weekNotifs.length > 0 && (
        <section className="px-5">
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Cette semaine</p>
          <div className="space-y-3">
            {weekNotifs.map((notif) => (
              <NotifCard
                key={notif.id}
                notif={notif}
                onRead={() => markRead(notif.id)}
                onDismiss={() => dismissNotification(notif.id)}
              />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}

function NotifCard({
  notif,
  onRead,
  onDismiss,
}: {
  notif: Notification;
  onRead: () => void;
  onDismiss: () => void;
}) {
  const cfg = TYPE_CONFIG[notif.type];
  const Icon = cfg.icon;

  const Content = (
    <div
      className={`flex items-start gap-3 p-4 rounded-2xl border transition-colors ${
        notif.read ? "bg-card border-border/50" : "bg-card border-primary/20 bg-primary/3"
      }`}
      onClick={onRead}
    >
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${cfg.bg}`}>
        <Icon className={`w-4 h-4 ${cfg.color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <p className="text-sm font-medium leading-tight">{notif.title}</p>
          {!notif.read && (
            <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1" />
          )}
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed mb-1.5">{notif.message}</p>
        <p className="text-[10px] text-muted-foreground/60">{notif.time}</p>
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); e.preventDefault(); onDismiss(); }}
        className="w-7 h-7 rounded-xl bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors shrink-0"
      >
        <Trash2 className="w-3 h-3 text-muted-foreground" />
      </button>
    </div>
  );

  if (notif.link) {
    return <Link to={notif.link}>{Content}</Link>;
  }
  return <div role="button">{Content}</div>;
}
