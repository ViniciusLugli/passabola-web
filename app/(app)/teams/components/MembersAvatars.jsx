"use client";

import React from "react";

export default function MembersAvatars({
  players = [],
  invites = [],
  playersCount = 0,
}) {
  // normalize invites into player-like objects with robust fallbacks
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
      null;

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

  const combined = [...players, ...((invites || []).map(mapInvite) || [])];

  return (
    <div className="mt-4">
      <h3 className="text-sm font-medium text-secondary mb-2">Membros</h3>
      <div className="flex items-center gap-2">
        {combined.slice(0, 8).map((p) => (
          <img
            key={p.id}
            src={
              p.avatarUrl ||
              p.profilePhoto ||
              p.photo ||
              "/icons/user-default.png"
            }
            alt={p.name || p.username || "Pendente"}
            className={`w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover ${
              p.pending ? "opacity-60" : ""
            }`}
          />
        ))}

        {playersCount > 8 && (
          <div className="w-10 h-10 rounded-full bg-surface-muted flex items-center justify-center text-sm text-secondary border-2 border-white">
            +{playersCount - 8}
          </div>
        )}
      </div>
    </div>
  );
}
