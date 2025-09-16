"use client";

import { useEffect, useState } from "react";
import Header from "@/app/components/Header";
import Link from "next/link";
import { api } from "@/app/lib/api";
import TeamCard from "@/app/components/TeamCard";

function Teams() {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        setLoading(true);
        const response = await api.organizations.getAll();
        setOrganizations(response.content || []);
      } catch (err) {
        setError(err.message || "Falha ao carregar as organizações.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizations();
  }, []);

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
          Organizações
        </h1>

        {loading && <p className="text-center">Carregando organizações...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && (
          <section className="flex flex-col gap-6">
            {organizations.length > 0 ? (
              organizations.map((organization) => (
                <TeamCard key={organization.id} team={organization} />
              ))
            ) : (
              <p className="text-center text-gray-500">
                Nenhuma organização encontrada.
              </p>
            )}
          </section>
        )}
      </main>

      {/* Botão para adicionar nova organização, se aplicável */}
      <Link
        href="/register/info"
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

export default function TeamsPage() {
  return <Teams />;
}
