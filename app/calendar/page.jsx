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

  useEffect(() => {
    const fetchUserGames = async () => {
      if (authLoading) return; // Espera o carregamento do usuário

      if (!isAuthenticated || !user) {
        setError("Você precisa estar logado para ver o calendário de jogos.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        let response;
        // A API não tem um endpoint direto para "meus jogos" ou jogos por usuário logado.
        // A abordagem mais próxima é buscar jogos por organização se o usuário for ORGANIZATION ou PLAYER
        // e depois filtrar ou buscar jogos que o usuário se inscreveu.
        // Por enquanto, vamos buscar todos os jogos e filtrar no frontend.
        // Idealmente, a API teria um endpoint como /api/users/{userId}/games ou /api/games/my-games
        response = await api.games.getAll();
        let fetchedGames = response.content || [];

        // Filtrar jogos para mostrar apenas os que o usuário logado tem relação
        // (Exemplo: se o usuário é uma organização, mostrar jogos da sua organização)
        // Esta lógica pode precisar ser mais complexa dependendo de como a API associa usuários a jogos.
        // Por simplicidade, vamos assumir que o `homeTeamId` ou `awayTeamId` pode ser o `organizationId` do usuário.
        // Ou, se o usuário for um PLAYER, ele pode estar associado a um time que é `homeTeamId` ou `awayTeamId`.
        // Como a API não tem um endpoint direto para isso, vamos buscar todos e ordenar.
        // Para uma implementação mais precisa, precisaríamos de um endpoint na API que retorne jogos por usuário/time.

        // Ordenar os jogos por data, do mais próximo para o mais distante
        fetchedGames.sort(
          (a, b) => new Date(a.gameDate) - new Date(b.gameDate)
        );

        setGames(fetchedGames);
      } catch (err) {
        setError(err.message || "Falha ao carregar os jogos.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserGames();
  }, [isAuthenticated, user, authLoading]);

  return (
    <div className="bg-gray-100 min-h-screen">
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
              games.map((game) => <GameCard key={game.id} game={game} />)
            ) : (
              <p className="text-center text-gray-500">
                Nenhum jogo encontrado no calendário.
              </p>
            )}
          </section>
        )}
      </main>

      {/* Botão para adicionar novo jogo */}
      <Link
        href="/games/newGame"
        className="
        fixed 
        bottom-6 
        right-6 
        p-4 
        rounded-full 
        bg-purple-600 
        text-white 
        shadow-lg
        hover:bg-purple-700
        transition-colors
        duration-200
        z-40
      "
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-8 h-8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
      </Link>
    </div>
  );
}

export default function CalendarPage() {
  return <Calendar />;
}
