"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthLayout from "@/app/components/layout/AuthLayout";
import Link from "next/link";

export default function RegisterPage() {
  const [selectedRole, setSelectedRole] = useState(null);
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedRole) {
      const roleParam =
        selectedRole === "Organização"
          ? "organizacao"
          : selectedRole.toLowerCase();
      router.push(`/register/info?role=${roleParam}`);
    } else {
      alert("Por favor, selecione uma opção!");
    }
  };

  const roles = ["Organização", "Jogadora", "Espectador"];

  return (
    <AuthLayout>
      <div
        className="
          bg-surface
          border
          border-default
          rounded-3xl
          p-6 sm:p-8 md:p-10 lg:p-12
          shadow-elevated
          text-center
          flex
          flex-col
          gap-6 sm:gap-8 md:gap-10
          w-full
          transition-transform duration-300 ease-in-out
        "
      >
        <h1
          className="
            text-4xl sm:text-5xl md:text-6xl 
            font-extrabold 
            text-primary 
            leading-tight
            mb-4 sm:mb-6
          "
        >
          Bem-vindo ao <span className="text-accent">Passa a Bola</span>
        </h1>

        <p
          className="
            text-lg sm:text-xl md:text-2xl 
            text-secondary 
            font-semibold 
            mb-4 sm:mb-6
          "
        >
          Quero me cadastrar como...
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-6">
          {roles.map((role) => (
            <div key={role}>
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
                  hover:scale-105 active:scale-95
                  ${
                    selectedRole === role
                      ? "border-accent bg-accent-soft text-accent-strong font-semibold"
                      : "border-default bg-surface text-primary hover:border-accent hover:bg-accent-soft hover:text-accent"
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
                  peer-checked:border-accent
                  peer-checked:bg-accent
                  peer-checked:after:content-['']
                  peer-checked:after:block
                  peer-checked:after:w-3
                  peer-checked:after:h-3
                  peer-checked:after:rounded-full
                  peer-checked:after:bg-[rgb(var(--color-accent-contrast))]
                  transition-all
                  duration-200
                "
                ></span>
                <span className="text-lg sm:text-xl">{role}</span>
              </label>
            </div>
          ))}

          <div className="mt-4 sm:mt-6">
            <button
              type="submit"
              className="
                w-full 
                bg-accent 
                hover:bg-accent-strong 
                font-bold 
                py-4 sm:py-5 
                rounded-xl 
                text-xl sm:text-2xl 
                transition-all 
                duration-300 
                shadow-elevated
                hover:scale-105 active:scale-95
              "
            >
              CONTINUAR
            </button>
          </div>
        </form>

        <div
          className="
            mt-6 sm:mt-8 md:mt-10 
            pt-6 
            border-t 
            border-default 
            flex 
            flex-col 
            items-center 
            gap-3
          "
        >
          <p className="text-lg sm:text-xl font-semibold text-secondary">
            Já tem cadastro?
          </p>
          <Link
            href="/login"
            className="
              text-accent 
              hover:text-accent-strong 
              font-bold 
              text-lg sm:text-xl
              transition-all 
              duration-200
              flex items-center gap-2
              hover:scale-105 active:scale-95
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
        </div>
      </div>
    </AuthLayout>
  );
}
