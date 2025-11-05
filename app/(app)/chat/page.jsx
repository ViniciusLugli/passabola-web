"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import ConversationItem from "@/app/components/chat/ConversationItem";
import MessageBubble from "@/app/components/chat/MessageBubble";
import MessageInput from "@/app/components/chat/MessageInput";
import { useToast } from "@/app/context/ToastContext";
import { useAuth } from "@/app/context/AuthContext";
import { useChat } from "@/app/context/ChatContext";
import { useChatPreferences } from "@/app/hooks/useChatPreferences";
import { api } from "@/app/lib/api";
import LoadingSkeleton from "@/app/components/ui/LoadingSkeleton";
import EmptyState from "@/app/components/ui/EmptyState";
import ErrorState from "@/app/components/ui/ErrorState";
import { MessageCircle, Send } from "lucide-react";

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
    isUserOnline,
    subscribeToChat,
    unsubscribeFromChat,
    sendMessageViaWebSocket,
    addMessageLocally,
    setConversationMessages,
  } = useChat();

  const { showToast } = useToast();
  const { preferences, updatePreferences, isLoaded } = useChatPreferences();
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [showConversations, setShowConversations] = useState(true); // Mobile navigation state
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeConversation]);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    fetchConversations();
  }, [user, router]);

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
      showToast(err.message || "Erro ao carregar conversas.", "error");
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
      showToast("Erro ao carregar mensagens.", "error");
    } finally {
      setLoadingMessages(false);
    }
  };

  // Restore last active conversation from localStorage
  useEffect(() => {
    if (
      isLoaded &&
      preferences.lastActiveConversation &&
      conversations.length > 0 &&
      !activeConversation
    ) {
      const lastConversation = conversations.find(
        (c) => c.otherUserId === preferences.lastActiveConversation
      );
      if (lastConversation) {
        handleSelectConversation(lastConversation);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, conversations, preferences.lastActiveConversation]);

  const handleSelectConversation = (conversation) => {
    setActiveConversation(conversation);
    // conversation.otherUserId é o userId global do outro usuário
    fetchMessages(conversation.otherUserId);
    // On mobile, hide conversation list and show messages
    setShowConversations(false);

    // Save preference
    updatePreferences({ lastActiveConversation: conversation.otherUserId });
  };

  const handleBackToConversations = () => {
    setShowConversations(true);
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
      showToast("Erro ao enviar mensagem.", "error");

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
      <div className="bg-page min-h-screen">
        <main className="container mx-auto p-4 mt-8">
          <div className="bg-surface rounded-2xl border border-default shadow-elevated p-8">
            <LoadingSkeleton count={5} variant="list" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <main
        className="container mx-auto p-4 mt-8"
        style={{ height: "calc(100vh - 140px)" }}
      >
        <div className="bg-surface border border-default rounded-2xl shadow-elevated overflow-hidden h-full grid grid-cols-1 md:grid-cols-[320px_1fr]">
          {/* Lista de Conversas - Hidden on mobile when conversation is active */}
          <div
            className={`
              ${showConversations ? "flex" : "hidden md:flex"}
              w-full
              border-r
              border-default
              flex-col
              bg-surface-muted
              transition-all
              duration-300
              ease-in-out
            `}
          >
            <div className="p-4 border-b border-default">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-primary">Conversas</h2>
                {isConnected && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-secondary">Online</span>
                  </div>
                )}
              </div>
            </div>

            {/* notifications handled by ToastProvider via useToast */}

            <div className="flex-1 overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="p-8 text-center text-secondary">
                  <p>Nenhuma conversa ainda</p>
                  <p className="text-sm mt-2 text-tertiary">
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

          {/* Área de Mensagens - Hidden on mobile when showing conversations */}
          <div
            className={`
              ${showConversations ? "hidden md:flex" : "flex"}
              flex-col
              transition-all
              duration-300
              ease-in-out
            `}
          >
            {activeConversation ? (
              <>
                {/* Header da Conversa with back button on mobile */}
                <div className="p-4 border-b border-default bg-surface-muted">
                  <div className="flex items-center gap-3">
                    {/* Back button - only visible on mobile with min touch target 44x44 */}
                    <button
                      onClick={handleBackToConversations}
                      className="md:hidden p-2 hover:bg-surface rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                      aria-label="Voltar para conversas"
                    >
                      <svg
                        className="w-5 h-5 text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>

                    {/* Avatar with online indicator */}
                    <div className="relative flex-shrink-0">
                      <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                        <span className="text-accent font-semibold">
                          {(activeConversation.otherName || "U")
                            .charAt(0)
                            .toUpperCase()}
                        </span>
                      </div>
                      {/* Real-time online indicator from WebSocket presence */}
                      {isUserOnline(activeConversation.otherUserId) && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-surface-muted" />
                      )}
                    </div>

                    <div>
                      <h3 className="font-semibold text-primary">
                        {activeConversation.otherName || "Usuário"}
                      </h3>
                      {activeConversation.otherUsername && (
                        <p className="text-sm text-secondary">
                          @{activeConversation.otherUsername}
                        </p>
                      )}
                      {/* Real-time online status text */}
                      {isUserOnline(activeConversation.otherUserId) && (
                        <p className="text-xs text-accent">Ativo agora</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Mensagens */}
                <div className="flex-1 overflow-y-auto p-4 bg-surface">
                  {loadingMessages ? (
                    <div className="flex items-center justify-center h-full">
                      <LoadingSkeleton count={3} variant="list" />
                    </div>
                  ) : activeMessages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <EmptyState
                        icon={<MessageCircle />}
                        title="Nenhuma mensagem ainda"
                        description="Envie a primeira mensagem para começar a conversa!"
                        variant="default"
                      />
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
              <div className="flex-1 flex items-center justify-center bg-surface-muted">
                <div className="text-center text-secondary">
                  <svg
                    className="mx-auto h-16 w-16 text-tertiary mb-4"
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
                  <p className="text-sm mt-2 text-tertiary">
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
