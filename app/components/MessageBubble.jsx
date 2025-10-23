"use client";

import { useAuth } from "@/app/context/AuthContext";

export default function MessageBubble({ message }) {
  const { user } = useAuth();
  const isOwnMessage = message.senderId === user?.id;

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} mb-4`}
    >
      <div
        className={`
          max-w-[70%]
          rounded-lg
          px-4
          py-2
          ${
            isOwnMessage
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-900"
          }
        `}
      >
        {!isOwnMessage && message.senderName && (
          <p className="text-xs font-semibold mb-1 opacity-75">
            {message.senderName}
          </p>
        )}

        <p className="text-sm break-words whitespace-pre-wrap">
          {message.content}
        </p>

        <p
          className={`
            text-xs
            mt-1
            ${isOwnMessage ? "text-blue-100" : "text-gray-500"}
          `}
        >
          {formatTime(message.sentAt)}
        </p>
      </div>
    </div>
  );
}
