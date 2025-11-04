"use client";

import { useChat } from "@/app/context/ChatContext";

export default function ConversationItem({ conversation, isActive, onClick }) {
  const { isUserOnline } = useChat();
  const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "Agora";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}min`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;

    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
    });
  };

  const getParticipantName = () => {
    return conversation.participantName || "Usuário";
  };

  // Check real-time online status from WebSocket presence
  const isOnline = isUserOnline(conversation.otherUserId);

  const getOnlineStatus = () => {
    if (isOnline) {
      return "Ativo agora";
    }
    return null;
  };

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className={`
        p-4
        min-h-[72px]
        border-b
        border-default
        cursor-pointer
        transition-all
        duration-200
        hover:bg-surface
        active:scale-[0.98]
        ${
          isActive
            ? "bg-accent-soft border-l-4 border-l-accent shadow-elevated"
            : "bg-surface-muted"
        }
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {/* Avatar with online indicator */}
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                <span className="text-accent font-semibold text-lg">
                  {getParticipantName().charAt(0).toUpperCase()}
                </span>
              </div>
              {/* Online indicator dot */}
              {isOnline && (
                <div className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-surface-muted" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-primary truncate">
                  {getParticipantName()}
                </h3>
                {conversation.unreadCount > 0 && (
                  <span className="bg-accent text-on-brand text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center font-medium">
                    {conversation.unreadCount > 9
                      ? "9+"
                      : conversation.unreadCount}
                  </span>
                )}
              </div>

              {/* Online status text */}
              {getOnlineStatus() && (
                <p className="text-xs text-accent mt-0.5">
                  {getOnlineStatus()}
                </p>
              )}
            </div>
          </div>

          {conversation.lastMessage && (
            <p className="text-sm text-secondary truncate mt-1">
              {conversation.lastMessage}
            </p>
          )}
        </div>

        <span className="text-xs text-tertiary ml-2 flex-shrink-0">
          {formatDate(conversation.lastMessageAt)}
        </span>
      </div>
    </div>
  );
}
