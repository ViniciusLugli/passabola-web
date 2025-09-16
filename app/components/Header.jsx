"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, memo } from "react";
import { useAuth } from "@/app/context/AuthContext";
import TeamInviteList from "./TeamInviteList";

const iconMap = {
  Feed: "/icons/feed.svg",
  Jogos: "/icons/games.svg",
  Calendário: "/icons/calendario.svg",
  Equipes: "/icons/equipe.svg",
  Mapa: "/icons/mapa.svg",
  Perfil: "/icons/perfil.svg",
};

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showInvitesModal, setShowInvitesModal] = useState(false);
  const { user, logout } = useAuth();

  const navLinks = [
    { name: "Feed", href: "/feed" },
    { name: "Jogos", href: "/games" },
    { name: "Calendário", href: "/calendar" },
    { name: "Equipes", href: "/teams" },
    { name: "Mapa", href: "/map" },
    { name: "Perfil", href: user ? `/user/${user.profileId}` : "/login" },
  ];

  return (
    <header
      className="
      sticky 
      top-0 
      z-50 
      bg-purple-700 
      backdrop-blur-sm 
      shadow-lg 
      w-full 
      p-4 
      md:px-8
      flex 
      justify-between 
      items-center
    "
    >
      <Image
        src="/logo.svg"
        alt="Logo do Passa a Bola"
        width={40}
        height={40}
        className="
            w-10 h-10 
            rounded-full 
          "
      />

      <nav className="hidden md:flex gap-2 lg:gap-4 items-center">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className="
              flex
              flex-col
              items-center
              justify-center
              gap-1
              text-white
              hover:text-purple-400 
              transition-colors 
              duration-200 
              font-semibold
              w-20
            "
          >
            <Image
              src={iconMap[link.name]}
              alt={link.name}
              width={24}
              height={24}
              className="w-6 h-6"
            />
            <span className="text-xs">{link.name}</span>
          </Link>
        ))}
        {user?.userType === "PLAYER" && (
          <button
            onClick={() => setShowInvitesModal(true)}
            className="
              flex
              flex-col
              items-center
              justify-center
              gap-1
              text-white
              hover:text-purple-400 
              transition-colors 
              duration-200 
              font-semibold
              w-20
              bg-transparent border-none cursor-pointer
            "
          >
            <Image
              src="/icons/equipe.svg"
              alt="Convites"
              width={24}
              height={24}
              className="w-6 h-6"
            />
            <span className="text-xs">Convites</span>
          </button>
        )}
        {user && (
          <button
            onClick={logout}
            className="
              flex
              flex-col
              items-center
              justify-center
              gap-1
              text-white
              hover:text-purple-400 
              transition-colors 
              duration-200 
              font-semibold
              w-20
              bg-transparent border-none cursor-pointer
            "
          >
            <Image
              src="/icons/log-out.svg"
              alt="Sair"
              width={24}
              height={24}
              className="w-6 h-6"
            />
            <span className="text-xs">Sair</span>
          </button>
        )}
      </nav>

      {/* Menu Hamburger para mobile */}
      <button
        className="md:hidden text-white"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-8 h-8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </button>

      {isMenuOpen && (
        <div
          className="
          md:hidden
          absolute
          top-full
          left-100%
          w-50
          bg-purple-700
          shadow-lg
          p-4
        "
        >
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="
                flex
                items-center
                gap-3
                text-white
                hover:text-purple-400 
                transition-colors 
                duration-200 
                font-semibold
                p-2
                rounded-lg
              "
                onClick={() => setIsMenuOpen(false)}
              >
                <Image
                  src={iconMap[link.name]}
                  alt={link.name}
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
                <span>{link.name}</span>
              </Link>
            ))}
            {user?.userType === "PLAYER" && (
              <button
                onClick={() => {
                  setShowInvitesModal(true);
                  setIsMenuOpen(false);
                }}
                className="
                  flex
                  items-center
                  gap-3
                  text-white
                  hover:text-purple-400 
                  transition-colors 
                  duration-200 
                  font-semibold
                  p-2
                  rounded-lg
                  bg-transparent border-none cursor-pointer
                "
              >
                <Image
                  src="/icons/equipe.svg"
                  alt="Convites"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
                <span>Convites</span>
              </button>
            )}
            {user && (
              <button
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
                className="
                  flex
                  items-center
                  gap-3
                  text-white
                  hover:text-purple-400 
                  transition-colors 
                  duration-200 
                  font-semibold
                  p-2
                  rounded-lg
                  bg-transparent border-none cursor-pointer
                "
              >
                <Image
                  src="/icons/config.svg"
                  alt="Sair"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
                <span>Sair</span>
              </button>
            )}
          </nav>
        </div>
      )}

      {showInvitesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
            <button
              onClick={() => setShowInvitesModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <TeamInviteList />
          </div>
        </div>
      )}
    </header>
  );
};

export default memo(Header);
