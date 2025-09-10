"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: "Feed", href: "#" },
    { name: "Jogos", href: "#" },
    { name: "Calendário", href: "#" },
    { name: "Equipes", href: "#" },
    { name: "Mapa", href: "#" },
    { name: "Perfil", href: "#" },
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

      <nav className="hidden md:flex gap-6 lg:gap-8 items-center">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className="
              text-white
              hover:text-purple-400 
              transition-colors 
              duration-200 
              font-semibold
            "
          >
            {link.name}
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
          left-0
          w-full
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
                text-white
                hover:text-purple-400 
                transition-colors 
                duration-200 
                font-semibold
              "
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
