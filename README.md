# Passa a Bola - A Rede Social do Futebol Feminino

<p align="center">
  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8B5pQmu3WV6NFowHTtz5h9dKaCCBVJoRAeA&s" alt="Logo do Passa a Bola" width="150">
</p>

## ⚽ Visão Geral do Projeto

Este é um projeto de destaque desenvolvido em colaboração da **FIAP**, como parte do **Desafio de Inovação Tecnológica: Passa a Bola - Tecnologia & Futebol Feminino**. A nossa solução é uma plataforma web que tem como objetivo transformar a maneira como o futebol feminino é vivenciado no ambiente digital.

Em parceria estratégica com o **Passa a Bola**, o principal canal dedicado aos esportes femininos na América Latina, a plataforma busca dar mais visibilidade às atletas e fortalecer a comunidade.

**⚠️ Este projeto ainda está em desenvolvimento. ⚠️**

### Problema e Oportunidade

Apesar do crescimento visível do futebol feminino, a modalidade ainda enfrenta desafios digitais, como a falta de plataformas dedicadas e ferramentas de engajamento que limitam seu potencial. Nossa solução aproveita a tecnologia para preencher essa lacuna, criando uma ponte digital para amplificar as vozes e talentos das atletas brasileiras.

### Propósito da Solução

A plataforma funciona como uma rede social robusta para:

- **Promover Visibilidade**: Permitir que jogadoras se destaquem, construam seus perfis e sejam reconhecidas.
- **Fortalecer a Comunidade**: Conectar jogadoras, clubes, fãs e organizações, gerando engajamento autêntico e apoiando o protagonismo feminino no esporte.
- **Organizar Eventos**: Oferecer ferramentas para a criação e participação em jogos e campeonatos, potencializando a experiência do esporte.
- **Comunicação em Tempo Real**: Sistema de notificações e chat privado para facilitar a interação entre usuários.
- **Gestão de Equipes**: Criação e gerenciamento de equipes com sistema de convites.

## ✨ Tecnologias e Ferramentas

Este projeto foi construído utilizando tecnologias web modernas para criar uma aplicação web responsiva e de alta performance.

