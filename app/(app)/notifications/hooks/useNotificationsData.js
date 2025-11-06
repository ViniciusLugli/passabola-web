import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/app/lib/api";

/**
 * Hook para gerenciar o carregamento inicial de notificações
 */
export function useNotificationsData(
  user,
  setNotificationsList,
  updateUnreadCount,
  showToast
) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    let isMounted = true;

    const loadNotifications = async () => {
      setLoading(true);
      try {
        const response = await api.notifications.getAll({ page: 0, size: 50 });
        console.log("[DEBUG] Raw API response:", response);
        const notificationsList = response.content || [];

        // CRITICAL: Parse metadata from JSON string to object
        const parsedNotifications = notificationsList.map((notif) => {
          try {
            return {
              ...notif,
              metadata:
                typeof notif.metadata === "string"
                  ? JSON.parse(notif.metadata)
                  : notif.metadata,
            };
          } catch (e) {
            console.warn(
              "[DEBUG] Failed to parse metadata for notification:",
              notif.id,
              e
            );
            return notif;
          }
        });

        console.log(
          "[DEBUG] Notifications list (parsed):",
          parsedNotifications
        );
        console.log("[DEBUG] Notifications count:", parsedNotifications.length);

        if (isMounted) {
          setNotificationsList(parsedNotifications);
        }

        const countResponse = await api.notifications.getUnreadCount();
        if (isMounted) {
          updateUnreadCount(countResponse.unreadCount || 0);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Erro ao buscar notificações:", err);
          showToast(err.message || "Erro ao carregar notificações.", "error");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadNotifications();

    return () => {
      isMounted = false;
    };
  }, [user, router, setNotificationsList, updateUnreadCount, showToast]);

  return { loading };
}
