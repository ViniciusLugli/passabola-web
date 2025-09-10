"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import AuthLayout from "../components/AuthLayout";
import Input from "../components/Input";
import Link from "next/link";

// Variantes de animação para o container do formulário
const formVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

// Variantes de animação para os itens do formulário
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login attempt with:", { email, password });
    // Lógica de autenticação aqui
  };

  return (
    <AuthLayout>
      <motion.div
        className="
          bg-white 
          rounded-3xl 
          p-6 sm:p-8 md:p-10 lg:p-12 
          shadow-2xl 
          text-center 
          flex 
          flex-col 
          gap-6 sm:gap-8 md:gap-10
          w-full
        "
        variants={formVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="
            text-4xl sm:text-5xl md:text-6xl 
            font-extrabold 
            text-gray-900 
            leading-tight
            mb-4 sm:mb-6
          "
          variants={itemVariants}
        >
          Login
        </motion.h1>

        <motion.p
          className="
            text-lg sm:text-xl md:text-2xl 
            text-gray-700 
            font-semibold 
            mt-[-10px] // Ajuste para aproximar do título
            mb-4 sm:mb-6
          "
          variants={itemVariants}
        >
          Bem-vindo de volta!
        </motion.p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-6">
          <motion.div variants={itemVariants}>
            <Input
              label="Email"
              type="email"
              placeholder="Seu email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <Input
              label="Senha"
              type="password"
              placeholder="Sua senha"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <Link
              href="#"
              className="
                text-sm sm:text-base 
                text-purple-600 
                hover:text-purple-800 
                transition-colors 
                duration-200 
                self-end
                block
                mt-[-10px] sm:mt-[-12px]
              "
            >
              Esqueceu sua senha?
            </Link>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-4 sm:mt-6">
            <button
              type="submit"
              className="
                w-full 
                bg-purple-800 
                hover:bg-purple-900 
                text-white 
                font-bold 
                py-4 sm:py-5 
                rounded-xl 
                text-xl sm:text-2xl 
                transition-colors 
                duration-300 
                shadow-lg
              "
            >
              CONTINUAR
            </button>
          </motion.div>
        </form>

        <motion.div
          variants={itemVariants}
          className="
            mt-6 sm:mt-8 md:mt-10 
            pt-6 
            border-t 
            border-gray-200 
            flex 
            flex-col 
            items-center 
            gap-3
          "
        >
          <p className="text-lg sm:text-xl font-semibold text-gray-700">
            Ainda não tem login?
          </p>
          <Link
            href="/cadastro"
            className="
              text-purple-600 
              hover:text-purple-800 
              font-bold 
              text-lg sm:text-xl
              transition-colors 
              duration-200
              flex items-center gap-2
            "
          >
            Faça seu cadastro!
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </Link>
        </motion.div>
      </motion.div>
    </AuthLayout>
  );
}
