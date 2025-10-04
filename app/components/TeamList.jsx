"use client";

import { useState, useEffect } from "react";
import { api } from "@/app/lib/api";
import TeamCard from "@/app/components/TeamCard";
import { useAuth } from "@/app/context/AuthContext";

export default function TeamList() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { loading: authLoading } = useAuth();

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
        // Se a resposta está vazia e possivelmente foi um 403 com body vazio,
        // tentamos novamente sem enviar o Authorization (recurso público)
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
        setTeams(teamsData);
      } catch (err) {
        console.error("Erro ao buscar equipes:", err);
        // Se o backend retornou 403 ao usar o token/sem auth, tentamos fetch público
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
      // refetch when other parts of the app signal teams changed
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
    return <p>Carregando equipes...</p>;
  }

  if (error) {
    // error pode ser string ou objeto com status/message/body
    const errMsg =
      typeof error === "string"
        ? error
        : error?.message || `${error?.status ?? ""} ${error?.statusText ?? ""}`;
    return (
      <div>
        <p className="text-red-500">Erro: {errMsg}</p>
        {error?.body && (
          <pre className="text-xs text-gray-600 mt-2">
            {JSON.stringify(error.body, null, 2)}
          </pre>
        )}
      </div>
    );
  }

  if (teams.length === 0) {
    return <p>Nenhuma equipe encontrada.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {teams.map((team) => (
        <TeamCard key={team.id} team={team} />
      ))}
    </div>
  );
}
