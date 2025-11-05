"use client";

import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import {
  Users,
  Trophy,
  MessageCircle,
  BarChart3,
  Calendar,
  Instagram,
  Twitter,
  Facebook,
  ChevronDown,
} from "lucide-react";

// Import dinâmico do ThemeToggle para evitar SSR
const ThemeToggle = dynamic(() => import("@/app/components/ui/ThemeToggle"), {
  ssr: false,
  loading: () => (
    <div className="w-10 h-10 rounded-full bg-surface-muted shadow-elevated animate-pulse" />
  ),
});

const decorations = [
  {
    src: "/DecoB-tatica-1.svg",
    className:
      "absolute top-[5%] left-[5%] w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 transform rotate-[-15deg]",
    width: 96,
    height: 96,
  },
  {
    src: "/DecoB-tatica-2.svg",
    className:
      "absolute bottom-[8%] left-[12%] w-20 sm:w-24 md:w-28 h-20 sm:h-24 md:h-28 transform rotate-[30deg]",
    width: 112,
    height: 112,
  },
  {
    src: "/TrianguloM-BV.svg",
    className:
      "absolute top-[50%] left-[2%] w-12 sm:w-14 md:w-16 h-12 sm:h-14 md:h-16 transform rotate-[60deg] -translate-y-1/2",
    width: 64,
    height: 64,
  },
  {
    src: "/TrianguloP-BV.svg",
    className:
      "absolute top-[2%] right-[30%] w-8 sm:w-9 md:w-10 h-8 sm:h-9 md:h-10 transform rotate-[180deg]",
    width: 40,
    height: 40,
  },
  {
    src: "/Deco-linha.svg",
    className:
      "absolute top-1/2 left-1/2 w-32 sm:w-40 md:w-48 h-32 sm:h-40 md:h-48 transform -translate-x-1/2 -translate-y-1/2 opacity-20",
    width: 192,
    height: 192,
  },
  {
    src: "/DecoB-tatica-1.svg",
    className:
      "absolute bottom-[5%] right-[5%] w-12 sm:w-14 md:w-16 h-12 sm:h-14 md:h-16 transform rotate-[45deg]",
    width: 64,
    height: 64,
  },
  {
    src: "/DecoB-tatica-2.svg",
    className:
      "absolute top-[60%] right-[15%] w-16 sm:w-18 md:w-20 h-16 sm:h-18 md:h-20 transform rotate-[-50deg]",
    width: 80,
    height: 80,
  },
  {
    src: "/TrianguloM-BV.svg",
    className:
      "absolute top-[15%] right-[8%] w-16 sm:w-18 md:w-20 h-16 sm:h-18 md:h-20 transform rotate-[25deg]",
    width: 80,
    height: 80,
  },
  {
    src: "/TrianguloP-BV.svg",
    className:
      "absolute bottom-[15%] right-[25%] w-24 sm:w-28 md:w-32 h-24 sm:h-28 md:h-32 transform rotate-[-20deg]",
    width: 128,
    height: 128,
  },
];

const features = [
  {
    icon: Users,
    title: "Feed Social",
    description:
      "Conecte-se com jogadoras de todo o Brasil e compartilhe sua paixão pelo futebol. Construa sua rede e inspire outras atletas.",
  },
  {
    icon: Trophy,
    title: "Jogos e Times",
    description:
      "Organize partidas, crie times e participe de torneios na sua região. Encontre companheiras de equipe e adversárias do seu nível.",
  },
  {
    icon: MessageCircle,
    title: "Chat em Tempo Real",
    description:
      "Converse com outras atletas e organize jogos rapidamente. Comunicação instantânea para marcar aquela partida do fim de semana.",
  },
  {
    icon: BarChart3,
    title: "Rankings e Estatísticas",
    description:
      "Acompanhe seu desempenho e veja rankings das melhores jogadoras. Evolua seu jogo com dados e conquiste seu lugar no pódio.",
  },
];

const stats = [
  {
    icon: Users,
    value: "500+",
    label: "Jogadoras",
  },
  {
    icon: Users,
    value: "100+",
    label: "Times",
  },
  {
    icon: Trophy,
    value: "200+",
    label: "Jogos Organizados",
  },
];

