"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 },
  },
};

const decorations = [
  {
    src: "/DecoB (tatica 1).svg",
    className:
      "absolute top-[5%] left-[5%] w-24 h-24 transform rotate-[-15deg]",
  },
  {
    src: "/DecoB (tatica 2).svg",
    className:
      "absolute bottom-[8%] left-[12%] w-28 h-28 transform rotate-[30deg]",
  },
  {
    src: "/TrianguloM-BV.svg",
    className:
      "absolute top-[50%] left-[2%] w-16 h-16 transform rotate-[60deg] -translate-y-1/2",
  },
  {
    src: "/TrianguloP-BV.svg",
    className:
      "absolute top-[2%] right-[30%] w-10 h-10 transform rotate-[180deg]",
  },
  {
    src: "/Deco (linha).svg",
    className:
      "absolute top-1/2 left-1/2 w-48 h-48 transform -translate-x-1/2 -translate-y-1/2 opacity-20",
  },
  {
    src: "/DecoB (tatica 1).svg",
    className:
      "absolute bottom-[5%] right-[5%] w-16 h-16 transform rotate-[45deg]",
  },
  {
    src: "/DecoB (tatica 2).svg",
    className:
      "absolute top-[60%] right-[15%] w-20 h-20 transform rotate-[-50deg]",
  },
  {
    src: "/TrianguloM-BV.svg",
    className:
      "absolute top-[15%] right-[8%] w-20 h-20 transform rotate-[25deg]",
  },
  {
    src: "/TrianguloP-BV.svg",
    className:
      "absolute bottom-[15%] right-[25%] w-32 h-32 transform rotate-[-20deg]",
  },
];

export default function HomePage() {
  return (
    <div
      className="
        min-h-screen 
        bg-purple-700 
        relative 
        overflow-hidden 
        flex 
        flex-col 
        justify-center 
        items-center 
        p-4 sm:p-6 md:p-8 lg:p-12
      "
    >
      <div className="absolute inset-0 z-0">
        {decorations.map((deco, index) => (
          <img
            key={index}
            src={deco.src}
            alt="decoration"
            className={deco.className}
          />
        ))}
      </div>
      <main
        className="
          relative 
          z-10 
          w-full 
          max-w-4xl
          mx-auto 
          flex 
          flex-col 
          items-center 
          justify-center 
          gap-8
        "
      >
        <motion.div
          className="
            relative 
            z-10 
            w-full 
            bg-white 
            rounded-3xl 
            p-6 sm:p-8 md:p-10 lg:p-12
            shadow-2xl 
            flex 
            flex-col 
            items-center 
            text-center
          "
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="
              text-4xl 
              font-extrabold 
              leading-tight
              sm:text-5xl 
              md:text-6xl 
              lg:text-7xl
              text-gray-900
              mb-4 sm:mb-6
            "
            variants={itemVariants}
          >
            A plataforma que eleva o futebol feminino.
          </motion.h1>

          <motion.p
            className="
              text-base 
              sm:text-lg 
              md:text-xl 
              text-gray-700 
              max-w-2xl 
              leading-relaxed
              mb-6 sm:mb-8
            "
            variants={itemVariants}
          >
            Uma rede social robusta para conectar jogadoras, clubes e fãs.
            Junte-se ao Passa a Bola e ajude a fortalecer a comunidade do
            esporte que amamos.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 sm:gap-6"
            variants={itemVariants}
          >
            <Link
              href="/register"
              className="
                px-8 py-4 
                bg-purple-800 
                hover:bg-purple-900 
                text-white 
                text-lg 
                font-bold 
                rounded-full 
                transition-colors 
                duration-300
                shadow-lg
              "
            >
              Faça seu cadastro
            </Link>

            <Link
              href="/login"
              className="
                px-8 py-4 
                bg-transparent 
                border-2 
                border-purple-600 
                hover:bg-purple-600
                hover:text-white
                text-purple-600 
                text-lg 
                font-bold 
                rounded-full 
                transition-colors 
                duration-300
              "
            >
              Já sou um membro
            </Link>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
