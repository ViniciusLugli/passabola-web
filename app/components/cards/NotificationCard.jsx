"use client";

import { useRouter } from "next/navigation";
import InviteNotificationActions from "./InviteNotificationActions";

export default function NotificationCard({
  notification,
  onMarkAsRead,
  onDelete,
  onActionComplete,
}) {
  const router = useRouter();

  const getNotificationIcon = () => {
    switch (notification.type) {
      case "TEAM_INVITE":
        return "👥";
      case "GAME_INVITE":
        return "⚽";
      case "GAME_UPDATE":
        return "📅";
      case "NEW_POST":
        return "📝";
      case "NEW_FOLLOWER":
        return "👤";
      case "SYSTEM":
        return "🔔";
      default:
        return "📬";
    }
  };

  const handleClick = () => {
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
    if (
      notification.link &&
      !["GAME_INVITE", "TEAM_INVITE"].includes(notification.type)
    ) {
      router.push(notification.link);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "Agora mesmo";
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} min atrás`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} h atrás`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)} dias atrás`;

    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div
      className={`
        relative
        p-4
        rounded-lg
        border
        transition-all
        duration-200
        ${
          notification.read
            ? "bg-gray-50 border-gray-200"
            : "bg-blue-50 border-blue-300"
        }
        ${
          ["GAME_INVITE", "TEAM_INVITE"].includes(notification.type)
            ? ""
            : "hover:shadow-md cursor-pointer"
        }
      `}
      onClick={
        ["GAME_INVITE", "TEAM_INVITE"].includes(notification.type)
          ? undefined
          : handleClick
      }
    >
      {!notification.read && (
        <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full"></div>
      )}

      <div className="flex items-start gap-3">
        <div className="text-3xl flex-shrink-0">{getNotificationIcon()}</div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-sm md:text-base">
            {notification.title}
          </h3>
          <p className="text-gray-600 text-xs md:text-sm mt-1 break-words">
            {notification.message}
          </p>
          <p className="text-gray-400 text-xs mt-2">
            {formatDate(notification.createdAt)}
          </p>

          {/* Ações de convite */}
          {["GAME_INVITE", "TEAM_INVITE"].includes(notification.type) && (
            <InviteNotificationActions
              notification={notification}
              onComplete={onActionComplete}
            />
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(notification.id);
          }}
          className="
            text-gray-400
            hover:text-red-500
            transition-colors
            duration-200
            p-1
            flex-shrink-0
          "
          title="Deletar notificação"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
