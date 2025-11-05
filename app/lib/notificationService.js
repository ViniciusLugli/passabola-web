/**
 * Notification Service
 *
 * Serviço centralizado para gerenciar notificações push em tempo real.
 * Integra com o backend via WebSocket (STOMP) e fornece métodos para
 * gerenciar notificações localmente.
 *
 * Tipos de notificação suportados:
 * - NEW_FOLLOWER: Novo seguidor
 * - POST_LIKE: Curtida em post
 * - TEAM_INVITE: Convite para equipe
 * - GAME_INVITE: Convite para jogo
 * - SYSTEM: Avisos gerais do sistema
 * - NEW_POST: Novo post de seguido
 * - GAME_UPDATE: Atualização em jogo
 * - COMMENT: Comentário em post
 * - TEAM_JOIN: Jogadora entrou no time
 * - GAME_RESULT: Resultado de jogo
 */

import { api } from "./api";

class NotificationService {
  constructor() {
    this.listeners = new Set();
    this.isInitialized = false;
  }

  /**
   * Initialize notification service
   */
  initialize() {
    if (this.isInitialized) return;
    this.isInitialized = true;
    console.log("[NotificationService] Initialized");
  }

  /**
   * Add listener for notification events
   * @param {Function} callback - Callback to receive notifications
   * @returns {Function} Unsubscribe function
   */
  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  /**
   * Notify all listeners
   * @param {Object} notification - Notification object
   */
  notifyListeners(notification) {
    this.listeners.forEach((callback) => {
      try {
        callback(notification);
      } catch (error) {
        console.error("[NotificationService] Error in listener:", error);
      }
    });
  }

  /**
   * Handle incoming notification from WebSocket
   * @param {Object} notification - Notification from server
   */
  handleIncomingNotification(notification) {
    console.log("[NotificationService] Received notification:", notification);

    // Show browser notification if permitted
    this.showBrowserNotification(notification);

    // Notify listeners
    this.notifyListeners(notification);
  }

