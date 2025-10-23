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
      const chatId = message.chatId;

      setMessages((prev) => ({
        ...prev,
        [chatId]: [...(prev[chatId] || []), message],
      }));

      if (!activeConversation || activeConversation.id !== chatId) {
        setUnreadCount((prev) => prev + 1);

        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === chatId
              ? {
                  ...conv,
                  lastMessage: message.content,
                  lastMessageAt: message.sentAt,
                  unreadCount: (conv.unreadCount || 0) + 1,
                }
              : conv
          )
        );
      }
    },
    [activeConversation]
  );

  const subscribeToChat = useCallback(
    (chatId) => {
      if (!clientRef.current || !isConnected) {
        console.warn("[Chat] Não conectado, não é possível subscrever");
        return;
      }

      if (subscriptionsRef.current[chatId]) {
        return;
      }

      const subscription = clientRef.current.subscribe(
        `/user/queue/messages/${chatId}`,
        (message) => {
          try {
            const newMessage = JSON.parse(message.body);
            handleNewMessage(newMessage);
          } catch (error) {
            console.error("Erro ao processar mensagem:", error);
          }
        }
      );

      subscriptionsRef.current[chatId] = subscription;
    },
    [isConnected, handleNewMessage]
  );

  const unsubscribeFromChat = useCallback((chatId) => {
    if (subscriptionsRef.current[chatId]) {
      subscriptionsRef.current[chatId].unsubscribe();
      delete subscriptionsRef.current[chatId];
    }
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

  const addMessageLocally = useCallback((chatId, message) => {
    setMessages((prev) => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), message],
    }));
  }, []);

  const setConversationMessages = useCallback((chatId, messageList) => {
    setMessages((prev) => ({
      ...prev,
      [chatId]: messageList,
    }));
  }, []);

  const clearConversationMessages = useCallback((chatId) => {
    setMessages((prev) => {
      const newMessages = { ...prev };
      delete newMessages[chatId];
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
