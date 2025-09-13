import Header from "@/app/components/Header";
import GameCard from "@/app/components/GameCard";
import SearchBar from "@/app/components/SearchBar";
import Image from "next/image";
import Link from "next/link";

const mockGames = [
  {
    id: 1,
    name: "Nome do Jogo 1",
    address: "Endereço do jogo",
    date: "14/09/2025",
    organizer: "Nome organizador",
    type: "Campeonato",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis blandit arcu nec ligula aliquet tristique. Cras facilisis libero enim, nec vestibulum ipsum vestibulum a. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Suspendisse pharetra sapien nisl, eget cursus massa consectetur non. Integer scelerisque sagittis posuere. Ut vitae ullamcorper dui, id pulvinar sem. Ut ac aliquet mi. Morbi elementum urna eget tempus ornare.",
  },
  {
    id: 2,
    name: "Nome do Jogo 2",
    address: "Endereço do jogo",
    date: "15/09/2025",
    organizer: "Nome organizador",
    type: "Amistoso",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis blandit arcu nec ligula aliquet tristique. Cras facilisis libero enim, nec vestibulum ipsum vestibulum a. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Suspendisse pharetra sapien nisl, eget cursus massa consectetur non. Integer scelerisque sagittis posuere. Ut vitae ullamcorper dui, id pulvinar sem. Ut ac aliquet mi. Morbi elementum urna eget tempus ornare.",
  },
  {
    id: 3,
    name: "Nome do Jogo 3",
    address: "Endereço do jogo",
    date: "16/09/2025",
    organizer: "Nome organizador",
    type: "Campeonato",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis blandit arcu nec ligula aliquet tristique. Cras facilisis libero enim, nec vestibulum ipsum vestibulum a. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Suspendisse pharetra sapien nisl, eget cursus massa consectetur non. Integer scelerisque sagittis posuere. Ut vitae ullamcorper dui, id pulvinar sem. Ut ac aliquet mi. Morbi elementum urna eget tempus ornare.",
  },
];

export default function GamesPage() {
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
          Jogos
        </h1>

        {/* Barra de pesquisa e filtro */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-grow">
            <SearchBar />
          </div>
          <Link href="/games/newGame">
            <div className="flex items-center">
              <Image
                src="/icons/adicionar.svg"
                alt="criar jogo"
                width={48}
                height={48}
                className="cursor-pointer hover:opacity-80 transition-opacity"
              />
            </div>
          </Link>
        </div>

        {/* Lista de jogos */}
        <div className="flex flex-col gap-6">
          {mockGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </main>
    </div>
  );
}