const footerLinks = [
  { label: "Sobre", href: "#" },
  { label: "Contato", href: "#" },
  { label: "Privacidade", href: "#" },
  { label: "Termos", href: "#" },
];

const socialLinks = [
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Twitter, label: "Twitter", href: "#" },
  { icon: Facebook, label: "Facebook", href: "#" },
];

export default function HomePage() {
  const scrollToFeatures = (e) => {
    e.preventDefault();
    const featuresSection = document.getElementById("features");
    if (featuresSection) {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      featuresSection.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });
    }
  };

  return (
    <div className="min-h-screen bg-page">
      {/* Skip Navigation */}
      <a
        href="#main-content"
        className="
          sr-only
          focus:not-sr-only
          focus:absolute
          focus:top-4
          focus:left-4
          focus:z-50
          focus:px-4
          focus:py-2
          focus:bg-accent
          focus:text-on-brand
          focus:rounded-lg
          focus:shadow-elevated
          focus:outline-none
          focus:ring-4
          focus:ring-accent/50
        "
      >
        Pular para o conteúdo principal
      </a>
      {/* Hero Section */}
      <section
        className="
          min-h-screen
          bg-brand-gradient
          text-on-brand
          relative
          overflow-hidden
          flex
          flex-col
          justify-center
          items-center
          p-4 sm:p-6 md:p-8 lg:p-12
        "
      >
        {/* Theme Toggle - Top Left */}
        <div className="absolute top-6 left-6 z-20">
          <ThemeToggle />
        </div>

        {/* Decorative Background Elements */}
        <div className="absolute inset-0 z-0">
          {decorations.map((deco, index) => (
            <Image
              key={index}
              src={deco.src}
              alt=""
              className={deco.className}
              width={deco.width}
              height={deco.height}
              priority={index < 3}
              loading={index < 3 ? undefined : "lazy"}
              aria-hidden="true"
            />
          ))}
        </div>

        {/* Hero Content */}
        <main
          id="main-content"
          className="
            relative
            z-10
            w-full
            max-w-4xl
            mx-auto
            flex
            flex-col
            items-center
            justify-center
            gap-8
          "
        >
          <div
            className="
              relative
              z-10
              w-full
              bg-surface
              border
              border-default
              rounded-3xl
              p-6 sm:p-8 md:p-10 lg:p-12
              shadow-elevated
              flex
              flex-col
              items-center
              text-center
              transition-transform duration-300 ease-in-out
            "
          >
            <h1
              className="
                text-3xl
                font-extrabold
                leading-tight
                sm:text-4xl
                md:text-5xl
                lg:text-6xl
                xl:text-7xl
                text-primary
                mb-4 sm:mb-6
              "
            >
              A plataforma que eleva o futebol feminino.
            </h1>

            <p
              className="
                text-base
                sm:text-lg
                md:text-xl
                text-secondary
                max-w-2xl
                leading-relaxed
                mb-6 sm:mb-8
              "
            >
              Uma rede social robusta para conectar jogadoras, clubes e fãs.
              Junte-se ao Passa a Bola e ajude a fortalecer a comunidade do
              esporte que amamos.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto">
              <Link
                href="/register"
                className="
                  px-8 py-4
                  bg-accent
                  hover:bg-accent-strong
                  text-lg
                  font-bold
                  rounded-full
                  transition-all
                  duration-300
                  shadow-elevated
                  hover:scale-105 active:scale-95
                  focus:outline-none focus:ring-4 focus:ring-accent/50
                  text-center
                "
                aria-label="Criar uma nova conta no PassaBola"
              >
                Começar Agora
              </Link>

              <button
                onClick={scrollToFeatures}
                className="
                  px-8
                  py-4
                  bg-transparent
                  border-2
                  border-on-brand
                  text-on-brand
                  hover:bg-on-brand/10
                  hover:border-on-brand
                  text-lg
                  font-bold
                  rounded-full
                  transition-all
                  duration-300
                  hover:scale-105 active:scale-95
                  focus:outline-none focus:ring-4 focus:ring-on-brand/50
                  flex items-center justify-center gap-2
                "
                aria-label="Rolar para a seção de recursos"
              >
                Saber Mais
                <ChevronDown className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </main>

        {/* Scroll Indicator */}
        <button
          onClick={scrollToFeatures}
          className="
            absolute
            bottom-8
            left-1/2
            -translate-x-1/2
            animate-bounce
            text-on-brand/70
            hover:text-on-brand
            transition-colors
            focus:outline-none focus:ring-4 focus:ring-accent/50 rounded-full p-2
          "
          aria-label="Rolar para baixo para ver recursos"
        >
          <ChevronDown className="w-8 h-8" aria-hidden="true" />
        </button>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-page"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-4">
              Tudo que você precisa em um só lugar
            </h2>
            <p className="text-lg sm:text-xl text-secondary max-w-3xl mx-auto">
              Uma plataforma completa para elevar sua carreira no futebol
              feminino
            </p>
          </div>

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              lg:grid-cols-4
              gap-6
              lg:gap-8
            "
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="
                    bg-surface
                    border
                    border-default
                    rounded-xl
                    p-6
                    shadow-md
                    hover:shadow-lg
                    transition-all
                    duration-300
                    hover:-translate-y-1
                  "
                >
                  <div
                    className="
                      w-12
                      h-12
                      bg-accent-soft
                      rounded-lg
                      flex
                      items-center
                      justify-center
                      mb-4
                    "
                  >
                    <Icon className="w-6 h-6 text-accent" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-semibold text-primary mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-secondary leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-accent-soft">
        <div className="max-w-7xl mx-auto">
          {/* Partnership */}
          <div className="text-center mb-12">
            <p className="text-lg sm:text-xl text-accent font-semibold mb-2">
              Em parceria com
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-primary">
              FIAP e Passa a Bola
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-4">
                    <div
                      className="
                        w-16
                        h-16
                        bg-accent
                        rounded-full
                        flex
                        items-center
                        justify-center
                      "
                    >
                      <Icon
                        className="w-8 h-8 text-accent-contrast"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                  <p className="text-4xl sm:text-5xl font-bold text-accent mb-2">
                    {stat.value}
                  </p>
                  <p className="text-lg sm:text-xl text-primary font-medium">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <Link
              href="/register"
              className="
                inline-block
                px-8
                py-4
                bg-accent
                hover:bg-accent-strong
                text-lg
                font-bold
                rounded-full
                transition-all
                duration-300
                shadow-elevated
                hover:scale-105
                active:scale-95
                focus:outline-none
                focus:ring-4
                focus:ring-accent/50
                text-accent-contrast
              "
              aria-label="Juntar-se ao PassaBola"
            >
              Junte-se a nós
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-elevated border-t border-default py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="text-2xl font-bold text-accent mb-2">
                PassaBola
              </div>
              <p className="text-secondary text-sm">
                Elevando o futebol feminino no Brasil
              </p>
            </div>

            {/* Navigation Links */}
            <nav aria-label="Links do rodapé">
              <h4 className="text-lg font-semibold text-primary mb-4">
                Navegação
              </h4>
              <ul className="space-y-2">
                {footerLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="
                        py-2
                        inline-block
                        text-secondary
                        hover:text-accent
                        transition-colors
                        focus:outline-none
                        focus:underline
                      "
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Social Media */}
            <div>
              <h4 className="text-lg font-semibold text-primary mb-4">
                Redes Sociais
              </h4>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.href}
                      aria-label={social.label}
                      className="
                        w-12
                        h-12
                        min-w-[48px]
                        min-h-[48px]
                        bg-accent-soft
                        rounded-full
                        flex
                        items-center
                        justify-center
                        hover:bg-accent
                        hover:scale-110
                        transition-all
                        duration-200
                        focus:outline-none
                        focus:ring-4
                        focus:ring-accent/50
                      "
                    >
                      <Icon
                        className="w-6 h-6 text-accent hover:text-accent-contrast"
                        aria-hidden="true"
                      />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div
            className="
              border-t
              border-default
              pt-8
              flex
              flex-col
              sm:flex-row
              justify-between
              items-center
              gap-4
              text-sm
              text-tertiary
            "
          >
            <p>
              © {new Date().getFullYear()} PassaBola. Todos os direitos
              reservados.
            </p>
            <p>Uma iniciativa FIAP em parceria com Passa a Bola</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