  /**
   * Show browser native notification
   * @param {Object} notification - Notification object
   */
  showBrowserNotification(notification) {
    if (typeof window === "undefined") return;
    if (!("Notification" in window)) return;

    if (Notification.permission === "granted") {
      const title = notification.title || "Nova notificação";
      const body = notification.message || notification.content || "";
      const icon = this.getIconForType(notification.type);

      try {
        const browserNotif = new Notification(title, {
          body,
          icon: icon || "/icons/logo.svg",
          badge: "/icons/badge.svg",
          tag: notification.id?.toString() || `notif-${Date.now()}`,
          requireInteraction: false,
          silent: false,
        });

        // Navigate to link on click
        browserNotif.onclick = () => {
          if (notification.link) {
            window.focus();
            window.location.href = notification.link;
          }
          browserNotif.close();
        };

        // Auto-close after 5 seconds
        setTimeout(() => browserNotif.close(), 5000);
      } catch (error) {
        console.error(
          "[NotificationService] Error showing browser notification:",
          error
        );
      }
    } else if (Notification.permission === "default") {
      // Request permission
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          this.showBrowserNotification(notification);
        }
      });
    }
  }

  /**
   * Get icon for notification type
   * @param {string} type - Notification type
   * @returns {string} Icon URL
   */
  getIconForType(type) {
    const iconMap = {
      NEW_FOLLOWER: "/icons/user-plus.svg",
      POST_LIKE: "/icons/heart.svg",
      TEAM_INVITE: "/icons/users.svg",
      TEAM_INVITE_RECEIVED: "/icons/users.svg", // Backend type
      GAME_INVITE: "/icons/calendar.svg",
      GAME_INVITE_RECEIVED: "/icons/calendar.svg", // Backend type
      SYSTEM: "/icons/bell.svg",
      NEW_POST: "/icons/file-text.svg",
      GAME_UPDATE: "/icons/refresh-cw.svg",
      COMMENT: "/icons/message-square.svg",
      TEAM_JOIN: "/icons/user-check.svg",
      GAME_RESULT: "/icons/trophy.svg",
    };

    return iconMap[type] || "/icons/bell.svg";
  }

  /**
   * Request notification permission
   */
  async requestPermission() {
    if (typeof window === "undefined") return false;
    if (!("Notification" in window)) return false;

    if (Notification.permission === "granted") return true;
    if (Notification.permission === "denied") return false;

    try {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    } catch (error) {
      console.error(
        "[NotificationService] Error requesting permission:",
        error
      );
      return false;
    }
  }

  /**
   * Mark notification as read
   * @param {number} notificationId - Notification ID
   */
  async markAsRead(notificationId) {
    try {
      await api.notifications.markAsRead(notificationId);
      return true;
    } catch (error) {
      console.error("[NotificationService] Error marking as read:", error);
      throw error;
    }
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead() {
    try {
      await api.notifications.markAllAsRead();
      return true;
    } catch (error) {
      console.error("[NotificationService] Error marking all as read:", error);
      throw error;
    }
  }

  /**
   * Delete notification
   * @param {number} notificationId - Notification ID
   */
  async deleteNotification(notificationId) {
    try {
      await api.notifications.delete(notificationId);
      return true;
    } catch (error) {
      console.error(
        "[NotificationService] Error deleting notification:",
        error
      );
      throw error;
    }
  }

  /**
   * Get unread count
   * @returns {Promise<number>} Unread count
   */
  async getUnreadCount() {
    try {
      const response = await api.notifications.getUnreadCount();
      return response.unreadCount || 0;
    } catch (error) {
      console.error("[NotificationService] Error getting unread count:", error);
      return 0;
    }
  }

  /**
   * Get all notifications
   * @param {Object} params - Query params (page, size)
   * @returns {Promise<Array>} Notifications
   */
  async getAllNotifications(params = {}) {
    try {
      const response = await api.notifications.getAll(params);
      return response.content || [];
    } catch (error) {
      console.error(
        "[NotificationService] Error getting notifications:",
        error
      );
      return [];
    }
  }

  /**
   * Get unread notifications
   * @param {Object} params - Query params (page, size)
   * @returns {Promise<Array>} Unread notifications
   */
  async getUnreadNotifications(params = {}) {
    try {
      const response = await api.notifications.getUnread(params);
      return response.content || [];
    } catch (error) {
      console.error(
        "[NotificationService] Error getting unread notifications:",
        error
      );
      return [];
    }
  }

  /**
   * Get recent notifications (24h)
   * @returns {Promise<Array>} Recent notifications
   */
  async getRecentNotifications() {
    try {
      const response = await api.notifications.getRecent();
      return response.content || [];
    } catch (error) {
      console.error(
        "[NotificationService] Error getting recent notifications:",
        error
      );
      return [];
    }
  }

  /**
   * Create user-friendly notification message
   * @param {Object} notification - Raw notification from server
   * @returns {Object} Formatted notification
   */
  formatNotification(notification) {
    const typeMessages = {
      NEW_FOLLOWER: (n) => ({
        title: "Novo Seguidor",
        message: n.message || `${n.senderName || "Alguém"} começou a te seguir`,
        icon: "👤",
      }),
      POST_LIKE: (n) => ({
        title: "Curtida no Post",
        message: n.message || `${n.senderName || "Alguém"} curtiu seu post`,
        icon: "❤️",
      }),
      TEAM_INVITE: (n) => ({
        title: "Convite para Equipe",
        message:
          n.message || `${n.senderName || "Alguém"} te convidou para um time`,
        icon: "👥",
      }),
      GAME_INVITE: (n) => ({
        title: "Convite para Jogo",
        message: n.message || `Você foi convidado para participar de um jogo`,
        icon: "⚽",
      }),
      SYSTEM: (n) => ({
        title: "Aviso do Sistema",
        message: n.message || "Nova mensagem do sistema",
        icon: "🔔",
      }),
      NEW_POST: (n) => ({
        title: "Novo Post",
        message:
          n.message || `${n.senderName || "Alguém"} publicou um novo post`,
        icon: "📝",
      }),
      GAME_UPDATE: (n) => ({
        title: "Atualização de Jogo",
        message: n.message || "Um jogo foi atualizado",
        icon: "🔄",
      }),
      COMMENT: (n) => ({
        title: "Novo Comentário",
        message:
          n.message || `${n.senderName || "Alguém"} comentou em seu post`,
        icon: "💬",
      }),
      TEAM_JOIN: (n) => ({
        title: "Nova Integrante",
        message: n.message || `${n.senderName || "Alguém"} entrou no time`,
        icon: "✅",
      }),
      GAME_RESULT: (n) => ({
        title: "Resultado do Jogo",
        message: n.message || "Um jogo foi finalizado",
        icon: "🏆",
      }),
    };

    const formatter = typeMessages[notification.type];
    const formatted = formatter
      ? formatter(notification)
      : {
          title: notification.title || "Nova Notificação",
          message: notification.message || "",
          icon: "🔔",
        };

    return {
      ...notification,
      ...formatted,
    };
  }

  /**
   * Cleanup service
   */
  cleanup() {
    this.listeners.clear();
    this.isInitialized = false;
    console.log("[NotificationService] Cleaned up");
  }
}

// Export singleton instance
export const notificationService = new NotificationService();

// Export class for testing
export { NotificationService };
