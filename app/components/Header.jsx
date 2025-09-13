"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const iconMap = {
  Feed: "/icons/feed.svg",
  Jogos: "/icons/games.svg",
  Calendário: "/icons/calendario.svg",
  Equipes: "/icons/equipe.svg",
  Mapa: "/icons/mapa.svg",
  Perfil: "/icons/perfil.svg",
};

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: "Feed", href: "/feed" },
    { name: "Jogos", href: "/jogos" },
    { name: "Calendário", href: "/calendario" },
    { name: "Equipes", href: "/equipes" },
    { name: "Mapa", href: "/mapa" },
    { name: "Perfil", href: "/perfil/formiga" }, // Hardcoded for now
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
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" // Código para o icone do menu hamburger
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
          </nav>
        </div>
      )}
    </header>
  );
}
