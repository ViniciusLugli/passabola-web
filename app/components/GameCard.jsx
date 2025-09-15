"use client";

import { useState } from "react";
import Image from "next/image";

export default function GameCard({ game }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const typeColors = {
    Campeonato: "bg-purple-800",
    Amistoso: "bg-green-600",
  };

  const statusIcons = {
    Campeonato: "/icons/campeonato.svg",
    Amistoso: "/icons/amistoso.svg",
  };

  return (
    <div
      onClick={() => setIsExpanded(!isExpanded)}
      className={`
        relative
        w-full
        bg-white
        rounded-2xl
        shadow-lg
        p-6
        flex
        flex-col
        cursor-pointer
        overflow-hidden
        transition-all
        duration-300
        ease-in-out
        ${isExpanded ? "shadow-2xl" : ""}
      `}
    >
      <div
        className={`
        absolute 
        top-0 
        right-0 
        py-1 
        px-4 
        rounded-bl-2xl 
        text-sm 
        font-bold 
        text-white 
        transition-all 
        duration-300
        ${typeColors[game.type]}
        ${isExpanded ? "w-30 rounded-none rounded-bl-2xl px-6 py-2" : ""}
      `}
      >
        {isExpanded ? (
          <div className="flex justify-center items-center gap-2">
            <Image
              src={statusIcons[game.type]}
              alt={game.type}
              width={50}
              height={50}
            />
          </div>
        ) : (
          <span>{game.type}</span>
        )}
      </div>

      <div className="flex justify-between items-start gap-4 z-10">
        <div className="flex-grow">
          <h3 className="font-bold text-lg md:text-xl text-gray-900 leading-tight">
            {game.name}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {game.address} - {game.date}
          </p>
          <p className="text-sm text-gray-500">{game.organizer}</p>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 mb-4 border-t border-gray-200 pt-4 z-10">
          <p className="text-gray-700 leading-relaxed">{game.description}</p>
        </div>
      )}

      <div
        className="
        absolute 
        bottom-4 
        right-4 
        p-2 
        bg-gray-200/50 
        rounded-full 
        z-20
        transition-all 
        duration-200
        hover:scale-110
      "
      >
        <Image
          src={game.isJoined ? "/icons/check.svg" : "/icons/adicionar.svg"}
          alt={game.isJoined ? "Adicionado" : "Adicionar"}
          width={24}
          height={24}
        />
      </div>
    </div>
  );
}
