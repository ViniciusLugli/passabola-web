"use client";

import { useEffect, useState } from "react";
import Header from "@/app/components/Header";
import Link from "next/link";
import { api } from "@/app/lib/api";
import GameCard from "@/app/components/GameCard";
import { useAuth } from "@/app/context/AuthContext";

function Calendar() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserGames = async () => {
    if (authLoading) return;

    if (!isAuthenticated || !user) {
      setError("Você precisa estar logado para ver o calendário de jogos.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const response = await api.gameParticipants.getMyParticipations({
        page: 0,
        size: 100,
      });
      let fetchedParticipations = response.content || [];

      // Extrair os IDs dos jogos das participações
      const gameIds = fetchedParticipations
        .map((p) => p.gameId)
        .filter(Boolean);

      if (gameIds.length === 0) {
        setGames([]);
        setLoading(false);
        return;
      }

      // Buscar os detalhes completos de cada jogo
      const allGamesResponse = await api.games.getAll({ page: 0, size: 1000 });
      const allGames = allGamesResponse.content || [];

      // Filtrar apenas os jogos que o usuário está inscrito
      const fetchedGames = allGames
        .filter((game) => gameIds.includes(game.id))
        .map((game) => ({
          ...game,
          isJoined: true, // No calendário, todos os jogos estão joined
        }));

      fetchedGames.sort((a, b) => new Date(a.gameDate) - new Date(b.gameDate));

      setGames(fetchedGames);
    } catch (err) {
      console.error("Erro ao carregar calendário:", err);
      setError(err.message || "Falha ao carregar os jogos inscritos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserGames();
  }, [isAuthenticated, user, authLoading]);

  return (
    <div className="transparent min-h-screen">
      <Header />
      <main
        className="
        container 
        mx-auto 
        p-4 md:p-8 lg:p-12 
        max-w-4xl
      "
      >
        <h1
          className="
          text-4xl 
          font-extrabold 
          text-gray-900 
          leading-tight
          mb-8
          text-center
        "
        >
          Calendário de Jogos
        </h1>

        {loading && <p className="text-center">Carregando jogos...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && (
          <section className="flex flex-col gap-6">
            {games.length > 0 ? (
              games.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  onGameUpdate={() => {
                    // Recarrega a lista após ação
                    fetchUserGames();
                  }}
                />
              ))
            ) : (
              <p className="text-center text-gray-500">
                Nenhum jogo encontrado no calendário.
              </p>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

export default function CalendarPage() {
  return <Calendar />;
}
