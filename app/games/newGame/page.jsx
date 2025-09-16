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
    gameType: "", // Novo campo para selecionar o tipo de jogo
    gameName: "", // Novo campo para nome do jogo (Friendly/Championship)
    venue: "",
    championship: "", // Este campo será usado para o nome do campeonato em CHAMPIONSHIP/CUP
    round: "",
    gameDate: "",
    gameTime: "",
    homeTeamId: "", // Adicionado para jogos CUP
    awayTeamId: "",
    description: "", // Adicionado para Friendly/Championship
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

    if (!user) {
      setAlert({ type: "error", message: "Usuário não autenticado." });
      setLoading(false);
      return;
    }

    const {
      gameType,
      gameName,
      venue,
      championship,
      round,
      gameDate,
      gameTime,
      homeTeamId,
      awayTeamId,
      description,
    } = formData;
    const fullGameDate = `${gameDate}T${gameTime}:00`;

    let gamePayload = {};
    let apiCall;

    switch (gameType) {
      case "FRIENDLY":
        if (user.userType.toLowerCase() !== "player") {
          setAlert({
            type: "error",
            message: "Apenas jogadores podem criar jogos amistosos.",
          });
          setLoading(false);
          return;
        }
        gamePayload = {
          gameName,
          venue,
          gameDate: fullGameDate,
          description,
          hostId: user.userId,
          hostUsername: user.username,
        };
        apiCall = api.games.createFriendly;
        break;
      case "CHAMPIONSHIP":
        if (user.userType.toLowerCase() !== "player") {
          setAlert({
            type: "error",
            message: "Apenas jogadores podem criar jogos de campeonato.",
          });
          setLoading(false);
          return;
        }
        gamePayload = {
          gameName,
          venue,
          gameDate: fullGameDate,
          description,
          hostId: user.userId,
          hostUsername: user.username,
        };
        apiCall = api.games.createChampionship;
        break;
      case "CUP":
        if (user.userType.toLowerCase() !== "organization") {
          setAlert({
            type: "error",
            message: "Apenas organizações podem criar jogos de copa.",
          });
          setLoading(false);
          return;
        }
        gamePayload = {
          homeTeamId: parseInt(homeTeamId),
          awayTeamId: parseInt(awayTeamId),
          gameDate: fullGameDate,
          venue,
          championship,
          round,
        };
        apiCall = api.games.createCup;
        break;
      default:
        setAlert({
          type: "error",
          message: "Selecione um tipo de jogo válido.",
        });
        setLoading(false);
        return;
    }

    console.log("Usuário logado:", user);
    console.log("Dados do jogo a serem enviados:", gamePayload);

    try {
      await apiCall(gamePayload);
      setAlert({ type: "success", message: "Jogo publicado com sucesso!" });
      router.push("/games");
    } catch (err) {
      console.error("Erro ao publicar o jogo:", err);
      console.error("Detalhes do erro:", err.details); // Adicionado para depuração
      setAlert({
        type: "error",
        message: err.message || "Erro ao publicar o jogo.",
      });
    } finally {
      setLoading(false);
    }
  };

  const gameTypeOptions = [
    { label: "Amistoso", value: "FRIENDLY" },
    { label: "Campeonato", value: "CHAMPIONSHIP" },
    { label: "Copa", value: "CUP" },
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
            <SelectInput
              label="Tipo de Jogo"
              name="gameType"
              options={gameTypeOptions}
              value={formData.gameType}
              onChange={handleInputChange}
              required
            />

            {formData.gameType === "FRIENDLY" ||
            formData.gameType === "CHAMPIONSHIP" ? (
              <>
                <Input
                  label="Nome do Jogo"
                  type="text"
                  name="gameName"
                  value={formData.gameName}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Local do Jogo"
                  type="text"
                  name="venue"
                  value={formData.venue}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Descrição"
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </>
            ) : null}

            {formData.gameType === "CUP" ? (
              <>
                <Input
                  label="Local do Jogo"
                  type="text"
                  name="venue"
                  value={formData.venue}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Campeonato"
                  type="text"
                  name="championship"
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
                  label="ID do Time da Casa"
                  type="number"
                  name="homeTeamId"
                  value={formData.homeTeamId}
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
              </>
            ) : null}

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
