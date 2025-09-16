import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/app/context/AuthContext";
import { useState } from "react";

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems = [
    { name: "Feed", href: "/feed" },
    { name: "Jogos", href: "/games" },
    { name: "Calendário", href: "/calendar" },
    { name: "Equipes", href: "/teams" },
    { name: "Mapa", href: "/map" },
    {
      name: "Perfil",
      href: user ? `/user/${user.userType.toLowerCase()}/${user.id}` : "/login",
    },
  ];

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" passHref>
          <div className="flex items-center cursor-pointer">
            <Image
              src="/logo.svg"
              alt="Passa Bola Logo"
              width={40}
              height={40}
              priority
            />
            <span className="ml-2 text-xl font-bold text-gray-800">
              Passa Bola
            </span>
          </div>
        </Link>

        {/* Menu para desktop */}
        <div className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link key={item.name} href={item.href} passHref>
              <span className="text-gray-600 hover:text-indigo-600 transition-colors cursor-pointer">
                {item.name}
              </span>
            </Link>
          ))}
          {isAuthenticated ? (
            <button
              onClick={logout}
              className="flex items-center text-red-500 hover:text-red-700 transition-colors"
            >
              <Image
                src="/icons/log-out.svg"
                alt="Sair"
                width={20}
                height={20}
                className="mr-1"
              />
              Sair
            </button>
          ) : (
            <Link href="/login" passHref>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
                Entrar
              </button>
            </Link>
          )}
        </div>

        {/* Botão de menu para mobile */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-gray-600">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
        </div>
      </nav>

      {/* Menu mobile dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg py-2">
          {navItems.map((item) => (
            <Link key={item.name} href={item.href} passHref>
              <span
                onClick={toggleMenu}
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
              >
                {item.name}
              </span>
            </Link>
          ))}
          {isAuthenticated ? (
            <button
              onClick={() => {
                logout();
                toggleMenu();
              }}
              className="flex items-center px-4 py-2 text-red-500 hover:bg-gray-100 w-full text-left"
            >
              <Image
                src="/icons/log-out.svg"
                alt="Sair"
                width={20}
                height={20}
                className="mr-1"
              />
              Sair
            </button>
          ) : (
            <Link href="/login" passHref>
              <span
                onClick={toggleMenu}
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
              >
                Entrar
              </span>
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
