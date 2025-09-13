"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/components/Header";
import Input from "@/app/components/Input";
import SelectInput from "@/app/components/SelectInput";

export default function NewGamePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    address: "",
    gameType: "",
    date: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Novo jogo publicado:", formData);
  };

  const gameTypeOptions = [
    { label: "Amistoso", value: "Amistoso" },
    { label: "Campeonato", value: "Campeonato" },
  ];

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
            Jogos
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <Input
              label="Título"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
            />
            <Input
              label="Endereço"
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
            />

            <div className="flex items-center gap-4">
              <div className="flex-1">
                <SelectInput
                  label="Tipo de Jogo"
                  options={gameTypeOptions}
                  value={formData.gameType}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex-1">
                <Input
                  label="Data"
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                />
              </div>
            </div>

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
