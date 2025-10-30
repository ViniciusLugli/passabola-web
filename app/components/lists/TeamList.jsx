"use client";

import { useState, useEffect } from "react";
import { api } from "@/app/lib/api";
import TeamCard from "@/app/components/cards/TeamCard";
import { useAuth } from "@/app/context/AuthContext";

export default function TeamList({ query = "" }) {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { loading: authLoading, user } = useAuth();

  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(true);
      setError(null);
      if (authLoading) {
        return;
      }
      try {
        let response = await api.teams.getAll();
        let teamsData = response?.teams ?? response?.content ?? [];

        if (!response) {
          console.warn("api.teams.getAll() retornou falsy:", response);
        }
        if (
          (!teamsData || teamsData.length === 0) &&
          response &&
          response.status === 403
        ) {
          try {
            const publicResponse = await api.teams.getAll({
              options: { skipAuth: true },
            });

            teamsData =
              publicResponse?.teams ??
              publicResponse?.content ??
              publicResponse ??
              [];

            response = publicResponse;
          } catch (publicErr) {
            console.warn("Tentativa pública falhou:", publicErr);
          }
        }

        if (user && teamsData.length > 0) {
          const currentUserId = String(user.id || user.playerId);

          const myTeams = teamsData.filter((team) => {
            if (team.leader) {
              const leaderId = String(
                team.leader.id || team.leader.playerId || team.leaderId
              );
              if (leaderId === currentUserId) return true;
            }

            if (team.players && Array.isArray(team.players)) {
              const isPlayerInTeam = team.players.some((player) => {
                const playerId = String(player.id || player.playerId);
                return playerId === currentUserId;
              });
              if (isPlayerInTeam) return true;
            }

            return false;
          });

          setTeams(myTeams);
        } else {
          setTeams(teamsData);
        }
      } catch (err) {
        console.error("Erro ao buscar equipes:", err);
        if (err && err.status === 403) {
          try {
            const publicResponse = await api.teams.getAll({
              options: { skipAuth: true },
            });
            const publicTeams =
              publicResponse?.teams ??
              publicResponse?.content ??
              publicResponse ??
              [];
            setTeams(Array.isArray(publicTeams) ? publicTeams : []);
            setLoading(false);
            return;
          } catch (publicErr) {
            console.warn("Tentativa pública falhou (catch):", publicErr);
            setError(publicErr.message || "Falha ao carregar equipes.");
            setLoading(false);
            return;
          }
        }

        setError(err.message || "Falha ao carregar equipes.");
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();

    const handleTeamsChanged = () => {
      fetchTeams();
    };

    if (typeof window !== "undefined") {
      window.addEventListener("teams:changed", handleTeamsChanged);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("teams:changed", handleTeamsChanged);
      }
    };
  }, [authLoading]);

  if (loading) {
    // skeleton grid
    const skeletons = Array.from({ length: 6 });
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
        {skeletons.map((_, i) => (
          <div
            key={`sk-${i}`}
            className="p-4 rounded-xl bg-surface border border-default animate-pulse"
          >
            <div className="h-6 bg-surface-muted rounded mb-3 w-3/4"></div>
            <div className="h-4 bg-surface-muted rounded mb-2 w-full"></div>
            <div className="h-4 bg-surface-muted rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    const errMsg =
      typeof error === "string"
        ? error
        : error?.message || `${error?.status ?? ""} ${error?.statusText ?? ""}`;
    return (
      <div className="text-center py-6 sm:py-8">
        <p className="text-red-500 text-sm sm:text-base">⚠️ Erro: {errMsg}</p>
        {error?.body && (
          <pre className="text-xs text-gray-600 mt-2 overflow-x-auto p-2 bg-gray-50 rounded">
            {JSON.stringify(error.body, null, 2)}
          </pre>
        )}
      </div>
    );
  }

  // client-side filter by query
  const normalized = (s) => (s || "").toString().toLowerCase().trim();
  const filtered = query
    ? teams.filter((t) =>
        normalized(t.name ?? t.nameTeam ?? t.teamName).includes(
          normalized(query)
        )
      )
    : teams;

  if (filtered.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12">
        <p className="text-gray-500 text-sm sm:text-base mb-3">
          📋 Nenhuma equipe encontrada para "{query}".
        </p>
        {user?.userType === "PLAYER" ? (
          <Link
            href="/teams/newTeam"
            className="inline-block bg-accent text-on-brand px-4 py-2 rounded-lg font-semibold"
          >
            Criar nova equipe
          </Link>
        ) : (
          <p className="text-secondary">Tente outro termo de busca.</p>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
      {filtered.map((team) => (
        <TeamCard key={team.id} team={team} />
      ))}
    </div>
  );
}
