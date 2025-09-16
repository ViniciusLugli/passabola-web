"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/components/Header";
import Input from "@/app/components/Input";
import SelectInput from "@/app/components/SelectInput";
import { api } from "@/app/lib/api";
import Alert from "@/app/components/Alert";
import { useAuth } from "@/app/context/AuthContext";

export default function NewGamePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    venue: "",
    championship: "",
    round: "",
    gameDate: "",
    gameTime: "",
    awayTeamId: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    if (!user || user.userType.toLowerCase() === "spectator") {
      setAlert({
        type: "error",
        message: "Espectadores não podem criar jogos.",
      });
      setLoading(false);
      return;
    }

    if (user.userType.toLowerCase() === "player" && !user.organizationId) {
      setAlert({
        type: "error",
        message:
          "Jogadores precisam estar associados a uma organização para criar jogos.",
      });
      setLoading(false);
      return;
    }

    console.log("Usuário logado:", user); // Adicionado para depuração
    console.log("Estado atual do formData antes da submissão:", formData);

    const fullGameDate = `${formData.gameDate}T${formData.gameTime}:00`;

    const gameData = {
      venue: formData.venue,
      championship: formData.championship,
      round: formData.round,
      gameDate: fullGameDate,
      awayTeamId: parseInt(formData.awayTeamId), // Converter para número
    };

    if (user.userType.toLowerCase() === "organization") {
      gameData.homeTeamId = user.profileId;
    } else if (user.userType.toLowerCase() === "player") {
      gameData.homeTeamId = user.organizationId;
    }

    console.log("Dados do jogo a serem enviados:", gameData);

    try {
      await api.games.create(gameData);
      setAlert({
        type: "success",
        message: "Jogo publicado com sucesso!",
      });
      router.push("/games");
    } catch (err) {
      console.error("Erro ao publicar o jogo:", err);
      setAlert({
        type: "error",
        message: err.message || "Erro ao publicar o jogo.",
      });
    } finally {
      setLoading(false);
    }
  };

  const championshipOptions = [
    { label: "Amistoso", value: "Amistoso" },
    { label: "Campeonato", value: "Campeonato" },
    { label: "Copa", value: "Copa" },
    { label: "Liga", value: "Liga" },
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
            Novo Jogo
          </h1>

          {alert && <Alert type={alert.type} message={alert.message} />}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <Input
              label="Local do Jogo"
              type="text"
              name="venue"
              value={formData.venue}
              onChange={handleInputChange}
              required
            />

            <SelectInput
              label="Campeonato"
              name="championship"
              options={championshipOptions}
              value={formData.championship}
              onChange={handleInputChange}
              required
            />

            <Input
              label="Rodada"
              type="text"
              name="round"
              value={formData.round}
              onChange={handleInputChange}
              required
            />

            <Input
              label="ID do Time Adversário"
              type="number"
              name="awayTeamId"
              value={formData.awayTeamId}
              onChange={handleInputChange}
              required
            />

            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Input
                  label="Data do Jogo"
                  type="date"
                  name="gameDate"
                  value={formData.gameDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="flex-1">
                <Input
                  label="Hora do Jogo"
                  type="time"
                  name="gameTime"
                  value={formData.gameTime}
                  onChange={handleInputChange}
                  required
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
              disabled={loading}
            >
              {loading ? "Publicando..." : "Publicar"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
