# Quick Start Guide - General UX Components

## 📦 Novos Componentes (Commit 5)

Este guia fornece exemplos práticos de uso dos novos componentes de UX implementados no Commit 5 da Sprint 001.

---

## 🔄 LoadingSkeleton

### Quando usar?

- Durante carregamento inicial de listas
- Ao buscar dados da API
- Em páginas com conteúdo dinâmico

### Exemplos Práticos

#### 1. Lista de Jogos

```jsx
function GamesPage() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  if (loading) {
    return (
      <main className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Jogos Disponíveis</h1>
        <LoadingSkeleton count={5} variant="card" />
      </main>
    );
  }

  return <GamesList games={games} />;
}
```

#### 2. Feed de Posts

```jsx
function Feed() {
  const { posts, loading } = useFeed();

  if (loading) {
    return <LoadingSkeleton count={3} variant="post" />;
  }

  return <PostList posts={posts} />;
}
```

#### 3. Lista de Notificações

```jsx
function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  if (loading) {
    return <LoadingSkeleton count={10} variant="notification" />;
  }

  return <NotificationList notifications={notifications} />;
}
```

---

## 📭 EmptyState

### Quando usar?

- Lista vazia após carregamento
- Nenhum resultado de busca
- Primeira vez do usuário em uma feature
- Incentivar ação do usuário

### Exemplos Práticos

#### 1. Nenhum Time Criado

```jsx
import { Users, Plus } from "lucide-react";

function TeamsPage() {
  const { teams, loading } = useTeams();

  if (loading) return <LoadingSkeleton count={3} variant="card" />;

  if (teams.length === 0) {
    return (
      <EmptyState
        icon={<Users />}
        title="Você ainda não tem times"
        description="Crie um time para começar a jogar e organizar partidas com suas amigas."
        action={
          <Button onClick={() => router.push("/teams/newTeam")}>
            <Plus className="w-4 h-4 mr-2" />
            Criar Meu Primeiro Time
          </Button>
        }
        variant="gradient"
      />
    );
  }

  return <TeamList teams={teams} />;
}
```

#### 2. Nenhum Resultado de Busca

```jsx
import { Search } from "lucide-react";

function SearchResults({ query, results }) {
  if (results.length === 0) {
    return (
      <EmptyState
        icon={<Search />}
        title="Nenhum resultado encontrado"
        description={`Não encontramos resultados para "${query}". Tente usar termos diferentes.`}
        variant="default"
      />
    );
  }

  return <ResultsList results={results} />;
}
```

#### 3. Feed Vazio (Primeira Vez)

```jsx
import { MessageCircle } from "lucide-react";

function Feed() {
  const { posts, loading } = useFeed();

  if (loading) return <LoadingSkeleton count={5} variant="post" />;

  if (posts.length === 0) {
    return (
      <EmptyState
        icon={<MessageCircle />}
        title="Seu feed está vazio"
        description="Siga outras jogadoras para ver posts e atualizações aqui."
        action={
          <Button onClick={() => router.push("/users")}>
            Descobrir Usuários
          </Button>
        }
        variant="gradient"
      />
    );
  }

  return <PostList posts={posts} />;
}
```

#### 4. Sem Notificações

```jsx
import { Bell } from "lucide-react";

function NotificationsTab({ notifications }) {
  if (notifications.length === 0) {
    return (
      <EmptyState
        icon={<Bell />}
        title="Nenhuma notificação"
        description="Você está em dia! Não há notificações para revisar."
        variant="bordered"
      />
    );
  }

  return <NotificationList notifications={notifications} />;
}
```

---

## ⚠️ ErrorState

### Quando usar?

- Falha na requisição de API
- Erro de conexão
- Erro de autenticação
- Timeout de requisição
- Qualquer erro que impede o carregamento

### Exemplos Práticos

#### 1. Erro de Conexão com Retry

```jsx
function GamesPage() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGames = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.games.getAll();
      setGames(response.content || []);
    } catch (err) {
      setError(err.message || "Falha ao carregar jogos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  if (loading) return <LoadingSkeleton count={5} variant="card" />;

  if (error) {
    return (
      <ErrorState
        title="Erro ao carregar jogos"
        message={error}
        onRetry={fetchGames}
        variant="error"
      />
    );
  }

  if (games.length === 0) {
    return (
      <EmptyState
        icon={<Calendar />}
        title="Nenhum jogo disponível"
        description="Seja a primeira a criar um jogo!"
      />
    );
  }

  return <GamesList games={games} />;
}
```

#### 2. Erro de Autenticação

```jsx
import { Lock } from "lucide-react";

function ProtectedPage() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <LoadingSpinner />;

  if (!isAuthenticated) {
    return (
      <ErrorState
        icon={<Lock />}
        title="Acesso Negado"
        message="Você precisa estar logado para acessar esta página."
        onRetry={() => router.push("/login")}
        retryLabel="Fazer Login"
        variant="warning"
      />
    );
  }

  return <PageContent />;
}
```

