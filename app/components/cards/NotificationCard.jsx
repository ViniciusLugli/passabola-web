"use client";

import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { Check, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import InviteNotificationActions from "./InviteNotificationActions";

export default function NotificationCard({
  notification,
  onMarkAsRead,
  onDelete,
  onActionComplete,
  selectable = false,
  selected = false,
  onToggleSelect,
}) {
  const router = useRouter();
  const [dragX, setDragX] = useState(0);
  const [open, setOpen] = useState(false);
  const startXRef = useRef(0);
  const draggingRef = useRef(false);
  const contentRef = useRef(null);

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

  const handlePointerDown = (e) => {
    startXRef.current = e.clientX;
    draggingRef.current = true;
    try {
      e.target.setPointerCapture?.(e.pointerId);
    } catch (err) {}
  };

  const handlePointerMove = (e) => {
    if (!draggingRef.current) return;
    const delta = e.clientX - startXRef.current;
    // only allow left swipe
    if (delta < 0) {
      setDragX(Math.max(delta, -120));
    } else {
      setDragX(0);
    }
  };

  const handlePointerUp = (e) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    const threshold = -64;
    if (dragX <= threshold) {
      setOpen(true);
      setDragX(-96);
    } else {
      setOpen(false);
      setDragX(0);
    }
    try {
      e.target.releasePointerCapture?.(e.pointerId);
    } catch (err) {}
  };

  return (
    <div className="relative">
      {/* action overlay revealed on swipe */}
      <div
        className={`absolute inset-y-0 right-0 flex items-center gap-2 pr-2 ${
          open || dragX !== 0 ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        <button
          onClick={() => {
            onMarkAsRead(notification.id);
            setOpen(false);
            setDragX(0);
          }}
          className="pointer-events-auto bg-accent text-on-brand px-3 py-1 rounded text-xs flex items-center gap-2"
          aria-label={`Marcar notificação ${notification.id} como lida`}
        >
          <Check className="w-4 h-4" />
          <span className="sr-only">Marcar como lida</span>
        </button>
        <button
          onClick={() => {
            onDelete(notification.id);
            setOpen(false);
            setDragX(0);
          }}
          className="pointer-events-auto bg-red-500 text-white px-3 py-1 rounded text-xs flex items-center gap-2"
          aria-label={`Deletar notificação ${notification.id}`}
        >
          <Trash2 className="w-4 h-4" />
          <span className="sr-only">Deletar</span>
        </button>
      </div>

      <div
        ref={contentRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{ transform: `translateX(${dragX}px)`, touchAction: "pan-y" }}
        className={`
          p-4 rounded-lg border transition-transform duration-200 flex items-start gap-3 cursor-default
          ${
            notification.read
              ? "bg-surface border-default"
              : "bg-surface border-default border-l-4 border-accent"
          }
        `}
        onClick={
          ["GAME_INVITE", "TEAM_INVITE"].includes(notification.type)
            ? undefined
            : handleClick
        }
      >
        {selectable && (
          <input
            type="checkbox"
            checked={!!selected}
            onChange={(e) => {
              e.stopPropagation();
              onToggleSelect?.(notification.id);
            }}
            aria-label={`Selecionar notificação ${notification.title}`}
            className="mt-1 mr-2 flex-shrink-0 w-4 h-4"
          />
        )}

        <div className="text-3xl flex-shrink-0">{getNotificationIcon()}</div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-primary text-sm md:text-base">
            {notification.title}
          </h3>
          <p className="text-secondary text-xs md:text-sm mt-1 break-words">
            {notification.message}
          </p>
          <p className="text-tertiary text-xs mt-2">
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
          className="text-gray-800 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200 p-1 flex-shrink-0"
          title="Deletar notificação"
          aria-label={`Deletar notificação ${notification.title}`}
        >
          <X className="w-5 h-5" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
