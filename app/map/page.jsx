"use client";

import { useEffect, useState } from "react";
import Header from "@/app/components/Header";
import { api } from "@/app/lib/api";

function MapComponent() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        const response = await api.games.getAll(); // Usar endpoint de games
        setGames(response.content || []);
      } catch (err) {
        setError(err.message || "Falha ao carregar os jogos.");
      } finally {
        setLoading(false);
      }
    };

    fetchGames();

    // Carregar a API do Google Maps dinamicamente
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`; // Substituir YOUR_API_KEY pela chave real
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
      console.log("Google Maps API carregada.");
      // Inicializar o mapa aqui, se necessário
      // Ex: new google.maps.Map(document.getElementById('map'), { center: ..., zoom: ... });
    };

    script.onerror = () => {
      console.error("Falha ao carregar a API do Google Maps.");
      setError("Falha ao carregar a API do Google Maps.");
    };

    return () => {
      document.head.removeChild(script);
    };
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
          Mapa de Jogos
        </h1>

        {loading && <p className="text-center">Carregando jogos...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && (
          <section className="flex flex-col gap-6">
            {games.length > 0 ? (
              <div
                id="map"
                className="w-full h-96 bg-gray-300 flex items-center justify-center text-gray-600"
              >
                {/* O mapa será renderizado aqui pela API do Google Maps */}
                Mapa interativo com {games.length} jogos.
              </div>
            ) : (
              <p className="text-center text-gray-500">
                Nenhum jogo encontrado para exibir no mapa.
              </p>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

export default function MapPage() {
  return <MapComponent />;
}
