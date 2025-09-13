import Organization from "@/app/models/organization";
import Player from "@/app/models/player";
import Spectator from "@/app/models/spectator";

export const mockUsers = [
  new Organization(
    "vascoDaGama", // username (id)
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
    [], // createdGames
    "organization" // type
  ),
  new Player(
    "formiga", // username (id)
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
    [],
    "player" // type
  ),
  new Spectator(
    "sophiaM", // username (id)
    "Sophia Machado",
    "fulano@example.com",
    "password123",
    "Apenas uma espectadora.",
    "10",
    "100",
    "/media/spec-user.png", // profilePhotoUrl
    "/media/spec-banner.png", // bannerUrl
    "551188888888",
    [],
    "5",
    new Date("1990-01-01"),
    "vascoDaGama",
    "spectator" // type
  ),
];

export const mockPosts = [
  {
    id: 1,
    userId: "vascoDaGama",
    content:
      "Hoje é dia de clássico! Vamos com tudo pra cima do adversário! #VascoDaGama #FutebolFeminino",
    likes: 1200,
  },
  {
    id: 2,
    userId: "vascoDaGama",
    content:
      "Nossas meninas deram um show em campo! Mais uma vitória pra conta! 🚀",
    likes: 2500,
  },
  {
    id: 3,
    userId: "formiga",
    content: "Treino de hoje concluído com sucesso! Foco no próximo jogo!",
    likes: 5000,
  },
];