#### 3. Erro de Timeout

```jsx
import { Clock } from "lucide-react";

function SlowEndpoint() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const response = await api.getData({ signal: controller.signal });
      clearTimeout(timeout);
      setData(response);
    } catch (err) {
      if (err.name === "AbortError") {
        setError("A requisição demorou muito tempo");
      } else {
        setError(err.message);
      }
    }
  };

  if (error) {
    return (
      <ErrorState
        icon={<Clock />}
        title="Tempo Esgotado"
        message="A requisição demorou muito para responder. Tente novamente."
        onRetry={fetchData}
        variant="warning"
      />
    );
  }

  return <DataDisplay data={data} />;
}
```

#### 4. Erro Crítico Sem Retry

```jsx
import { AlertOctagon } from "lucide-react";

function CriticalError() {
  return (
    <ErrorState
      icon={<AlertOctagon />}
      title="Erro Crítico"
      message="O sistema encontrou um erro grave. Por favor, contate o suporte técnico."
      variant="danger"
      // Sem onRetry - usuário não pode resolver sozinho
    />
  );
}
```

---

## 🎨 Padrão Completo: Loading → Error → Empty → Success

### Implementação Recomendada

```jsx
function CompletePageExample() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.getData();
      setData(response.content || []);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setError(err.message || "Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 1. LOADING STATE
  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Título da Página</h1>
        <LoadingSkeleton count={5} variant="card" />
      </div>
    );
  }

  // 2. ERROR STATE
  if (error) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Título da Página</h1>
        <ErrorState
          title="Erro ao carregar dados"
          message={error}
          onRetry={fetchData}
        />
      </div>
    );
  }

  // 3. EMPTY STATE
  if (data.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Título da Página</h1>
        <EmptyState
          icon={<Inbox />}
          title="Nenhum item encontrado"
          description="Adicione novos itens para começar."
          action={
            <Button onClick={() => router.push("/create")}>
              Adicionar Item
            </Button>
          }
          variant="gradient"
        />
      </div>
    );
  }

  // 4. SUCCESS STATE
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Título da Página</h1>
      <DataList data={data} />
    </div>
  );
}
```

---

## 🎯 Boas Práticas

### ✅ DO (Faça)

1. **Use skeleton durante carregamento inicial**

   ```jsx
   if (loading) return <LoadingSkeleton count={5} variant="card" />;
   ```

2. **Sempre forneça retry para erros de rede**

   ```jsx
   <ErrorState onRetry={fetchData} />
   ```

3. **Empty state com ação clara**

   ```jsx
   <EmptyState action={<Button>Criar Novo</Button>} />
   ```

4. **Mensagens de erro específicas**

   ```jsx
   <ErrorState message="Falha ao conectar ao servidor. Verifique sua internet." />
   ```

5. **Use variantes apropriadas**
   ```jsx
   <EmptyState variant="gradient" /> // Para primeira vez
   <EmptyState variant="bordered" /> // Para criar novo item
   ```

### ❌ DON'T (Não faça)

1. **Não mostre apenas "Carregando..."**

   ```jsx
   // ❌ Ruim
   if (loading) return <p>Carregando...</p>;

   // ✅ Bom
   if (loading) return <LoadingSkeleton variant="post" />;
   ```

2. **Não use alert() para erros**

   ```jsx
   // ❌ Ruim
   if (error) alert(error);

   // ✅ Bom
   if (error) return <ErrorState message={error} />;
   ```

3. **Não deixe empty state sem ação**

   ```jsx
   // ❌ Ruim
   <EmptyState title="Vazio" />

   // ✅ Bom
   <EmptyState title="Vazio" action={<Button>Criar</Button>} />
   ```

4. **Não use cores hardcoded**

   ```jsx
   // ❌ Ruim
   <div className="bg-red-500">Erro</div>

   // ✅ Bom
   <ErrorState variant="error" />
   ```

---

## 📊 Checklist de Implementação

Ao implementar uma nova página/feature, verifique:

- [ ] Estado de loading usa `LoadingSkeleton` com variante apropriada
- [ ] Estado de erro usa `ErrorState` com retry quando aplicável
- [ ] Estado vazio usa `EmptyState` com ação clara
- [ ] Todas as transições são suaves (fade-in)
- [ ] Componentes têm ARIA roles corretos
- [ ] Keyboard navigation funciona
- [ ] Dark mode é suportado
- [ ] Responsive em mobile e desktop

---

## 🚀 Próximos Passos

1. **Migrar páginas existentes** para usar os novos componentes
2. **Remover loading spinners genéricos** e substituir por `LoadingSkeleton`
3. **Padronizar empty states** em todas as listas
4. **Adicionar retry** em todos os error states
5. **Testar acessibilidade** com screen reader

---

**Documentação criada em:** 2025-11-05  
**Sprint:** 001 - Commit 5  
**Status:** ✅ Production Ready
