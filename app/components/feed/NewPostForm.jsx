"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/app/context/AuthContext";
import { api } from "@/app/lib/api";
import Input from "@/app/components/ui/Input";
import Button from "@/app/components/ui/Button";

export default function NewPostForm({ onSuccess }) {
  const router = useRouter();
  const { user } = useAuth();

  const [content, setContent] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e && e.preventDefault();
    if (!content.trim()) {
      setError("O post não pode estar vazio.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const created = await api.posts.create({ content, type: "GENERAL" });
      if (onSuccess) onSuccess(created);
      else router.push("/feed");
    } catch (err) {
      setError(err.message || "Falha ao criar o post.");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const profilePhotoUrl = user?.profilePhotoUrl || "/icons/user-default.png";

  return (
    <div className="relative bg-surface border border-default rounded-2xl shadow-elevated p-6 w-full">
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
          autoFocus
        />

        <Button
          type="submit"
          loading={loading}
          ariaLabel="Publicar"
          variant="primary"
        >
          {loading ? "PUBLICANDO..." : "Publicar"}
        </Button>
      </form>
    </div>
  );
}
