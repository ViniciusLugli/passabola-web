"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { api } from "@/app/lib/api";
import { useAuth } from "@/app/context/AuthContext";
import { useToast } from "@/app/context/ToastContext";

function PostCard({ post }) {
  const { isAuthenticated } = useAuth(); // Obter estado de autenticação
  const { showToast } = useToast();
  const [hasLiked, setHasLiked] = useState(post.isLikedByCurrentUser || false);
  const [currentLikes, setCurrentLikes] = useState(
    post.totalLikes || post.likes || 0
  );

  useEffect(() => {
    setHasLiked(post.isLikedByCurrentUser || false);
    setCurrentLikes(post.totalLikes || post.likes || 0);
  }, [post]);

  const handleLikeToggle = async () => {
    if (!isAuthenticated) {
      showToast("Você precisa estar logado para curtir posts!", "error");
      return;
    }

    try {
      if (hasLiked) {
        await api.posts.unlike(post.id);
        setCurrentLikes((prev) => prev - 1);
      } else {
        await api.posts.like(post.id);
        setCurrentLikes((prev) => prev + 1);
      }
      setHasLiked(!hasLiked);
    } catch (error) {
      console.error("Erro ao curtir/descurtir post:", error);
      showToast("Falha ao processar sua curtida. Tente novamente.", "error");
    }
  };

  return (
    <div className="bg-surface border border-default rounded-lg shadow-elevated p-4">
      <div className="flex items-center mb-4">
        <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
          <Image
            src={post.authorProfilePhotoUrl || "/icons/user-default.png"}
            alt="Avatar do autor"
            fill
            className="object-cover"
            sizes="40px"
          />
        </div>
        <div>
          <Link
            href={`/user/${post.authorType.toLowerCase()}/${post.authorId}`}
          >
            <h4 className="font-bold text-lg text-primary leading-tight hover:underline cursor-pointer">
              {post.authorUsername}{" "}
            </h4>
          </Link>
          <p className="text-secondary text-sm">
            {new Date(post.createdAt).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="text-primary mb-4 whitespace-pre-wrap break-words">
        {post.content}
      </div>

      {post.imageUrl && (
        <div className="relative w-full h-60 rounded-lg overflow-hidden mb-4">
          <Image
            src={post.imageUrl}
            alt="Imagem da publicação"
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
      )}

      <div className="flex items-center mt-4">
        <button
          onClick={handleLikeToggle}
          className="flex items-center space-x-2 text-zinc-500 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200 focus:outline-none"
        >
          <Heart
            className={`h-5 w-5 ${
              hasLiked
                ? "text-red-500 fill-red-500"
                : "text-zinc-500 dark:text-gray-300"
            }`}
            strokeWidth={2}
          />
          <span className="font-bold">{currentLikes} Curtidas</span>
        </button>
      </div>
    </div>
  );
}

export default PostCard;
