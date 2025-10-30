"use client";

import React from "react";
import PlayerRow from "./PlayerRow";

export default function MemberList({
  team = {},
  currentUser = {},
  actionLoading = false,
  onRemovePlayer,
  onCancelInvite,
  leaderId,
}) {
  const players = team.players || [];
  const invites = team.invites || [];

  const playersOnly = players.map((p) => ({
    ...p,
    pending: false,
  }));

  const mapInvite = (it) => {
    const name =
      it?.name ||
      it?.username ||
      it?.email ||
      it?.invitedName ||
      it?.inviteeName ||
      it?.invitedEmail ||
      it?.inviteeEmail ||
      it?.player?.name ||
      it?.player?.username ||
      it?.player?.email ||
      it?.user?.name ||
      it?.user?.username ||
      "Pendente";

    const avatar =
      it?.profilePhoto ||
      it?.avatarUrl ||
      it?.photo ||
      it?.player?.profilePhoto ||
      it?.player?.photo ||
      it?.user?.avatar ||
      "/icons/user-default.png";

    return {
      id: it.invitedPlayerId ?? it.playerId ?? `invite-${it.id}`,
      _inviteId: it.id,
      pending: true,
      username: it.username ?? null,
      name: name,
      avatarUrl: avatar,
    };
  };

  const pendingInvites = invites.map(mapInvite);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3">
        {playersOnly.map((p) => (
          <PlayerRow
            key={p.id}
            player={p}
            leaderId={leaderId}
            currentUserId={currentUser?.id}
            action={
              currentUser?.id &&
              leaderId &&
              String(currentUser.id) === String(leaderId) &&
              String(p.id ?? p.playerId) !== String(leaderId) ? (
                <button
                  disabled={actionLoading}
                  onClick={() => onRemovePlayer?.(p.id ?? p.playerId)}
                  className="text-xs bg-red-500 hover:bg-red-600 text-white px-2 py-0.5 rounded"
                >
                  Remover
                </button>
              ) : null
            }
          />
        ))}
      </div>

      {console.log("pendingInvites", pendingInvites)}

      {pendingInvites.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-secondary mb-2">
            Convites pendentes
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {pendingInvites.map((p) => (
              <PlayerRow
                key={p.id}
                player={p}
                leaderId={leaderId}
                currentUserId={currentUser?.id}
                action={
                  currentUser?.id &&
                  leaderId &&
                  String(currentUser.id) === String(leaderId) ? (
                    <button
                      disabled={actionLoading}
                      onClick={() => onCancelInvite?.(p._inviteId)}
                      className="text-xs bg-red-500 hover:bg-red-600 text-white px-2 py-0.5 rounded"
                    >
                      Cancelar
                    </button>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Pendente
                    </span>
                  )
                }
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
