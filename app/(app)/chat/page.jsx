"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/app/context/ToastContext";
import { useAuth } from "@/app/context/AuthContext";
import { useChat } from "@/app/context/ChatContext";
import { useChatPreferences } from "@/app/hooks/useChatPreferences";
import { useConversations } from "./hooks/useConversations";
import { useChatMessages } from "./hooks/useChatMessages";
import ConversationList from "./components/ConversationList";
import ChatWindow from "./components/ChatWindow";
import EmptyChatState from "./components/EmptyChatState";
import LoadingSkeleton from "@/app/components/ui/LoadingSkeleton";

export default function ChatPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { showToast } = useToast();
  const { preferences, updatePreferences, isLoaded } = useChatPreferences();
  const [showConversations, setShowConversations] = useState(true);

  const {
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

  // Stable callbacks to prevent infinite loops
  const handleError = useCallback(
    (message) => {
      showToast(message, "error");
    },
    [showToast]
  );

  const handleSessionExpired = useCallback(() => {
    showToast("Sessão expirada. Faça login novamente.", "error");
    setTimeout(() => router.push("/login"), 2000);
  }, [showToast, router]);

  // Custom hooks for conversations and messages management
  const {
    conversations,
    loading,
    fetchConversations,
    updateConversationOptimistically,
  } = useConversations({
    onError: handleError,
    onSessionExpired: handleSessionExpired,
  });

  const {
    activeMessages,
    loadingMessages,
    sending,
    messagesEndRef,
    fetchMessages,
    sendMessage,
  } = useChatMessages({
    activeConversation,
    user,
    messages,
    setConversationMessages,
    addMessageLocally,
    sendMessageViaWebSocket,
    onUpdateConversation: updateConversationOptimistically,
    onError: handleError,
  });

  // Auth check and initial data fetch
  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    fetchConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]); // Only run on user change or mount

  // Sync conversations with ChatContext (only when conversations actually change)
  useEffect(() => {
    if (conversations.length >= 0) {
      setConversations(conversations);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(conversations.map((c) => c.otherUserId))]); // Only update when conversation IDs change

  // WebSocket subscription management
  useEffect(() => {
    if (activeConversation?.otherUserId && isConnected) {
      subscribeToChat(activeConversation.otherUserId);

      return () => {
        unsubscribeFromChat(activeConversation.otherUserId);
      };
    }
  }, [
    activeConversation?.otherUserId,
    isConnected,
    subscribeToChat,
    unsubscribeFromChat,
  ]);

  // Memoize handleSelectConversation to prevent recreation on every render
  const handleSelectConversation = useCallback(
    (conversation) => {
      setActiveConversation(conversation);
      fetchMessages(conversation.otherUserId);
      setShowConversations(false);
      updatePreferences({ lastActiveConversation: conversation.otherUserId });
    },
    [fetchMessages, setActiveConversation, updatePreferences]
  );

  // Restore last active conversation from preferences
  useEffect(() => {
    if (
      isLoaded &&
      preferences.lastActiveConversation &&
      conversations.length > 0 &&
      !activeConversation
    ) {
      const lastConversation = conversations.find(
        (c) =>
          String(c.otherUserId) === String(preferences.lastActiveConversation)
      );

      if (lastConversation) {
        handleSelectConversation(lastConversation);
      }
    }
  }, [
    isLoaded,
    conversations,
    preferences.lastActiveConversation,
    activeConversation,
    handleSelectConversation,
  ]);

  const handleBackToConversations = useCallback(() => {
    setShowConversations(true);
  }, []);

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
          {/* Conversation List - Hidden on mobile when chat is active */}
          <ConversationList
            conversations={conversations}
            activeConversation={activeConversation}
            isConnected={isConnected}
            onSelectConversation={handleSelectConversation}
            className={`
              ${showConversations ? "flex" : "hidden md:flex"}
              w-full
              border-r
              border-default
              transition-all
              duration-300
              ease-in-out
            `}
          />

          {/* Chat Window - Hidden on mobile when showing conversations */}
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
              <ChatWindow
                conversation={activeConversation}
                messages={activeMessages}
                isUserOnline={isUserOnline}
                loadingMessages={loadingMessages}
                sending={sending}
                messagesEndRef={messagesEndRef}
                onSendMessage={sendMessage}
                onBack={handleBackToConversations}
              />
            ) : (
              <EmptyChatState />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
