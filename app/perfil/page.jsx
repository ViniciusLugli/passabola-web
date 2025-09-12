"use client";
import { useState } from "react";
import Header from "@/app/components/Header";
import ProfileHeader from "@/app/components/ProfileHeader";
import PostCard from "@/app/components/PostCard";
import Organization from "@/app/models/organization";
import Player from "@/app/models/player";
import Spectator from "@/app/models/spectator";

const mockOrganization = new Organization(
  "vascoDaGama", // username
  "Vasco da Gama", // name
  "contato@vasco.com.br", // email
  "password123", // password
  "Club de Regatas Vasco da Gama, clube poliesportivo brasileiro com sede na cidade do Rio de Janeiro, fundado em 21 de agosto de 1898 por um grupo de remadores.", // bio
  "5000", // followers
  "150", // following
  "/media/vasco-logo.png", // profilePhotoUrl
  "/media/vasco-banner.png", // bannerUrl
  "21999999999", // phone
  [], // posts
  "50", // subscribedGames
  "00.000.000/0000-00", // cnpj
  25, // gamesPlayed
  ["Vasco Feminino", "Vasco Sub-20 Feminino"], // teams
  [] // createdGames
);

const mockPlayer = new Player(
  "formiga",
  "Formiga",
  "formiga@example.com",
  "password123",
  "Miraildes Maciel Mota, mais conhecida como Formiga, é uma futebolista brasileira que atua como volante.",
  "1000000",
  "100",
  "/media/formiga-user.png", // profilePhotoUrl
  "/media/formiga-banner.png", // bannerUrl
  "551199999999",
  [],
  "10",
  "150",
  new Date("1978-03-03"),
  "vascoDaGama",
  ["Vasco", "Santos", "Corinthians"],
  [],
  []
);

const mockSpectator = new Spectator(
  "sophiaM",
  "Sophia Machado",
  "fulano@example.com",
  "password123",
  "Apenas um espectador.",
  "10",
  "100",
  "/media/spec-user.png", // profilePhotoUrl
  "/media/spec-banner.png", // bannerUrl
  "551188888888",
  [],
  "5",
  new Date("1990-01-01"),
  "vascoDaGama"
);

const mockPosts = [
  {
    id: 1,
    content:
      "Hoje é dia de clássico! Vamos com tudo pra cima do adversário! #VascoDaGama #FutebolFeminino",
    likes: 1200,
  },
  {
    id: 2,
    content:
      "Nossas meninas deram um show em campo! Mais uma vitória pra conta! 🚀",
    likes: 2500,
  },
];

export default function ProfilePage() {
  const [user, setUser] = useState(mockOrganization);

  const userPosts = mockPosts.map((post) => ({
    ...post,
    name: user.name,
    username: user.username,
    profilePhotoUrl: user.profilePhotoUrl,
  }));

  return (
    <div>
      <Header />
      <main
        className="
        container 
        mx-auto 
        p-4 
        md:p-8 
        lg:p-12  
        max-w-4xl
      "
      >
        <div className="flex justify-center gap-4 mb-4">
          <button
            onClick={() => setUser(mockOrganization)}
            className="bg-gray-200 px-4 py-2 rounded"
          >
            Organization
          </button>
          <button
            onClick={() => setUser(mockPlayer)}
            className="bg-gray-200 px-4 py-2 rounded"
          >
            Player
          </button>
          <button
            onClick={() => setUser(mockSpectator)}
            className="bg-gray-200 px-4 py-2 rounded"
          >
            Spectator
          </button>
        </div>
        <ProfileHeader user={user} />

        <section className="mt-8">
          <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
            Suas publicações
          </h3>
          <div className="flex flex-col gap-6">
            {userPosts.map((post) => (
              <PostCard key={`${user.username}-${post.id}`} post={post} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
