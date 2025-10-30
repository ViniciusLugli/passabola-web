"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/app/context/ToastContext";
import NotificationCard from "@/app/components/cards/NotificationCard";
import { useAuth } from "@/app/context/AuthContext";
import { useNotifications } from "@/app/context/NotificationContext";
import { api } from "@/app/lib/api";

export default function NotificationsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const {
    notifications: liveNotifications,
    unreadCount,
    isConnected,
    markAsReadLocally,
    removeNotificationLocally,
    clearReadNotificationsLocally,
    markAllAsReadLocally,
    setNotificationsList,
    updateUnreadCount,
  } = useNotifications();

  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    fetchNotifications();
  }, [user, router]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      // GET /api/notifications?page=0&size=50 retorna { content: [...] }
      const response = await api.notifications.getAll({
        page: 0,
        size: 50,
      });
      const notificationsList = response.content || [];
      setNotificationsList(notificationsList);

      // GET /api/notifications/unread/count retorna { unreadCount: 5 }
      const countResponse = await api.notifications.getUnreadCount();
      updateUnreadCount(countResponse.unreadCount || 0);
    } catch (err) {
      console.error("Erro ao buscar notificações:", err);
      showToast(err.message || "Erro ao carregar notificações.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await api.notifications.markAsRead(notificationId);
      markAsReadLocally(notificationId);
    } catch (err) {
      console.error("Erro ao marcar como lida:", err);
      showToast("Erro ao marcar notificação como lida.", "error");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      // PATCH /api/notifications/read-all retorna { message: "...", count: 10 }
      const response = await api.notifications.markAllAsRead();
      markAllAsReadLocally();
      showToast(
        response.message || "Todas as notificações foram marcadas como lidas!",
        "success"
      );
    } catch (err) {
      console.error("Erro ao marcar todas como lidas:", err);
      showToast("Erro ao marcar todas as notificações como lidas.", "error");
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      // DELETE /api/notifications/{id}
      await api.notifications.delete(notificationId);
      removeNotificationLocally(notificationId);
      showToast("Notificação deletada!", "success");
    } catch (err) {
      console.error("Erro ao deletar notificação:", err);
      showToast("Erro ao deletar notificação.", "error");
    }
  };

  const handleActionComplete = (type, message) => {
    showToast(message, type);
  };

  const handleDeleteAllRead = async () => {
    try {
      // AVISO: A API não tem endpoint para deletar todas as lidas
      // Vamos deletar uma por uma
      const readNotifications = liveNotifications.filter((n) => n.read);

      await Promise.all(
        readNotifications.map((notif) => api.notifications.delete(notif.id))
      );

      clearReadNotificationsLocally();
      showToast(
        `${readNotifications.length} notificações lidas foram deletadas!`,
        "success"
      );
    } catch (err) {
      console.error("Erro ao deletar notificações lidas:", err);
      showToast("Erro ao deletar notificações lidas.", "error");
    }
  };

  const filteredNotifications = liveNotifications.filter((notif) => {
    if (filter === "unread") return !notif.read;
    if (filter === "read") return notif.read;
    return true;
  });

  if (loading) {
    return (
      <div className="bg-page min-h-screen">
        <main className="container mx-auto p-4 mt-8 max-w-4xl">
          <div className="relative bg-surface border border-default rounded-2xl shadow-elevated p-8 flex flex-col gap-6">
            <h1 className="text-4xl font-bold text-primary text-center mt-4">
              Notificações
            </h1>
            <p className="text-center text-secondary">
              Carregando notificações...
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <main className="container mx-auto p-4 mt-8 max-w-4xl">
        <div className="relative bg-surface border border-default rounded-2xl shadow-elevated p-4 md:p-8 flex flex-col gap-6">
          <button
            onClick={() => router.back()}
            className="absolute top-4 md:top-8 right-4 md:right-8 text-tertiary hover:text-secondary transition-colors duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 md:w-7 md:h-7"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-primary">
                Notificações
              </h1>
              {unreadCount > 0 && (
                <p className="text-sm text-secondary mt-1">
                  {unreadCount} {unreadCount === 1 ? "nova" : "novas"}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div
                className={`
                  w-2 h-2 rounded-full
                  ${isConnected ? "bg-green-500" : "bg-red-500"}
                `}
                title={isConnected ? "Conectado" : "Desconectado"}
              ></div>
              <span className="text-xs text-secondary">
                {isConnected ? "Online" : "Offline"}
              </span>
            </div>
          </div>

          {/* notifications shown via ToastProvider */}

          {/* Filtros e Ações */}
          <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <div className="flex gap-2 flex-wrap">
              {["all", "unread", "read"].map((key) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`
                    px-3 py-1.5 rounded-md text-sm font-medium transition-all
                    ${
                      filter === key
                        ? "bg-accent text-on-brand shadow-elevated"
                        : "bg-surface-muted text-secondary border border-default hover:bg-surface-elevated"
                    }
                  `}
                >
                  {key === "all"
                    ? "Todas"
                    : key === "unread"
                    ? "Não Lidas"
                    : "Lidas"}
                </button>
              ))}
            </div>

            <div className="flex gap-2 flex-wrap">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="px-3 py-1.5 text-sm font-medium text-accent hover:text-accent-strong transition-colors"
                >
                  Marcar todas como lidas
                </button>
              )}
              {liveNotifications.some((n) => n.read) && (
                <button
                  onClick={handleDeleteAllRead}
                  className="px-3 py-1.5 text-sm font-medium text-red-400 hover:text-red-500 transition-colors"
                >
                  Limpar lidas
                </button>
              )}
            </div>
          </div>

          {/* Lista de Notificações */}
          <div className="flex flex-col gap-3">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-secondary text-lg">
                  {filter === "unread"
                    ? "Nenhuma notificação não lida"
                    : filter === "read"
                    ? "Nenhuma notificação lida"
                    : "Você não tem notificações"}
                </p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                  onDelete={handleDelete}
                  onActionComplete={handleActionComplete}
                />
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
