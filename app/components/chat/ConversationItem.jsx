"use client";

export default function ConversationItem({ conversation, isActive, onClick }) {
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

  return (
    <div
      onClick={onClick}
      className={`
        p-4
        border-b
        border-default
        cursor-pointer
        transition-colors
        duration-200
        hover:bg-surface
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
            <h3 className="font-semibold text-primary truncate">
              {getParticipantName()}
            </h3>
            {conversation.unreadCount > 0 && (
              <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                {conversation.unreadCount > 9 ? "9+" : conversation.unreadCount}
              </span>
            )}
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
