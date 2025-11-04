"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { error as logError } from "@/app/lib/logger";
import { useAuth } from "./AuthContext";

const ChatContext = createContext();

const ENABLE_CHAT_WEBSOCKET =
  process.env.NEXT_PUBLIC_ENABLE_WEBSOCKET !== "false";

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}

export function ChatProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState({});
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const clientRef = useRef(null);
  const subscriptionsRef = useRef({});

  useEffect(() => {
    if (!ENABLE_CHAT_WEBSOCKET) {
      setIsConnected(false);
      return;
    }

    if (!isAuthenticated || !user) {
      setIsConnected(false);
      if (clientRef.current) {
        clientRef.current.deactivate();
        clientRef.current = null;
      }
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      console.warn("[Chat WebSocket] Token não encontrado");
      return;
    }

    const WS_URL =
      process.env.NEXT_PUBLIC_CHAT_WS_URL ||
      "http://localhost:8080/ws-chat-sockjs";

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

        // Subscribe to personal messages
        stompClient.subscribe(`/user/queue/messages`, (message) => {
          try {
            const newMessage = JSON.parse(message.body);
            handleNewMessage(newMessage);
          } catch (error) {
            console.error("Erro ao processar mensagem:", error);
          }
        });

        // Subscribe to presence events
        stompClient.subscribe(`/user/queue/presence`, (message) => {
          try {
            const presenceEvent = JSON.parse(message.body);
            handlePresenceEvent(presenceEvent);
          } catch (error) {
            console.error("Erro ao processar evento de presença:", error);
          }
        });

        // Request initial list of online users
        stompClient.publish({
          destination: `/app/presence.request`,
          body: JSON.stringify({}),
        });

        clientRef.current = stompClient;
      },
      onDisconnect: () => {
        setIsConnected(false);
      },
      onStompError: (frame) => {
        try {
          const parsedFrame = {
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
            message: "Erro STOMP (Chat)",
            meta: parsedFrame,
          });
        } catch (err) {
          logError({
            route: WS_URL,
            message: "Erro STOMP (Chat) (parsing)",
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
            message: "Erro WebSocket (Chat)",
            meta: parsed,
          });
        } catch (err) {
          logError({
            route: WS_URL,
            message: "Erro WebSocket (Chat) (parsing)",
            meta: { err, event },
          });
        }
        setIsConnected(false);
      },
    });

    stompClient.activate();

    return () => {
      if (stompClient) {
        stompClient.deactivate();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user]);

  const handlePresenceEvent = useCallback((event) => {
    const { type, userId, userIds } = event;

    switch (type) {
      case "USER_ONLINE":
        setOnlineUsers((prev) => new Set([...prev, userId]));
        break;
      case "USER_OFFLINE":
        setOnlineUsers((prev) => {
          const newSet = new Set(prev);
          newSet.delete(userId);
          return newSet;
        });
        break;
      case "PRESENCE_LIST":
        setOnlineUsers(new Set(userIds || []));
        break;
      default:
        console.warn("Tipo de evento de presença desconhecido:", type);
    }
  }, []);

  const handleNewMessage = useCallback(
    (message) => {
      // Determinar o otherUserId baseado em quem enviou/recebeu
      // Se eu enviei, otherUserId é recipientId
      // Se eu recebi, otherUserId é senderId
      const otherUserId =
        message.senderId === user?.id ? message.recipientId : message.senderId;

      // Armazenar mensagens por otherUserId (não por chatId)
      setMessages((prev) => ({
        ...prev,
        [otherUserId]: [...(prev[otherUserId] || []), message],
      }));

      // Atualizar lista de conversas
      if (
        !activeConversation ||
        activeConversation.otherUserId !== otherUserId
      ) {
        setUnreadCount((prev) => prev + 1);

        setConversations((prev) => {
          const existingConv = prev.find((c) => c.otherUserId === otherUserId);

          if (existingConv) {
            return prev.map((conv) =>
              conv.otherUserId === otherUserId
                ? {
                    ...conv,
                    lastMessage: message.content,
                    lastMessageTime: message.createdAt,
                    unreadCount: (conv.unreadCount || 0) + 1,
                  }
                : conv
            );
          } else {
            // Nova conversa
            const newConv = {
              otherUserId: otherUserId,
              otherUsername:
                message.senderId === user?.id
                  ? message.recipientUsername
                  : message.senderUsername,
              otherName:
                message.senderId === user?.id
                  ? message.recipientName
                  : message.senderName,
              otherProfilePhotoUrl: null,
              lastMessage: message.content,
              lastMessageTime: message.createdAt,
              unreadCount: 1,
            };
            return [newConv, ...prev];
          }
        });
      }
    },
    [activeConversation, user]
  );

  // subscribeToChat e unsubscribeFromChat não são mais necessários
  // porque a API usa /user/queue/messages global
  const subscribeToChat = useCallback((otherUserId) => {
    // Não faz nada - subscribe já foi feito no onConnect
    /* suppressed debug */
  }, []);

  const unsubscribeFromChat = useCallback((otherUserId) => {
    // Não faz nada - subscribe é global
    /* suppressed debug */
  }, []);

  const sendMessageViaWebSocket = useCallback(
    (recipientId, content) => {
      if (!clientRef.current || !isConnected) {
        console.warn("[Chat] Não conectado, enviando via HTTP");
        return false;
      }

      try {
        clientRef.current.publish({
          destination: `/app/chat.send`,
          body: JSON.stringify({ recipientId, content }),
        });
        return true;
      } catch (error) {
        console.error("Erro ao enviar mensagem via WebSocket:", error);
        return false;
      }
    },
    [isConnected]
  );

  const addMessageLocally = useCallback((otherUserId, message) => {
    setMessages((prev) => ({
      ...prev,
      [otherUserId]: [...(prev[otherUserId] || []), message],
    }));
  }, []);

  const setConversationMessages = useCallback((otherUserId, messageList) => {
    setMessages((prev) => ({
      ...prev,
      [otherUserId]: messageList,
    }));
  }, []);

  const clearConversationMessages = useCallback((otherUserId) => {
    setMessages((prev) => {
      const newMessages = { ...prev };
      delete newMessages[otherUserId];
      return newMessages;
    });
  }, []);

  const updateUnreadCount = useCallback((count) => {
    setUnreadCount(count);
  }, []);

  const isUserOnline = useCallback(
    (userId) => {
      return onlineUsers.has(userId);
    },
    [onlineUsers]
  );

  const value = {
    conversations,
    setConversations,
    activeConversation,
    setActiveConversation,
    messages,
    unreadCount,
    isConnected,
    onlineUsers,
    isUserOnline,
    subscribeToChat,
    unsubscribeFromChat,
    sendMessageViaWebSocket,
    addMessageLocally,
    setConversationMessages,
    clearConversationMessages,
    updateUnreadCount,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}
