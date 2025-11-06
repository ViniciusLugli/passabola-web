import MessageBubble from "@/app/components/chat/MessageBubble";
import MessageInput from "@/app/components/chat/MessageInput";
import LoadingSkeleton from "@/app/components/ui/LoadingSkeleton";
import EmptyState from "@/app/components/ui/EmptyState";
import { MessageCircle } from "lucide-react";

/**
 * Main chat window displaying messages and input
 */
export default function ChatWindow({
  conversation,
  messages,
  isUserOnline,
  loadingMessages,
  sending,
  messagesEndRef,
  onSendMessage,
  onBack,
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <ChatHeader
        conversation={conversation}
        isUserOnline={isUserOnline}
        onBack={onBack}
      />

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-surface">
        {loadingMessages ? (
          <div className="flex items-center justify-center h-full">
            <LoadingSkeleton count={3} variant="list" />
          </div>
        ) : messages.length === 0 ? (
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
            {messages.map((message, index) => (
              <MessageBubble key={message.id || index} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <MessageInput
        onSend={onSendMessage}
        disabled={sending || loadingMessages}
      />
    </div>
  );
}

function ChatHeader({ conversation, isUserOnline, onBack }) {
  const isOnline = isUserOnline(conversation.otherUserId);

  return (
    <div className="p-4 border-b border-default bg-surface-muted">
      <div className="flex items-center gap-3">
        {/* Back Button - Mobile Only */}
        <button
          onClick={onBack}
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

        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
            <span className="text-accent font-semibold">
              {(conversation.otherName || "U").charAt(0).toUpperCase()}
            </span>
          </div>
          {isOnline && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-surface-muted" />
          )}
        </div>

        {/* User Info */}
        <div>
          <h3 className="font-semibold text-primary">
            {conversation.otherName || "Usuário"}
          </h3>
          {conversation.otherUsername && (
            <p className="text-sm text-secondary">
              @{conversation.otherUsername}
            </p>
          )}
          {isOnline && <p className="text-xs text-accent">Ativo agora</p>}
        </div>
      </div>
    </div>
  );
}
