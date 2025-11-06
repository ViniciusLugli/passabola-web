"use client";

import Link from "next/link";
import { Users } from "lucide-react";

function TeamCard({ team }) {
  const teamName =
    team?.name ?? team?.nameTeam ?? team?.teamName ?? "Equipe sem nome";
  const teamBio = team?.bio ?? team?.description ?? "";
  const followersCount =
    team?.followers ?? team?.playerCount ?? team?.players?.length ?? 0;

  return (
    <Link
      href={`/teams/${team.id}`}
      className="
        block 
        bg-surface
        border
        border-default
        rounded-xl
        hover:border-accent
        hover:bg-surface-elevated
        hover:shadow-elevated
        transition-all
        duration-200 
        ease-in-out 
        overflow-hidden
      "
    >
      <div className="p-3 sm:p-4 md:p-5">
        <h2 className="text-lg sm:text-xl font-bold text-primary mb-1.5 sm:mb-2 truncate">
          {teamName}
        </h2>
        {teamBio && (
          <p className="text-secondary text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2 leading-relaxed">
            {teamBio}
          </p>
        )}
        <div className="flex items-center text-zinc-500 dark:text-gray-300 text-xs sm:text-sm font-bold">
          <Users
            className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 flex-shrink-0"
            strokeWidth={2}
          />
          <span>{followersCount} jogadoras</span>
        </div>
      </div>
    </Link>
  );
}

export default TeamCard;
