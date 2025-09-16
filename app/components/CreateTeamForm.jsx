"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/app/components/Input";
import Button from "@/app/components/Button"; // Assumindo que você tem um componente Button
import { api } from "@/app/lib/api";
import { useAuth } from "@/app/context/AuthContext";

export default function CreateTeamForm() {
  const { user } = useAuth();
  const router = useRouter();
  const [teamName, setTeamName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    if (!user || user.userType !== "PLAYER") {
      setError("Apenas jogadores podem criar times.");
      setLoading(false);
      return;
    }

    try {
      await api.teams.create({ nameTeam: teamName });
      setSuccess(true);
      setTeamName("");
      // Opcional: redirecionar para a página de times ou exibir uma mensagem de sucesso
      router.push("/teams");
    } catch (err) {
      console.error("Erro ao criar time:", err);
      setError(err.message || "Falha ao criar time. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Nome do Time"
        id="teamName"
        name="teamName"
        type="text"
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
        required
        placeholder="Ex: As Poderosas FC"
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}
      {success && (
        <p className="text-green-500 text-sm">Time criado com sucesso!</p>
      )}

      <Button type="submit" disabled={loading}>
        {loading ? "Criando..." : "Criar Time"}
      </Button>
    </form>
  );
}
