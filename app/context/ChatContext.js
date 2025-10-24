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
  const clientRef = useRef(null);
  const subscriptionsRef = useRef({});

  useEffect(() => {
    if (!ENABLE_CHAT_WEBSOCKET) {
      console.log("[Chat WebSocket] Desabilitado via configuração");
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
      debug: (str) => {
        if (process.env.NODE_ENV === "development") {
          console.log("[Chat WebSocket]", str);
        }
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log("Chat WebSocket conectado!");
        setIsConnected(true);

        stompClient.subscribe(`/user/queue/messages`, (message) => {
          try {
            const newMessage = JSON.parse(message.body);
            console.log("Nova mensagem recebida:", newMessage);

            handleNewMessage(newMessage);
          } catch (error) {
            console.error("Erro ao processar mensagem:", error);
          }
        });

        clientRef.current = stompClient;
      },
      onDisconnect: () => {
        console.log("Chat WebSocket desconectado");
        setIsConnected(false);
      },
      onStompError: (frame) => {
        console.error("Erro STOMP (Chat):", frame);
        setIsConnected(false);
      },
      onWebSocketError: (event) => {
        console.error("Erro WebSocket (Chat):", event);
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
    console.log(`[Chat] Conversa com ${otherUserId} ativa`);
  }, []);

  const unsubscribeFromChat = useCallback((otherUserId) => {
    // Não faz nada - subscribe é global
    console.log(`[Chat] Conversa com ${otherUserId} inativa`);
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

  const value = {
    conversations,
    setConversations,
    activeConversation,
    setActiveConversation,
    messages,
    unreadCount,
    isConnected,
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
