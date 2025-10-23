"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useAuth } from "./AuthContext";

const NotificationContext = createContext();

const ENABLE_WEBSOCKET = process.env.NEXT_PUBLIC_ENABLE_WEBSOCKET !== "false";

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
}

export function NotificationProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [client, setClient] = useState(null);

  useEffect(() => {
    if (!ENABLE_WEBSOCKET) {
      console.log(
        "[WebSocket] Desabilitado via configuração (NEXT_PUBLIC_ENABLE_WEBSOCKET=false)"
      );
      setIsConnected(false);
      return;
    }

    if (!isAuthenticated || !user) {
      setIsConnected(false);
      if (client) {
        client.deactivate();
        setClient(null);
      }
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      console.warn("[WebSocket] Token não encontrado, não é possível conectar");
      return;
    }

    const WS_URL =
      process.env.NEXT_PUBLIC_NOTIFICATION_WS_URL ||
      "http://localhost:8080/ws-chat-sockjs";

    const stompClient = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      debug: (str) => {
        if (process.env.NODE_ENV === "development") {
          console.log("[WebSocket]", str);
        }
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log("WebSocket conectado!");
        setIsConnected(true);

        const userType = user.userType.toLowerCase(); // player, organization, spectator
        stompClient.subscribe(
          `/topic/notifications/${userType}/${user.id}`,
          (message) => {
            try {
              const notification = JSON.parse(message.body);
              console.log("Nova notificação recebida:", notification);

              setNotifications((prev) => [notification, ...prev]);
              setUnreadCount((prev) => prev + 1);

              if (Notification.permission === "granted") {
                new Notification(notification.title, {
                  body: notification.message,
                  icon: "/logo.svg",
                });
              }
            } catch (error) {
              console.error("Erro ao processar notificação:", error);
            }
          }
        );
      },
      onDisconnect: () => {
        console.log("WebSocket desconectado");
        setIsConnected(false);
      },
      onStompError: (frame) => {
        console.error("Erro STOMP:", frame);
        setIsConnected(false);
      },
      onWebSocketError: (event) => {
        console.error("Erro WebSocket:", event);
        setIsConnected(false);
      },
    });

    stompClient.activate();
    setClient(stompClient);

    if (
      typeof Notification !== "undefined" &&
      Notification.permission === "default"
    ) {
      Notification.requestPermission();
    }

    return () => {
      if (stompClient) {
        stompClient.deactivate();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user]);

  // Adicionar notificação manualmente (útil para testes)
  const addNotification = useCallback((notification) => {
    setNotifications((prev) => [notification, ...prev]);
    if (!notification.read) {
      setUnreadCount((prev) => prev + 1);
    }
  }, []);

  const markAsReadLocally = useCallback((notificationId) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, []);

  const markAllAsReadLocally = useCallback(() => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
    setUnreadCount(0);
  }, []);

  const removeNotificationLocally = useCallback((notificationId) => {
    setNotifications((prev) => {
      const notif = prev.find((n) => n.id === notificationId);
      if (notif && !notif.read) {
        setUnreadCount((count) => Math.max(0, count - 1));
      }
      return prev.filter((n) => n.id !== notificationId);
    });
  }, []);

  const clearReadNotificationsLocally = useCallback(() => {
    setNotifications((prev) => prev.filter((notif) => !notif.read));
  }, []);

  const updateUnreadCount = useCallback((count) => {
    setUnreadCount(count);
  }, []);

  const setNotificationsList = useCallback((notifList) => {
    setNotifications(notifList);
    const unread = notifList.filter((n) => !n.read).length;
    setUnreadCount(unread);
  }, []);

  const value = {
    notifications,
    unreadCount,
    isConnected,
    addNotification,
    markAsReadLocally,
    markAllAsReadLocally,
    removeNotificationLocally,
    clearReadNotificationsLocally,
    updateUnreadCount,
    setNotificationsList,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}
