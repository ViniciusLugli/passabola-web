/**
 * useNotificationActions Hook
 *
 * Custom hook que fornece ações para interagir com notificações.
 * Centraliza a lógica de marcar como lida, deletar, etc.
 */

import { useCallback } from "react";
import { useNotifications } from "@/app/context/NotificationContext";
import { useToast } from "@/app/context/ToastContext";
import { notificationService } from "@/app/lib/notificationService";

export function useNotificationActions() {
  const {
    markAsReadLocally,
    markAllAsReadLocally,
    removeNotificationLocally,
    clearReadNotificationsLocally,
  } = useNotifications();

  const { showToast } = useToast();

  /**
   * Mark notification as read
   */
  const markAsRead = useCallback(
    async (notificationId) => {
      try {
        await notificationService.markAsRead(notificationId);
        markAsReadLocally(notificationId);
        return true;
      } catch (error) {
        console.error("[useNotificationActions] Error marking as read:", error);
        showToast("Erro ao marcar notificação como lida", "error");
        return false;
      }
    },
    [markAsReadLocally, showToast]
  );

  /**
   * Mark all notifications as read
   */
  const markAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead();
      markAllAsReadLocally();
      showToast("Todas as notificações foram marcadas como lidas", "success");
      return true;
    } catch (error) {
      console.error(
        "[useNotificationActions] Error marking all as read:",
        error
      );
      showToast("Erro ao marcar todas como lidas", "error");
      return false;
    }
  }, [markAllAsReadLocally, showToast]);

  /**
   * Delete notification
   */
  const deleteNotification = useCallback(
    async (notificationId) => {
      try {
        await notificationService.deleteNotification(notificationId);
        removeNotificationLocally(notificationId);
        showToast("Notificação deletada", "success");
        return true;
      } catch (error) {
        console.error(
          "[useNotificationActions] Error deleting notification:",
          error
        );
        showToast("Erro ao deletar notificação", "error");
        return false;
      }
    },
    [removeNotificationLocally, showToast]
  );

  /**
   * Delete multiple notifications
   */
  const deleteMultiple = useCallback(
    async (notificationIds) => {
      try {
        await Promise.all(
          notificationIds.map((id) =>
            notificationService.deleteNotification(id)
          )
        );

        notificationIds.forEach((id) => removeNotificationLocally(id));
        showToast(
          `${notificationIds.length} notificações deletadas`,
          "success"
        );
        return true;
      } catch (error) {
        console.error(
          "[useNotificationActions] Error deleting multiple:",
          error
        );
        showToast("Erro ao deletar notificações", "error");
        return false;
      }
    },
    [removeNotificationLocally, showToast]
  );

  /**
   * Mark multiple notifications as read
   */
  const markMultipleAsRead = useCallback(
    async (notificationIds) => {
      try {
        await Promise.all(
          notificationIds.map((id) => notificationService.markAsRead(id))
        );

        notificationIds.forEach((id) => markAsReadLocally(id));
        showToast(
          `${notificationIds.length} notificações marcadas como lidas`,
          "success"
        );
        return true;
      } catch (error) {
        console.error(
          "[useNotificationActions] Error marking multiple as read:",
          error
        );
        showToast("Erro ao marcar notificações como lidas", "error");
        return false;
      }
    },
    [markAsReadLocally, showToast]
  );

  /**
   * Clear all read notifications
   */
  const clearReadNotifications = useCallback(
    async (readNotifications) => {
      try {
        await Promise.all(
          readNotifications.map((notif) =>
            notificationService.deleteNotification(notif.id)
          )
        );

        clearReadNotificationsLocally();
        showToast(
          `${readNotifications.length} notificações lidas foram deletadas`,
          "success"
        );
        return true;
      } catch (error) {
        console.error(
          "[useNotificationActions] Error clearing read notifications:",
          error
        );
        showToast("Erro ao deletar notificações lidas", "error");
        return false;
      }
    },
    [clearReadNotificationsLocally, showToast]
  );

  return {
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteMultiple,
    markMultipleAsRead,
    clearReadNotifications,
  };
}
