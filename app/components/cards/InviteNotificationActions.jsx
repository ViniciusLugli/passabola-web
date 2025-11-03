"use client";

import { useState } from "react";
import { api } from "@/app/lib/api";
import { useNotifications } from "@/app/context/NotificationContext";
import { useAuth } from "@/app/context/AuthContext";
import Button from "@/app/components/ui/Button";
import { Check, X } from "lucide-react";

export default function InviteNotificationActions({
  notification,
  onComplete,
}) {
  const [loading, setLoading] = useState(false);
  const { removeNotificationLocally } = useNotifications();
  const { user: currentUser } = useAuth();

  const logAction = (action, details = {}) => {
    try {
      const payload = {
        time: new Date().toISOString(),
        action,
        notificationId: notification?.id,
        inviteId: notification?.metadata?.inviteId,
        teamId:
          notification?.metadata?.teamId || notification?.metadata?.teamId === 0
            ? notification?.metadata?.teamId
            : null,
        userId: currentUser?.id ?? null,
        userType: currentUser?.userType ?? currentUser?.role ?? null,
        ...details,
      };
      console.info("invite-action", payload);
    } catch (e) {
      console.info("invite-action", { action, error: String(e) });
    }
  };

  const handleAcceptGameInvite = async () => {
    if (!notification.metadata?.inviteId) return;

    setLoading(true);
    logAction("accept_game_invite:start");
    try {
      await api.gameInvites.accept(notification.metadata.inviteId);
      removeNotificationLocally(notification.id);
      logAction("accept_game_invite:success");
      if (onComplete) {
        onComplete("success", "Convite de jogo aceito!");
      }
    } catch (err) {
      console.error("Erro ao aceitar convite de jogo:", err);
      logAction("accept_game_invite:error", {
        error: err?.message || String(err),
      });
      if (onComplete) {
        onComplete("error", err.message || "Erro ao aceitar convite de jogo.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRejectGameInvite = async () => {
    if (!notification.metadata?.inviteId) return;

    setLoading(true);
    logAction("reject_game_invite:start");
    try {
      await api.gameInvites.reject(notification.metadata.inviteId);
      removeNotificationLocally(notification.id);
      logAction("reject_game_invite:success");
      if (onComplete) {
        onComplete("success", "Convite de jogo rejeitado.");
      }
    } catch (err) {
      console.error("Erro ao rejeitar convite de jogo:", err);
      logAction("reject_game_invite:error", {
        error: err?.message || String(err),
      });
      if (onComplete) {
        onComplete("error", err.message || "Erro ao rejeitar convite de jogo.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptTeamInvite = async () => {
    if (!notification.metadata?.inviteId) return;

    setLoading(true);
    logAction("accept_team_invite:start");
    try {
      await api.teams.acceptInvite(notification.metadata.inviteId);
      removeNotificationLocally(notification.id);
      logAction("accept_team_invite:success");
      if (onComplete) {
        onComplete("success", "Convite de time aceito!");
      }
    } catch (err) {
      console.error("Erro ao aceitar convite de time:", err);
      logAction("accept_team_invite:error", {
        error: err?.message || String(err),
      });
      if (onComplete) {
        onComplete("error", err.message || "Erro ao aceitar convite de time.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRejectTeamInvite = async () => {
    if (!notification.metadata?.inviteId) return;

    setLoading(true);
    logAction("reject_team_invite:start");
    try {
      await api.teams.rejectInvite(notification.metadata.inviteId);
      removeNotificationLocally(notification.id);
      logAction("reject_team_invite:success");
      if (onComplete) {
        onComplete("success", "Convite de time rejeitado.");
      }
    } catch (err) {
      console.error("Erro ao rejeitar convite de time:", err);
      logAction("reject_team_invite:error", {
        error: err?.message || String(err),
      });
      if (onComplete) {
        onComplete("error", err.message || "Erro ao rejeitar convite de time.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (notification.type === "GAME_INVITE") {
    return (
      <div className="flex flex-col sm:flex-row items-stretch gap-3 mt-2">
        <Button
          onClick={handleAcceptGameInvite}
          disabled={loading}
          className="w-full sm:flex-1 text-sm px-4 py-2 shadow-none inline-flex items-center justify-center gap-2 rounded-lg"
          variant="primary"
        >
          <Check className="w-4 h-4" />
          <span>{loading ? "..." : "Aceitar"}</span>
        </Button>
        <Button
          onClick={handleRejectGameInvite}
          disabled={loading}
          className="w-full sm:flex-1 text-sm px-4 py-2 shadow-none inline-flex items-center justify-center gap-2 rounded-lg"
          variant="danger"
        >
          <X className="w-4 h-4" />
          <span>{loading ? "..." : "Rejeitar"}</span>
        </Button>
      </div>
    );
  }

  if (notification.type === "TEAM_INVITE") {
    return (
      // stacked on mobile, side-by-side equally on sm+
      <div className="flex flex-col sm:flex-row items-stretch gap-3 mt-2">
        <Button
          onClick={handleAcceptTeamInvite}
          disabled={loading}
          className="w-full sm:flex-1 text-sm px-4 py-2 shadow-none inline-flex items-center justify-center gap-2 rounded-lg"
          variant="primary"
        >
          <Check className="w-4 h-4" />
          <span>{loading ? "..." : "Aceitar"}</span>
        </Button>
        <Button
          onClick={handleRejectTeamInvite}
          disabled={loading}
          className="w-full sm:flex-1 text-sm px-4 py-2 shadow-none inline-flex items-center justify-center gap-2 rounded-lg"
          variant="danger"
        >
          <X className="w-4 h-4" />
          <span>{loading ? "..." : "Rejeitar"}</span>
        </Button>
      </div>
    );
  }

  return null;
}
