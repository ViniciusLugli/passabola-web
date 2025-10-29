"use client";

import { useState } from "react";
import { api } from "@/app/lib/api";
import { useNotifications } from "@/app/context/NotificationContext";
import Button from "@/app/components/ui/Button";

export default function InviteNotificationActions({
  notification,
  onComplete,
}) {
  const [loading, setLoading] = useState(false);
  const { removeNotificationLocally } = useNotifications();

  const handleAcceptGameInvite = async () => {
    if (!notification.metadata?.inviteId) return;

    setLoading(true);
    try {
      await api.gameInvites.accept(notification.metadata.inviteId);
      removeNotificationLocally(notification.id);
      if (onComplete) {
        onComplete("success", "Convite de jogo aceito!");
      }
    } catch (err) {
      console.error("Erro ao aceitar convite de jogo:", err);
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
    try {
      await api.gameInvites.reject(notification.metadata.inviteId);
      removeNotificationLocally(notification.id);
      if (onComplete) {
        onComplete("success", "Convite de jogo rejeitado.");
      }
    } catch (err) {
      console.error("Erro ao rejeitar convite de jogo:", err);
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
    try {
      await api.teams.acceptInvite(notification.metadata.inviteId);
      removeNotificationLocally(notification.id);
      if (onComplete) {
        onComplete("success", "Convite de time aceito!");
      }
    } catch (err) {
      console.error("Erro ao aceitar convite de time:", err);
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
    try {
      await api.teams.rejectInvite(notification.metadata.inviteId);
      removeNotificationLocally(notification.id);
      if (onComplete) {
        onComplete("success", "Convite de time rejeitado.");
      }
    } catch (err) {
      console.error("Erro ao rejeitar convite de time:", err);
      if (onComplete) {
        onComplete("error", err.message || "Erro ao rejeitar convite de time.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (notification.type === "GAME_INVITE") {
    return (
      <div className="flex gap-2 mt-3">
        <Button
          onClick={handleAcceptGameInvite}
          disabled={loading}
          className="flex-1 text-sm shadow-none"
          variant="primary"
        >
          {loading ? "Processando..." : "Aceitar"}
        </Button>
        <Button
          onClick={handleRejectGameInvite}
          disabled={loading}
          className="flex-1 text-sm shadow-none"
          variant="danger"
        >
          {loading ? "Processando..." : "Rejeitar"}
        </Button>
      </div>
    );
  }

  if (notification.type === "TEAM_INVITE") {
    return (
      <div className="flex gap-2 mt-3">
        <Button
          onClick={handleAcceptTeamInvite}
          disabled={loading}
          className="flex-1 text-sm shadow-none"
          variant="primary"
        >
          {loading ? "Processando..." : "Aceitar"}
        </Button>
        <Button
          onClick={handleRejectTeamInvite}
          disabled={loading}
          className="flex-1 text-sm shadow-none"
          variant="danger"
        >
          {loading ? "Processando..." : "Rejeitar"}
        </Button>
      </div>
    );
  }

  return null;
}
