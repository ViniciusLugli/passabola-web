// app/feed/newPost/page.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/components/Header";
import Image from "next/image";

export default function NewPostPage() {
  const router = useRouter();
  const [postContent, setPostContent] = useState("");

  const handlePostContentChange = (e) => {
    setPostContent(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Novo post publicado:", postContent);
    // Aqui você enviaria o conteúdo do post para a sua API
    setPostContent(""); // Limpa o textarea após publicar
    router.push("/feed"); // Redireciona de volta para o feed
  };

  // Dados mock do usuário atual para exibir no card de criação
  const currentUser = {
    profilePhotoUrl: "/images/vasco-logo.png", // Substitua pelo caminho real
    name: "Vasco da Gama",
    username: "vascoDaGama",
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <main
        className="
        container 
        mx-auto 
        p-4
        mt-8
        max-w-2xl
      "
      >
        <div
          className="
          relative 
          bg-white 
          rounded-2xl 
          shadow-lg 
          p-8
          flex 
          flex-col 
          gap-6
        "
        >
          {/* Botão de Fechar */}
          <button
            onClick={() => router.back()}
            className="
              absolute 
              top-8
              right-8
              text-gray-500 
              hover:text-gray-800
              transition-colors 
              duration-200
            "
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

          <h1
            className="
            text-4xl 
            font-bold 
            text-gray-900 
            text-center 
            mt-4
          "
          >
            Criar Nova Publicação
          </h1>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-6"
          >
            <div className="flex items-center gap-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden">
                <Image
                  src={currentUser.profilePhotoUrl}
                  alt="Avatar do usuário atual"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="font-bold text-lg text-gray-900 leading-tight">
                  {currentUser.name}
                </h4>
                <p className="text-sm text-gray-500">@{currentUser.username}</p>
              </div>
            </div>

            <textarea
              className="
                w-full 
                p-3 sm:p-4 
                rounded-xl 
                border-2 
                border-gray-200 
                bg-white
                text-base sm:text-lg
                text-gray-800
                focus:outline-none 
                focus:border-purple-500
                resize-y 
                min-h-[120px]
              "
              placeholder="O que você tem em mente?"
              value={postContent}
              onChange={handlePostContentChange}
              rows={5}
            ></textarea>

            <button
              type="submit"
              className="
                mt-4
                w-full 
                bg-purple-800 
                hover:bg-purple-900 
                text-white 
                font-bold 
                py-3
                rounded-xl 
                text-xl 
                transition-colors 
                duration-300 
                shadow-lg
              "
            >
              Publicar
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}