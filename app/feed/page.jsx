import Header from "@/app/components/Header";
import PostCard from "@/app/components/PostCard";
import Link from "next/link";

// Dados mock para simular posts
const mockPosts = [
  {
    id: 1,
    profilePhotoUrl: "/images/vasco-logo.png", // Substitua pelo caminho real
    name: "Vasco da Gama",
    username: "vascoDaGama",
    content:
      "Grande vitória hoje! O time mostrou muita garra e determinação em campo. #Vasco #Futebol",
    likes: 1245,
  },
  {
    id: 2,
    profilePhotoUrl: "/images/player-avatar.png", // Substitua pelo caminho real
    name: "Maria Jogadora",
    username: "maria_joga",
    content: "Treino pesado para o próximo campeonato! Foco total! 💪⚽",
    likes: 876,
  },
  {
    id: 3,
    profilePhotoUrl: "/images/organization-logo.png", // Substitua pelo caminho real
    name: "Liga Futebol Amador",
    username: "liga_amadora",
    content:
      "Inscrições abertas para a nova temporada! Monte sua equipe e venha competir! #FutebolAmador",
    likes: 321,
  },
  {
    id: 4,
    profilePhotoUrl: "/images/vasco-logo.png", // Substitua pelo caminho real
    name: "Vasco da Gama",
    username: "vascoDaGama",
    content:
      "Nosso craque marcou um golaço de bicicleta! Veja o replay e deixe seu like! 🔥",
    likes: 2100,
  },
];

export default function FeedPage() {
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
          Feed
        </h1>

        <section className="flex flex-col gap-6">
          {mockPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </section>
      </main>

      {/* Botão de "Novo Post" no canto inferior direito (FAB) */}
      <Link
        href="/feed/newPost"
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
