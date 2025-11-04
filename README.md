# Passa a Bola - A Rede Social do Futebol Feminino

<p align="center">
  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8B5pQmu3WV6NFowHTtz5h9dKaCCBVJoRAeA&s" alt="Logo do Passa a Bola" width="150">
</p>

## ⚽ Visão Geral do Projeto

Este é um projeto de destaque desenvolvido em colaboração da **FIAP**, como parte do **Desafio de Inovação Tecnológica: Passa a Bola - Tecnologia & Futebol Feminino**. A nossa solução é uma plataforma web que tem como objetivo transformar a maneira como o futebol feminino é vivenciado no ambiente digital.

Em parceria estratégica com o **Passa a Bola**, o principal canal dedicado aos esportes femininos na América Latina, a plataforma busca dar mais visibilidade às atletas e fortalecer a comunidade.

**⚠️ Este projeto ainda está em desenvolvimento. ⚠️**

> **📖 Documentação Completa:** Acesse a [Central de Documentação](./docs/README.md) para guias técnicos detalhados, design system, componentes, acessibilidade e testes.

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
- **WebSocket**: [**@stomp/stompjs**](https://stomp-js.github.io/) + [**ws**](https://github.com/websockets/ws) - Para comunicação em tempo real e tail server de logs.
- **Gerenciamento de Estado**: **React Context API** - Para estado global da aplicação.
- **Observabilidade**: Sistema de logs estruturado client-side com streaming em tempo real (SSE/WebSocket).

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

6.  **Execute o Servidor de Logs (Opcional)**:

    Para habilitar streaming de logs via WebSocket:

    ```bash
    npm run logs:socket
    ```

    O servidor WebSocket estará disponível em `ws://localhost:3001`. Acesse [http://localhost:3000/logs](http://localhost:3000/logs) para visualizar os logs em tempo real.

## 🛠️ Estrutura do Projeto

A estrutura de diretórios foi projetada para ser modular e escalável, seguindo as melhores práticas do Next.js:

```
passabola-web/
├── app/                      # Rotas, componentes e lógica da aplicação
│   ├── api/                  # API Routes (Next.js)
│   │   └── log/              # Endpoints de logs
│   │       ├── route.js      # POST (receber logs), DELETE (limpar logs)
│   │       └── stream/       # SSE streaming de logs
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
│   │   ├── api.js            # Cliente HTTP centralizado com deduplicador
│   │   ├── logger.js         # Logger client-side estruturado
│   │   └── routes/           # Rotas da API organizadas por recurso
│   ├── logs/                 # Sistema de observabilidade
│   │   └── page.jsx          # UI de visualização de logs em tempo real
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
├── logs/                     # Armazenamento de logs (não versionado)
│   └── client-logs.log       # Arquivo de logs JSON-line
├── scripts/                  # Scripts utilitários
│   └── log-socket-server.js  # Servidor WebSocket para tail de logs
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

### 📊 Sistema de Observabilidade e Logs

- **Logger Client-Side Estruturado**: Logging centralizado com redação automática de headers sensíveis (Authorization, Cookie)
- **Coleta de Logs**: POST `/api/log` - Endpoint para receber logs do cliente
- **Streaming em Tempo Real**:
  - SSE (Server-Sent Events) via `/api/log/stream`
  - WebSocket via `ws://localhost:3001` (servidor tail dedicado)
- **UI de Visualização**: Interface em tempo real em `/logs` com:
  - Filtros por nível (info, warn, error)
  - Busca textual em logs
  - Auto-scroll e exportação (JSON/CSV)
  - Auto-detect de servidor WebSocket
  - Limpeza de logs (client + server)
- **Persistência**: Logs salvos em JSON-line format em `logs/client-logs.log`
- **Instrumentação**: Todas as requisições HTTP são automaticamente logadas com request/response completos

## 🏗️ Arquitetura e Padrões de Design

### Padrões Arquiteturais

#### 1. **Client HTTP Centralizado** (`app/lib/api.js`)

- **Padrão**: Facade + Factory
- **Funcionalidades**:
  - Gerenciamento centralizado de autenticação (JWT token)
  - Tratamento global de erros HTTP
  - Logging automático de request/response
  - **Deduplicador de requisições**: Evita requisições paralelas idênticas usando Map global de promises pendentes
  - Organização modular por recurso (auth, games, teams, etc.)

```javascript
// Exemplo de uso
import { api } from "@/app/lib/api";

// Automaticamente deduplica se chamado em paralelo
const games = await api.games.getAll();
const players = await api.players.getById(1);
```

#### 2. **Logger Estruturado** (`app/lib/logger.js`)

- **Padrão**: Singleton + Observer
- **Características**:
  - Logs estruturados em JSON
  - Redação automática de headers sensíveis
  - Envio assíncrono usando `sendBeacon` ou `fetch` com keepalive
  - Integração transparente com o client HTTP

```javascript
import { logger } from "@/app/lib/logger";

logger.info("User action", { userId: 123, action: "click" });
logger.error("API Error", { endpoint: "/games", status: 500 });
```

#### 3. **Context API Pattern**

Gerenciamento de estado global seguindo o padrão Provider:

- `AuthContext`: Autenticação e dados do usuário logado
- `NotificationContext`: Notificações em tempo real via WebSocket/STOMP
- `ChatContext`: Mensagens de chat via WebSocket/STOMP
- `ToastContext`: Notificações toast UI
- `ThemeContext`: Tema claro/escuro

#### 4. **Route Handlers (Next.js API Routes)**

Endpoints API seguindo padrão RESTful:

```javascript
// app/api/log/route.js
export async function POST(request) {
  /* receber logs */
}
export async function DELETE(request) {
  /* limpar logs */
}
```

#### 5. **Real-time Streaming**

Duplo transporte para observabilidade:

- **SSE (Server-Sent Events)**: Fallback padrão, sempre disponível
- **WebSocket**: Servidor dedicado Node.js com `ws` para performance
- **Auto-detect**: Client detecta disponibilidade do WS e conecta automaticamente

### Decisões de Design

#### Performance e Otimização

1. **Request Deduplication**:

   - Requisições idênticas em paralelo compartilham a mesma Promise
   - Previne race conditions e duplicação de chamadas (ex: múltiplos useEffect)
   - Implementado via Map global com cleanup automático

2. **Lazy Loading**:

   - Componentes carregados sob demanda
   - Reduz bundle inicial

3. **Logging Assíncrono**:
   - `sendBeacon` para logs críticos (não bloqueia navegação)
   - `fetch` com keepalive como fallback

#### Segurança

1. **Redação de Dados Sensíveis**:

   - Headers `Authorization` e `Cookie` são automaticamente redatados em logs
   - Evita vazamento acidental de tokens em logs persistidos

2. **JWT Token Management**:
   - Token armazenado em memória (não em localStorage por padrão)
   - Injetado automaticamente em todas as requisições

#### Resiliência

1. **Fallback Cascading**:

   - WebSocket → SSE → HTTP polling
   - Garantia de funcionalidade mesmo com servidores indisponíveis

2. **Reconnection Strategy**:

   - Backoff exponencial para reconexão WebSocket
   - Máximo de 4 tentativas antes de fallback para SSE

3. **Error Handling**:
   - Try-catch em todas as operações críticas
   - Mensagens de erro user-friendly
   - Logging automático de exceções

## 📚 Documentação

### Documentação Técnica Completa

Acesse nossa [**Central de Documentação**](./docs/README.md) para guias completos:

- [**Design System**](./docs/DESIGN-SYSTEM.md) - Paleta de cores, tipografia, espaçamento e tokens de design
- [**Biblioteca de Componentes**](./docs/COMPONENT-LIBRARY.md) - 35+ componentes React reutilizáveis com exemplos de uso
- [**Guia de Acessibilidade**](./docs/ACCESSIBILITY.md) - Diretrizes WCAG 2.1 AA e checklist de conformidade
- [**Guia de Testes**](./docs/TESTING-GUIDE.md) - Estratégia de testes, ferramentas e melhores práticas

### Documentação de Sprint

- [**SPRINT-001: UX Improvements**](./docs/sprints/SPRINT-001-UX-IMPROVEMENTS.md) - Planejamento completo da sprint de melhorias UX

### Documentação de Sistemas Específicos

Para informações detalhadas sobre sistemas específicos, consulte:

- [**Sistema de Notificações**](./.github/NOTIFICATIONS.md) - Documentação completa do sistema de notificações em tempo real
- [**Sistema de Chat**](./.github/CHAT.md) - Documentação completa do sistema de chat privado
- [**Troubleshooting**](./.github/TROUBLESHOOTING.md) - Guia de solução de problemas comuns
- [**Changelog**](./.github/CHANGELOG.md) - Histórico detalhado de mudanças

### Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor de desenvolvimento (port 3000)
npm run build            # Build de produção
npm run start            # Inicia servidor de produção

# Logs e Observabilidade
npm run logs:socket      # Inicia servidor WebSocket de logs (port 3001)

# Utilitários
npm run lint             # Executa linter
```

### Variáveis de Ambiente

```env
# API Backend
NEXT_PUBLIC_API_URL=http://localhost:8080/api

# WebSocket (Notificações e Chat)
NEXT_PUBLIC_ENABLE_WEBSOCKET=false

# Logs (opcional - se não definido, usa defaults)
LOG_SOCKET_URL=ws://localhost:3001
```

---

<p align="center">
  Feito com ❤️ por <strong>Vinícius Lugli</strong>
</p>
