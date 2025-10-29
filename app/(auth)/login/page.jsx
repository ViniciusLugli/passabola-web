"use client";

import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import AuthLayout from "@/app/components/layout/AuthLayout";
import Input from "@/app/components/ui/Input";
import Link from "next/link";
import Alert from "@/app/components/ui/Alert";
import { ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, loginErrorMessage, clearLoginError } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearLoginError();
    setLoading(true);
    try {
      await login({ email, password });
    } catch (err) {
      setLoading(false);
    }
  };

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
          Login
        </h1>

        <p
          className="
            text-lg sm:text-xl md:text-2xl 
            text-secondary
            font-semibold 
            mt-[-10px]
            mb-4 sm:mb-6
          "
        >
          Bem-vindo de volta!
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-6">
          <Alert
            isOpen={!!loginErrorMessage}
            onClose={clearLoginError}
            message={loginErrorMessage}
            type="error"
          />
          <div>
            <Input
              label="Email"
              type="email"
              placeholder="Seu email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <Input
              label="Senha"
              type="password"
              placeholder="Sua senha"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <Link
              href="#"
              className="
                text-sm sm:text-base 
                text-accent 
                hover:text-accent-strong
                transition-all 
                duration-200 
                self-end
                block
                mt-[-10px] sm:mt-[-12px]
                hover:scale-105 active:scale-95
              "
            >
              Esqueceu sua senha?
            </Link>
          </div>

          <div className="mt-4 sm:mt-6">
            <button
              type="submit"
              disabled={loading}
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
                disabled:opacity-70
                disabled:cursor-not-allowed
              "
            >
              {loading ? "CARREGANDO..." : "CONTINUAR"}
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
            Ainda não tem login?
          </p>
          <Link
            href="/register"
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
            Faça seu cadastro!
            <ArrowRight className="h-6 w-6" strokeWidth={2} />
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
