"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/components/Header";
import ConversationItem from "@/app/components/ConversationItem";
import MessageBubble from "@/app/components/MessageBubble";
import MessageInput from "@/app/components/MessageInput";
import Alert from "@/app/components/Alert";
import { useAuth } from "@/app/context/AuthContext";
import { useChat } from "@/app/context/ChatContext";
import { api } from "@/app/lib/api";

export default function ChatPage() {
  const router = useRouter();
  const { user } = useAuth();
  const {
    conversations,
    setConversations,
    activeConversation,
    setActiveConversation,
    messages,
    isConnected,
    subscribeToChat,
    unsubscribeFromChat,
    sendMessageViaWebSocket,
    addMessageLocally,
    setConversationMessages,
  } = useChat();

  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll para o final das mensagens
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeConversation]);

  // Carregar conversas
  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    fetchConversations();
  }, [user, router]);

  // Subscrever à conversa ativa
  useEffect(() => {
    if (activeConversation && isConnected) {
      // WebSocket usa otherUserId para identificar a conversa
      subscribeToChat(activeConversation.otherUserId);

      return () => {
        unsubscribeFromChat(activeConversation.otherUserId);
      };
    }
  }, [activeConversation, isConnected, subscribeToChat, unsubscribeFromChat]);

  const fetchConversations = async () => {
    setLoading(true);
    try {
      // GET /api/chat/conversations - Retorna array direto
      const conversations = await api.chats.getConversations();
      setConversations(Array.isArray(conversations) ? conversations : []);
    } catch (err) {
      console.error("Erro ao buscar conversas:", err);
      setAlert({
        type: "error",
        message: err.message || "Erro ao carregar conversas.",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (otherUserId) => {
    setLoadingMessages(true);
    try {
      // GET /api/chat/conversation/{otherUserId} - Retorna array de mensagens
      const messages = await api.chats.getConversation(otherUserId);
      setConversationMessages(
        otherUserId,
        Array.isArray(messages) ? messages : []
      );

      // PUT /api/chat/read/{senderId} - Marcar mensagens deste remetente como lidas
      await api.chats.markAsRead(otherUserId);
    } catch (err) {
      console.error("Erro ao buscar mensagens:", err);
      setAlert({
        type: "error",
        message: "Erro ao carregar mensagens.",
      });
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSelectConversation = (conversation) => {
    setActiveConversation(conversation);
    // conversation.otherUserId é o userId global do outro usuário
    fetchMessages(conversation.otherUserId);
  };

  const handleSendMessage = async (content) => {
    if (!activeConversation) return;

    setSending(true);

    // Envio otimista
    const optimisticMessage = {
      id: `temp-${Date.now()}`,
      content,
      senderId: user.id,
      senderName: user.name,
      senderUsername: user.username,
      recipientId: activeConversation.otherUserId,
      recipientName: activeConversation.otherName,
      recipientUsername: activeConversation.otherUsername,
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    addMessageLocally(activeConversation.otherUserId, optimisticMessage);

    try {
      // Tentar via WebSocket primeiro
      // sendMessageViaWebSocket usa recipientId (userId global)
      const sentViaWS = sendMessageViaWebSocket(
        activeConversation.otherUserId,
        content
      );

      // Se WebSocket não disponível, usar HTTP
      // POST /api/chat/send { recipientId, content }
      if (!sentViaWS) {
        await api.chats.sendMessage(activeConversation.otherUserId, content);
      }
    } catch (err) {
      console.error("Erro ao enviar mensagem:", err);
      setAlert({
        type: "error",
        message: "Erro ao enviar mensagem.",
      });

      // Remover mensagem otimista em caso de erro
      // (idealmente implementar lógica de retry ou marcação de falha)
    } finally {
      setSending(false);
    }
  };

  const activeMessages = activeConversation
    ? messages[activeConversation.otherUserId] || []
    : [];

  if (loading) {
    return (
      <div className="bg-gray-100 min-h-screen">
        <Header />
        <main className="container mx-auto p-4 mt-8">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <p className="text-center text-gray-600">Carregando conversas...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="transparent min-h-screen">
      <Header />
      <main
        className="container mx-auto p-4 mt-8"
        style={{ height: "calc(100vh - 140px)" }}
      >
        <div className="bg-white border border-zinc-300 rounded-2xl shadow-lg overflow-hidden h-full flex flex-col md:flex-row">
          {/* Lista de Conversas */}
          <div className="w-full md:w-1/3 border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Conversas</h2>
                {isConnected && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-gray-500">Online</span>
                  </div>
                )}
              </div>
            </div>

            {alert && (
              <div className="p-4">
                <Alert type={alert.type} message={alert.message} />
              </div>
            )}

            <div className="flex-1 overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <p>Nenhuma conversa ainda</p>
                  <p className="text-sm mt-2">
                    Inicie uma conversa visitando o perfil de um usuário
                  </p>
                </div>
              ) : (
                conversations.map((conversation) => (
                  <ConversationItem
                    key={conversation.otherUserId}
                    conversation={conversation}
                    isActive={
                      activeConversation?.otherUserId ===
                      conversation.otherUserId
                    }
                    onClick={() => handleSelectConversation(conversation)}
                  />
                ))
              )}
            </div>
          </div>

          {/* Área de Mensagens */}
          <div className="flex-1 flex flex-col">
            {activeConversation ? (
              <>
                {/* Header da Conversa */}
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <h3 className="font-semibold text-gray-900">
                    {activeConversation.otherName || "Usuário"}
                  </h3>
                  {activeConversation.otherUsername && (
                    <p className="text-sm text-gray-500">
                      @{activeConversation.otherUsername}
                    </p>
                  )}
                </div>

                {/* Mensagens */}
                <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                  {loadingMessages ? (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-500">Carregando mensagens...</p>
                    </div>
                  ) : activeMessages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-500">Nenhuma mensagem ainda</p>
                    </div>
                  ) : (
                    <>
                      {activeMessages.map((message, index) => (
                        <MessageBubble
                          key={message.id || index}
                          message={message}
                        />
                      ))}
                      <div ref={messagesEndRef} />
                    </>
                  )}
                </div>

                {/* Input de Mensagem */}
                <MessageInput
                  onSend={handleSendMessage}
                  disabled={sending || loadingMessages}
                />
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center text-gray-500">
                  <svg
                    className="mx-auto h-16 w-16 text-gray-400 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <p className="text-lg font-medium">Selecione uma conversa</p>
                  <p className="text-sm mt-2">
                    Escolha uma conversa da lista para começar a conversar
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
