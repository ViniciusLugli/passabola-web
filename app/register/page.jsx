"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import AuthLayout from "@/app/components/AuthLayout";
import Link from "next/link";

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

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export default function RegisterPage() {
  const [selectedRole, setSelectedRole] = useState(null);
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedRole) {
      router.push(`/register/info?role=${selectedRole.toLowerCase()}`);
    } else {
      alert("Por favor, selecione uma opção!");
    }
  };

  const roles = ["Organização", "Jogadora", "Espectador"];

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
          Bem-vindo ao <span className="text-purple-700">Passa a Bola</span>
        </motion.h1>

        <motion.p
          className="
            text-lg sm:text-xl md:text-2xl 
            text-gray-700 
            font-semibold 
            mb-4 sm:mb-6
          "
          variants={itemVariants}
        >
          Quero me cadastrar como...
        </motion.p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-6">
          {roles.map((role) => (
            <motion.div key={role} variants={itemVariants}>
              <label
                className={`
                  flex 
                  items-center 
                  justify-center 
                  p-4 sm:p-5 
                  rounded-xl 
                  border-2 
                  cursor-pointer 
                  transition-all 
                  duration-200 
                  shadow-sm
                  ${
                    selectedRole === role
                      ? "border-purple-600 bg-purple-50 text-purple-800 font-semibold"
                      : "border-gray-200 bg-white text-gray-800 hover:border-purple-300 hover:bg-purple-10"
                  }
                `}
              >
                <input
                  type="radio"
                  name="userRole"
                  value={role}
                  checked={selectedRole === role}
                  onChange={() => setSelectedRole(role)}
                  className="
                    hidden 
                    peer
                  "
                />
                <span
                  className="
                  relative 
                  flex 
                  items-center 
                  justify-center 
                  w-6 h-6 
                  border-2 
                  rounded-full 
                  mr-3
                  peer-checked:border-purple-600
                  peer-checked:bg-purple-600
                  peer-checked:after:content-['']
                  peer-checked:after:block
                  peer-checked:after:w-3
                  peer-checked:after:h-3
                  peer-checked:after:rounded-full
                  peer-checked:after:bg-white
                  transition-all
                  duration-200
                "
                ></span>
                <span className="text-lg sm:text-xl">{role}</span>
              </label>
            </motion.div>
          ))}

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
            Já tem cadastro?
          </p>
          <Link
            href="/login"
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
            Faça seu login!
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
