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
        console.log("[DEBUG] Notifications list:", notificationsList);
        console.log("[DEBUG] Notifications count:", notificationsList.length);

        if (isMounted) {
          setNotificationsList(notificationsList);
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
