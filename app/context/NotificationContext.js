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
import { error as logError } from "@/app/lib/logger";
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
      process.env.NEXT_PUBLIC_NOTIFICATION_WS_URL || "http://localhost:8080/ws";

    const stompClient = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      debug: (/* str */) => {
        /* debug suppressed */
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        setIsConnected(true);

        const userType = user.userType.toLowerCase(); // player, organization, spectator

        // Subscribe to notification messages for the user
        stompClient.subscribe(
          `/topic/notifications/${userType}/${user.id}`,
          (message) => {
            try {
              const notification = JSON.parse(message.body);
              setNotifications((prev) => [notification, ...prev]);
              setUnreadCount((prev) => prev + 1);

              // Browser native notification (optional)
              if (
                typeof Notification !== "undefined" &&
                Notification.permission === "granted"
              ) {
                new Notification(notification.title || "Notificação", {
                  body: notification.message || notification.title || "",
                  icon: "/logo.svg",
                });
              }
            } catch (error) {
              console.error("Erro ao processar notificação:", error);
            }
          }
        );

        // Subscribe to unread count updates (server can push count updates)
        stompClient.subscribe(
          `/topic/notifications/${userType}/${user.id}/count`,
          (message) => {
            try {
              const payload = JSON.parse(message.body);
              // payload can be { unreadCount: N } or a plain number
              const count =
                payload && typeof payload === "object"
                  ? payload.unreadCount ?? payload.count ?? 0
                  : Number(payload) || 0;
              setUnreadCount(count);
            } catch (err) {
              // try parse as raw number
              const raw = message.body;
              const n = Number(raw);
              if (!Number.isNaN(n)) {
                setUnreadCount(n);
              } else {
                console.error(
                  "Erro ao processar contador de notificações:",
                  err
                );
              }
            }
          }
        );
      },
      onDisconnect: () => {
        setIsConnected(false);
      },
      onStompError: (frame) => {
        try {
          const parsed = {
            time: new Date().toISOString(),
            url: WS_URL,
            userId: user?.id,
            userType: user?.userType,
            frame: {
              command: frame?.command,
              headers: frame?.headers,
              body: frame?.body,
              message: frame?.message,
            },
          };
          logError({
            route: WS_URL,
            message: "Erro STOMP (Notifications)",
            meta: parsed,
          });
        } catch (err) {
          logError({
            route: WS_URL,
            message: "Erro STOMP (Notifications) (parsing)",
            meta: { err, frame },
          });
        }
        setIsConnected(false);
      },
      onWebSocketError: (event) => {
        try {
          const parsed = {
            time: new Date().toISOString(),
            url: WS_URL,
            userId: user?.id,
            userType: user?.userType,
            type: event?.type,
            message: event?.message || event?.reason || null,
            error: event?.error || null,
            target: {
              url: event?.target?.url || null,
              readyState: event?.target?.readyState || null,
            },
            stack: event?.error?.stack || null,
          };
          logError({
            route: WS_URL,
            message: "Erro WebSocket (Notifications)",
            meta: parsed,
          });
        } catch (err) {
          logError({
            route: WS_URL,
            message: "Erro WebSocket (Notifications) (parsing)",
            meta: { err, event },
          });
        }
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