- **Framework**: [**Next.js 15**](https://nextjs.org/) - O framework React para produção.
- **Biblioteca UI**: [**React 19**](https://reactjs.org/) - Para construir interfaces de usuário.
- **Estilização**: [**Tailwind CSS 4**](https://tailwindcss.com/) - Um framework CSS utility-first.
- **WebSocket**: [**@stomp/stompjs**](https://stomp-js.github.io/) - Para comunicação em tempo real.
- **Gerenciamento de Estado**: **React Context API** - Para estado global da aplicação.

## 🚀 Como Executar o Projeto

Para rodar a aplicação em seu ambiente de desenvolvimento, siga os passos abaixo:

1.  **Pré-requisitos**:

    - [Instale o Node.js](https://nodejs.org/en/download/).
    - Tenha um gerenciador de pacotes como [npm](https://www.npmjs.com/get-npm) ou [yarn](https://classic.yarnpkg.com/en/docs/install/).

2.  **Clone o Repositório**:

    ```bash
    git clone [URL do seu repositório]
    cd passa_bola
    ```

3.  **Instale as Dependências**:

    ```bash
    npm install
    ```

4.  **Configure as Variáveis de Ambiente**:
    Crie um arquivo `.env.local` na raiz do projeto:

    ```env
    NEXT_PUBLIC_API_URL=http://localhost:8080/api
    NEXT_PUBLIC_ENABLE_WEBSOCKET=false
    ```

    > **Nota**: WebSocket está temporariamente desabilitado aguardando configuração no backend. Para habilitar quando estiver pronto, altere para `true`.

5.  **Execute a Aplicação**:
    ```bash
    npm run dev
    ```
    Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver o resultado.

## 🛠️ Estrutura do Projeto

A estrutura de diretórios foi projetada para ser modular e escalável, seguindo as melhores práticas do Next.js:

```
passabola-web/
├── app/                      # Rotas, componentes e lógica da aplicação
│   ├── components/           # Componentes React reutilizáveis
│   │   ├── Header.jsx        # Cabeçalho com navegação
│   │   ├── NotificationCard.jsx    # Card de notificação
│   │   ├── ConversationItem.jsx    # Item de conversa no chat
│   │   ├── MessageBubble.jsx       # Bolha de mensagem
│   │   └── ...               # Outros componentes
│   ├── context/              # Context API para estado global
│   │   ├── AuthContext.js    # Contexto de autenticação
│   │   ├── NotificationContext.js  # Contexto de notificações (WebSocket)
│   │   ├── ChatContext.js    # Contexto de chat (WebSocket)
│   │   └── ToastContext.js   # Contexto de toasts
│   ├── lib/                  # Utilitários e configurações
│   │   ├── api.js            # Cliente HTTP centralizado
│   │   └── routes/           # Rotas da API organizadas por recurso
│   ├── feed/                 # Página do feed de posts
│   ├── games/                # Páginas relacionadas a jogos
│   ├── calendar/             # Página do calendário
│   ├── teams/                # Páginas de equipes
│   ├── notifications/        # Sistema de notificações
│   ├── chat/                 # Sistema de chat em tempo real
│   ├── user/                 # Perfis de usuário
│   ├── login/                # Página de login
│   ├── register/             # Página de registro
│   ├── layout.jsx            # Layout principal com providers
│   └── page.jsx              # Página inicial (landing page)
├── public/                   # Arquivos estáticos
│   ├── icons/                # Ícones SVG
│   └── media/                # Imagens e mídia
├── .github/                  # Documentação e workflows
│   ├── CHAT.md               # Documentação do sistema de chat
│   ├── NOTIFICATIONS.md      # Documentação do sistema de notificações
│   ├── TROUBLESHOOTING.md    # Guia de solução de problemas
│   └── CHANGELOG.md          # Histórico de mudanças
├── .env.example              # Template de variáveis de ambiente
├── .env.local                # Configurações locais (não versionado)
├── next.config.mjs           # Configurações do Next.js
├── tailwind.config.mjs       # Configurações do Tailwind CSS
├── package.json              # Dependências e scripts
└── README.md                 # Este arquivo
```

## 📱 Funcionalidades Principais

### 🔐 Autenticação

- Login e registro de usuários
- Três tipos de perfil: Jogadora, Espectador e Organização
- Proteção de rotas privadas
- JWT Token para autenticação

### 📰 Feed Social

- Publicação de posts
- Lista de posts com paginação
- Interação social

### 🎮 Gerenciamento de Jogos

- Criação de jogos (amistoso, campeonato, copa)
- Edição e exclusão de jogos
- Sistema de convites para jogos
- Calendário de eventos

### 👥 Sistema de Equipes

- Criação e gerenciamento de equipes
- Sistema de convites para equipes
- Lista de membros da equipe

### 🔔 Notificações em Tempo Real

- Notificações via WebSocket (STOMP)
- Suporte a múltiplos tipos: Convite de Equipe, Convite de Jogo, Mensagem do Sistema
- Contador de notificações não lidas
- Filtros e ações em massa
- Fallback HTTP quando WebSocket indisponível
- [Documentação completa](./.github/NOTIFICATIONS.md)

### 💬 Chat em Tempo Real

- Chat privado entre usuários via WebSocket (STOMP)
- Lista de conversas com preview
- Envio de mensagens em tempo real
- Contador de mensagens não lidas
- Fallback HTTP quando WebSocket indisponível
- [Documentação completa](./.github/CHAT.md)

### 👤 Perfis de Usuário

- Visualização de perfil público
- Edição de perfil
- Sistema de seguir/deixar de seguir
- Lista de seguidores e seguindo

### 🤖 Chatbot de Suporte

- Assistente virtual para ajuda

## 📚 Documentação

Para informações detalhadas sobre sistemas específicos, consulte:

- [**Sistema de Notificações**](./.github/NOTIFICATIONS.md) - Documentação completa do sistema de notificações em tempo real
- [**Sistema de Chat**](./.github/CHAT.md) - Documentação completa do sistema de chat privado
- [**Troubleshooting**](./.github/TROUBLESHOOTING.md) - Guia de solução de problemas comuns
- [**Changelog**](./.github/CHANGELOG.md) - Histórico detalhado de mudanças

## ⚠️ Problemas Conhecidos

### WebSocket 403 Forbidden

**Status**: 🔴 Aguardando correção no backend

O sistema de notificações e chat utilizam WebSocket (STOMP) para comunicação em tempo real. Atualmente, o backend está retornando erro 403 Forbidden ao tentar estabelecer a conexão WebSocket.

**Workaround Aplicado**: WebSocket está temporariamente desabilitado via variável de ambiente:

```env
NEXT_PUBLIC_ENABLE_WEBSOCKET=false
```

Ambos os sistemas funcionam normalmente via HTTP como fallback. Para mais detalhes e solução, consulte o [guia de troubleshooting](./.github/TROUBLESHOOTING.md).

---

<p align="center">
  Feito com ❤️ por <strong>Vinícius Lugli</strong>
</p>
