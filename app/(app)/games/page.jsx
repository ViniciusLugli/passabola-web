"use client";

import { useEffect, useState } from "react";
import GameCard from "@/app/components/cards/GameCard";
import Link from "next/link";
import { api } from "@/app/lib/api";
import { useAuth } from "@/app/context/AuthContext";

function Games() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user: loggedInUser, isAuthenticated } = useAuth();

  const fetchGames = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.games.getAll();
      let fetchedGames = response.content || [];

      if (isAuthenticated && loggedInUser) {
        const role = String(loggedInUser.userType || "").toUpperCase();
        if (role === "PLAYER" || role === "ORGANIZATION") {
          try {
            const participationsResponse =
              await api.gameParticipants.getMyParticipations({
                page: 0,
                size: 100,
              });
            const myParticipations = participationsResponse.content || [];

            // Criar um Set com os IDs dos jogos em que estou inscrito
            const joinedGameIds = new Set(
              myParticipations
                .map((p) => p.gameId || p.game?.id)
                .filter(Boolean)
            );

            // Marcar cada jogo com isJoined
            fetchedGames = fetchedGames.map((game) => {
              const isJoined = joinedGameIds.has(game.id);
              return {
                ...game,
                isJoined,
              };
            });
          } catch (participationError) {
            console.error("Erro ao buscar participações:", participationError);
            // Continua sem marcar jogos como joined
          }
        } else {
          // Usuários SPECTATOR não possuem participações via this endpoint; skip para evitar 403 no servidor
        }
      }

      setGames(fetchedGames);
    } catch (err) {
      console.error("Erro ao buscar jogos:", err);
      setError(err.message || "Falha ao carregar os jogos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchGames();
    }
  }, [isAuthenticated]);

  const handleGameUpdate = () => {
    fetchGames();
  };

  return (
    <div className="transparent min-h-screen pb-24 sm:pb-20">
      <main
        className="
        container 
        mx-auto 
        px-3 sm:px-4 md:px-6 lg:px-8
        py-4 sm:py-6 md:py-8 lg:py-12 
        max-w-7xl
      "
      >
        <div className="bg-surface border border-default rounded-2xl shadow-elevated p-4 sm:p-6 md:p-8 lg:p-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 md:mb-10">
            <h1
              className="
              text-2xl sm:text-3xl md:text-4xl lg:text-5xl
              font-extrabold 
              text-primary 
              leading-tight
              text-center sm:text-left
            "
            >
              Jogos Disponíveis
            </h1>

            <div className="mt-4 sm:mt-0">
              <div className="sm:hidden">
                <Link
                  href="/games/newGame"
                  className="block w-full text-center bg-gradient-to-br from-purple-600 to-indigo-700 text-white py-3 rounded-lg font-semibold shadow-lg"
                >
                  Criar jogo
                </Link>
              </div>
              <div className="hidden sm:block">
                <Link
                  href="/games/newGame"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-gradient-to-br from-purple-600 to-indigo-700 text-white font-semibold shadow-lg hover:from-purple-700 hover:to-indigo-800 transition-colors"
                >
                  Criar jogo
                </Link>
              </div>
            </div>
          </div>

          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mb-4"></div>
              <p className="text-center text-secondary font-medium">
                Carregando jogos...
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 text-center">
              <span className="text-4xl mb-3 block">⚠️</span>
              <p className="text-red-700 font-semibold text-lg">{error}</p>
            </div>
          )}

          {!loading && !error && (
            <section className="space-y-4 sm:space-y-5 md:space-y-6">
              {games.length > 0 ? (
                games.map((game) => (
                  <GameCard
                    key={game.id}
                    game={game}
                    onGameUpdate={handleGameUpdate}
                  />
                ))
              ) : (
                <div className="bg-surface-muted border-2 border-default rounded-xl p-8 sm:p-12 text-center">
                  <span className="text-5xl sm:text-6xl mb-4 block">🎮</span>
                  <p className="text-secondary font-semibold text-lg sm:text-xl mb-2">
                    Nenhum jogo encontrado
                  </p>
                  <p className="text-tertiary text-sm sm:text-base">
                    Seja o primeiro a criar um jogo!
                  </p>
                </div>
              )}
            </section>
          )}
        </div>
      </main>

      {/* Floating FAB removed — CTA moved to header area for accessibility and discoverability */}
    </div>
  );
}

export default function GamesPage() {
  return <Games />;
}
