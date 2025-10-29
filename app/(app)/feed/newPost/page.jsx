"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/app/context/AuthContext";
import { api } from "@/app/lib/api";
import Input from "@/app/components/ui/Input";

function NewPost() {
  const router = useRouter();
  const { user } = useAuth();

  const [content, setContent] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      setError("O post não pode estar vazio.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await api.posts.create({ content, type: "GENERAL" });
      router.push("/feed");
    } catch (err) {
      setError(err.message || "Falha ao criar o post.");
      setLoading(false);
    }
  };

  const profilePhotoUrl = user?.profilePhotoUrl || "/icons/user-default.png";

  return (
    <div className="bg-page min-h-screen">
      
      <main className="container mx-auto p-4 mt-8 max-w-2xl">
        <div className="relative bg-surface border border-default rounded-2xl shadow-elevated p-8 flex flex-col gap-6">
          <button
            onClick={() => router.back()}
            className="absolute top-8 right-8 text-tertiary hover:text-secondary transition-colors duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-7 h-7"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <h1 className="text-4xl font-bold text-primary text-center mt-4">
            Criar Nova Publicação
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {error && (
              <div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                role="alert"
              >
                <strong className="font-bold">Oops! </strong>
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            <div className="flex items-center gap-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-surface-muted">
                <Image
                  src={profilePhotoUrl}
                  alt="Avatar do usuário atual"
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="font-bold text-lg text-primary leading-tight">
                  {user?.name || user?.username}
                </h4>
                <p className="text-sm text-secondary">@{user?.username}</p>
              </div>
            </div>

            <Input
              type="textarea"
              placeholder="O que você tem em mente?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={loading}
              className="min-h-[120px]"
            />

            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full bg-accent hover:bg-accent-strong font-bold py-3 rounded-xl text-xl transition-colors duration-300 shadow-elevated disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "PUBLICANDO..." : "Publicar"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default function NewPostPage() {
  return <NewPost />;
}
