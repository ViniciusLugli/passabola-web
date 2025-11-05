# PassaBola Component Library

**Version:** 1.0
**Last Updated:** 2025-11-04
**Status:** Active

## Overview

The PassaBola Component Library is a collection of 35+ reusable React components built with Next.js 15, React 19, and Tailwind CSS 4. All components follow accessibility best practices, support light/dark themes, and are fully responsive.

## Table of Contents

- [UI Components](#ui-components)
  - [Button](#button)
  - [Input](#input)
  - [Modal](#modal)
  - [LoadingSpinner](#loadingspinner)
  - [LoadingSkeleton](#loadingskeleton)
  - [EmptyState](#emptystate)
  - [ErrorState](#errorstate)
  - [Alert](#alert)
  - [Toast](#toast)
  - [ThemeToggle](#themetoggle)
  - [SearchBar](#searchbar)
  - [SelectInput](#selectinput)
  - [ConfirmModal](#confirmmodal)
  - [StepIndicator](#stepindicator)
- [Card Components](#card-components)
  - [PostCard](#postcard)
  - [NotificationCard](#notificationcard)
  - [NotificationCardSkeleton](#notificationcardskeleton)
  - [GameCard](#gamecard)
  - [TeamCard](#teamcard)
  - [UserListCard](#userlistcard)
- [Chat Components](#chat-components)
  - [MessageBubble](#messagebubble)
  - [ConversationItem](#conversationitem)
  - [MessageInput](#messageinput)
- [Profile Components](#profile-components)
  - [ProfileHeader](#profileheader)
  - [PlayerStats](#playerstats)
- [List Components](#list-components)
  - [PostList](#postlist)
  - [TeamList](#teamlist)
  - [TeamInviteList](#teaminvitelist)
- [Form Components](#form-components)
  - [CreateTeamForm](#createteamform)
- [Layout Components](#layout-components)
  - [Header](#header)
  - [Footer](#footer)
- [Component Guidelines](#component-guidelines)
- [Creating New Components](#creating-new-components)

---

## UI Components

### Button

A versatile button component with multiple variants, loading states, and full accessibility support.

**Location:** `/app/components/ui/Button.jsx`

#### Props

| Prop        | Type      | Default     | Description                                            |
| ----------- | --------- | ----------- | ------------------------------------------------------ |
| `children`  | ReactNode | -           | Button content                                         |
| `type`      | string    | `"button"`  | HTML button type (`button`, `submit`, `reset`)         |
| `onClick`   | function  | -           | Click handler                                          |
| `loading`   | boolean   | `false`     | Shows loading spinner when true                        |
| `disabled`  | boolean   | `false`     | Disables button interaction                            |
| `variant`   | string    | `"primary"` | Button style variant (`primary`, `secondary`, `ghost`) |
| `className` | string    | `""`        | Additional CSS classes                                 |
| `ariaLabel` | string    | -           | Accessible label for screen readers                    |

#### Variants

**Primary:** Full-width gradient button for main actions

```jsx
<Button variant="primary" onClick={handleSubmit}>
  Criar Conta
</Button>
```

**Secondary:** Outlined button for secondary actions

```jsx
<Button variant="secondary" onClick={handleCancel}>
  Cancelar
</Button>
```

**Ghost:** Text-only button for tertiary actions

```jsx
<Button variant="ghost" onClick={handleLearnMore}>
  Saiba Mais
</Button>
```

#### Loading State

```jsx
<Button loading={isSubmitting} disabled={isSubmitting}>
  {isSubmitting ? "Criando..." : "Criar Conta"}
</Button>
```

#### Accessibility Features

- Proper ARIA attributes (`aria-disabled`, `aria-busy`, `aria-label`)
- Screen reader-only loading text
- Keyboard navigation support
- Focus visible states

---

### Input

A comprehensive input component supporting text, password, email, number, and textarea types with validation states.

**Location:** `/app/components/ui/Input.jsx`

#### Props

| Prop          | Type     | Default  | Description                                                    |
| ------------- | -------- | -------- | -------------------------------------------------------------- |
| `label`       | string   | -        | Input label text                                               |
| `type`        | string   | `"text"` | Input type (`text`, `password`, `email`, `number`, `textarea`) |
| `placeholder` | string   | -        | Placeholder text                                               |
| `name`        | string   | -        | Input name attribute                                           |
| `value`       | string   | -        | Controlled input value                                         |
| `onChange`    | function | -        | Change handler                                                 |
| `className`   | string   | `""`     | Additional CSS classes                                         |
| `description` | string   | -        | Helper text below input                                        |
| `hint`        | string   | -        | Hint text (shown when no error)                                |
| `error`       | string   | -        | Error message                                                  |
| `success`     | string   | -        | Success message                                                |
| `required`    | boolean  | `false`  | Shows required indicator                                       |
| `disabled`    | boolean  | `false`  | Disables input                                                 |

#### Basic Usage

```jsx
<Input
  label="Email"
  type="email"
  placeholder="seu@email.com"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  required
/>
```

#### With Description

```jsx
<Input
  label="Nome de Usuário"
  type="text"
  placeholder="@seu_usuario"
  value={username}
  onChange={(e) => setUsername(e.target.value)}
  description="Seu nome de usuário será visível publicamente"
/>
```

#### Error State

```jsx
<Input
  label="Senha"
  type="password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  error={passwordError}
/>
```

#### Success State

```jsx
<Input
  label="Email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  success="Email válido!"
/>
```

#### Textarea

```jsx
<Input
  label="Descrição"
  type="textarea"
  placeholder="Conte-nos sobre você..."
  value={description}
  onChange={(e) => setDescription(e.target.value)}
/>
```

#### Accessibility Features

- Auto-generated unique IDs with `useId()`
- Proper label association
- ARIA descriptions for hints and errors
- Password visibility toggle
- Auto-expanding textarea
- Required field indicator

---

### Modal

A fully accessible modal dialog with backdrop, close button, and keyboard support.

**Location:** `/app/components/ui/Modal.jsx`

#### Props

| Prop       | Type      | Default | Description               |
| ---------- | --------- | ------- | ------------------------- |
| `isOpen`   | boolean   | -       | Controls modal visibility |
| `onClose`  | function  | -       | Close handler             |
| `title`    | string    | -       | Modal title               |
| `children` | ReactNode | -       | Modal content             |

#### Usage

```jsx
const [isOpen, setIsOpen] = useState(false);

<Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Confirmar Ação">
  <p className="text-secondary mb-4">Tem certeza que deseja continuar?</p>
  <div className="flex gap-3">
    <Button variant="secondary" onClick={() => setIsOpen(false)}>
      Cancelar
    </Button>
    <Button variant="primary" onClick={handleConfirm}>
      Confirmar
    </Button>
  </div>
</Modal>;
```

#### Features

- Click outside to close
- Escape key to close
- Focus trap within modal
- Prevents scroll on body when open
- Smooth scale animation
- Responsive max-width (`max-w-md` on mobile, `max-w-2xl` on desktop)

#### Accessibility

- `role="dialog"`
- `aria-modal="true"`
- `aria-label` set to title
- Proper focus management

---

### LoadingSpinner

An animated loading indicator using Lucide's Loader2 icon.

**Location:** `/app/components/ui/LoadingSpinner.jsx`

#### Props

| Prop             | Type    | Default                                | Description                        |
| ---------------- | ------- | -------------------------------------- | ---------------------------------- |
| `label`          | string  | `"Carregando"`                         | Loading text                       |
| `size`           | number  | `20`                                   | Icon size in pixels                |
| `className`      | string  | `""`                                   | Additional CSS classes             |
| `iconClassName`  | string  | `"text-current"`                       | Icon color classes                 |
| `strokeWidth`    | number  | `2.5`                                  | Icon stroke width                  |
| `labelClassName` | string  | `"text-sm font-medium text-secondary"` | Label styling                      |
| `srOnly`         | boolean | `false`                                | Shows label only to screen readers |

#### Usage

```jsx
// Default
<LoadingSpinner />

// Custom label
<LoadingSpinner label="Carregando posts..." />

// Screen reader only
<LoadingSpinner label="Enviando mensagem" srOnly />

// Custom size and color
<LoadingSpinner
  size={32}
  iconClassName="text-accent"
  label="Processando..."
/>
```

#### In Buttons

```jsx
<Button loading={isLoading}>
  {isLoading ? <LoadingSpinner srOnly label="Salvando" /> : "Salvar"}
</Button>
```

---

### LoadingSkeleton

A skeleton placeholder for loading states with shimmer animation and multiple variants.

**Location:** `/app/components/ui/LoadingSkeleton.jsx`

#### Props

| Prop        | Type   | Default  | Description                                             |
| ----------- | ------ | -------- | ------------------------------------------------------- |
| `count`     | number | `3`      | Number of skeleton items to display                     |
| `variant`   | string | `"card"` | Skeleton layout: `card`, `list`, `post`, `notification` |
| `className` | string | `""`     | Additional CSS classes                                  |

#### Variants

**Card Variant** - Generic content card skeleton

```jsx
<LoadingSkeleton count={3} variant="card" />
```

**List Variant** - User list with avatar and text

```jsx
<LoadingSkeleton count={5} variant="list" />
```

**Post Variant** - Social media post skeleton

```jsx
<LoadingSkeleton variant="post" />
```

**Notification Variant** - Notification card skeleton

```jsx
<LoadingSkeleton count={10} variant="notification" />
```

#### Features

- **Shimmer Animation:** Smooth CSS-only animation
- **Performance Optimized:** Uses `contain: paint` for isolation
- **Accessible:** Includes `role="status"` and screen reader text
- **Fade-in:** Each skeleton fades in smoothly
- **Responsive:** Adapts to mobile and desktop layouts

#### Example Usage

```jsx
function GamesList() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  if (loading) {
    return <LoadingSkeleton count={5} variant="card" />;
  }

  return games.map((game) => <GameCard key={game.id} game={game} />);
}
```

---

### EmptyState

A reusable component to display empty states with icon, title, description, and optional action button.

**Location:** `/app/components/ui/EmptyState.jsx`

#### Props

| Prop          | Type      | Default     | Description                                      |
| ------------- | --------- | ----------- | ------------------------------------------------ |
| `icon`        | ReactNode | -           | Lucide icon component                            |
| `title`       | string    | -           | Main heading text                                |
| `description` | string    | -           | Supporting description text                      |
| `action`      | ReactNode | -           | Optional action button/link                      |
| `variant`     | string    | `"default"` | Style variant: `default`, `gradient`, `bordered` |
| `className`   | string    | `""`        | Additional CSS classes                           |

#### Variants

**Default** - Simple white background

```jsx
<EmptyState
  icon={<Inbox />}
  title="Nenhum post ainda"
  description="Comece criando seu primeiro post!"
/>
```

**Gradient** - Colorful gradient background

```jsx
<EmptyState
  variant="gradient"
  icon={<Users />}
  title="Nenhum seguidor"
  description="Convide amigos para seguir você"
/>
```

**Bordered** - Dashed border for create actions

```jsx
<EmptyState
  variant="bordered"
  icon={<PlusCircle />}
  title="Adicionar novo item"
/>
```

#### With Action Button

```jsx
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import EmptyState from "@/app/components/ui/EmptyState";
import Button from "@/app/components/ui/Button";

function TeamsList() {
  const router = useRouter();
  const [teams, setTeams] = useState([]);

  if (teams.length === 0) {
    return (
      <EmptyState
        icon={<Users />}
        title="Você ainda não tem times"
        description="Crie um time para começar a jogar e organizar partidas."
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

#### Accessibility Features

- `role="status"` for screen reader announcements
- `aria-live="polite"` for non-urgent updates
- `aria-label` set to title for context
- Icon has `aria-hidden="true"`
- Action button is fully keyboard accessible

---

### ErrorState

A user-friendly error display component with retry functionality.

**Location:** `/app/components/ui/ErrorState.jsx`

#### Props

| Prop         | Type      | Default              | Description                                 |
| ------------ | --------- | -------------------- | ------------------------------------------- |
| `title`      | string    | `"Algo deu errado"`  | Error heading                               |
| `message`    | string    | Default error text   | Detailed error message                      |
| `onRetry`    | function  | -                    | Retry callback function                     |
| `retryLabel` | string    | `"Tentar Novamente"` | Retry button text                           |
| `icon`       | ReactNode | `<AlertCircle />`    | Custom icon (Lucide)                        |
| `variant`    | string    | `"error"`            | Style variant: `error`, `warning`, `danger` |

#### Variants

**Error** - Standard error (red)

```jsx
<ErrorState
  title="Erro ao carregar jogos"
  message="Não foi possível conectar ao servidor."
  onRetry={fetchGames}
/>
```

**Warning** - Non-critical warning (yellow)

```jsx
<ErrorState
  variant="warning"
  title="Conexão instável"
  message="Sua conexão está lenta. Alguns recursos podem não funcionar."
/>
```

**Danger** - Critical error (dark red)

```jsx
<ErrorState
  variant="danger"
  title="Erro crítico"
  message="O sistema encontrou um erro grave. Contate o suporte."
/>
```

#### With Custom Icon

```jsx
import { WifiOff } from "lucide-react";

<ErrorState
  icon={<WifiOff />}
  title="Sem conexão"
  message="Verifique sua conexão com a internet e tente novamente."
  onRetry={handleRetry}
  retryLabel="Reconectar"
/>;
```

#### Complete Example with Error Handling

```jsx
function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.posts.getAll();
      setPosts(response.content || []);
    } catch (err) {
      setError(err.message || "Falha ao carregar posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) {
    return <LoadingSkeleton count={5} variant="post" />;
  }

  if (error) {
    return (
      <ErrorState
        title="Erro ao carregar feed"
        message={error}
        onRetry={fetchPosts}
      />
    );
  }

  if (posts.length === 0) {
    return (
      <EmptyState
        icon={<MessageCircle />}
        title="Nenhum post no feed"
        description="Siga outros usuários para ver posts aqui."
      />
    );
  }

  return <PostList posts={posts} />;
}
```

#### Accessibility Features

- `role="alert"` for immediate screen reader announcement
- `aria-live="assertive"` for urgent errors
- `aria-atomic="true"` reads entire message
- Retry button has clear `aria-label`
- Icon is decorative with `aria-hidden="true"`
- Keyboard accessible retry button

---

---

### Alert

A dismissible alert component for temporary notifications.

**Location:** `/app/components/ui/Alert.jsx`

#### Props

| Prop       | Type     | Default   | Description                                        |
| ---------- | -------- | --------- | -------------------------------------------------- |
| `isOpen`   | boolean  | -         | Controls alert visibility                          |
| `onClose`  | function | -         | Close handler                                      |
| `message`  | string   | -         | Alert message                                      |
| `type`     | string   | `"error"` | Alert type (`error`, `success`, `warning`, `info`) |
| `duration` | number   | `3000`    | Auto-dismiss duration in ms                        |

#### Usage

```jsx
<Alert
  isOpen={showAlert}
  onClose={() => setShowAlert(false)}
  message="Sua conta foi criada com sucesso!"
  type="success"
  duration={5000}
/>
```

#### Types

**Error:** Red background, used for errors

```jsx
<Alert type="error" message="Falha ao salvar. Tente novamente." />
```

**Success:** Green background, used for confirmations

```jsx
<Alert type="success" message="Post criado com sucesso!" />
```

**Warning:** Yellow background, used for warnings

```jsx
<Alert type="warning" message="Seu perfil está incompleto." />
```

**Info:** Blue background, used for informational messages

```jsx
<Alert type="info" message="Nova atualização disponível!" />
```

---

### Toast

A context-based toast notification system for global alerts.

**Location:** `/app/components/ui/Toast.jsx`

#### Usage with Context

```jsx
import { useToast } from "@/app/context/ToastContext";

function MyComponent() {
  const { showToast } = useToast();

  const handleAction = () => {
    showToast("Ação concluída!", "success");
  };

  return <button onClick={handleAction}>Executar</button>;
}
```

#### Toast Types

```jsx
// Success
showToast("Post salvo com sucesso!", "success");

// Error
showToast("Erro ao carregar dados.", "error");

// Info
showToast("Você tem novas notificações.", "info");

// Warning
showToast("Ação irreversível!", "warning");
```

---

### ThemeToggle

A toggle button for switching between light and dark themes.

**Location:** `/app/components/ui/ThemeToggle.jsx`

#### Usage

```jsx
<ThemeToggle />
```

#### Features

- Smooth theme transition
- Icon changes based on theme (Sun/Moon)
- Persists theme preference to localStorage
- Accessible button with aria-label

---

### SearchBar

A search input with icon and clear functionality.

**Location:** `/app/components/ui/SearchBar.jsx`

#### Props

| Prop          | Type     | Default       | Description            |
| ------------- | -------- | ------------- | ---------------------- |
| `value`       | string   | -             | Search query value     |
| `onChange`    | function | -             | Change handler         |
| `placeholder` | string   | `"Buscar..."` | Placeholder text       |
| `className`   | string   | `""`          | Additional CSS classes |

#### Usage

```jsx
const [query, setQuery] = useState("");

<SearchBar
  value={query}
  onChange={(e) => setQuery(e.target.value)}
  placeholder="Buscar jogadoras..."
/>;
```

---

### SelectInput

A styled select dropdown component.

**Location:** `/app/components/ui/SelectInput.jsx`

#### Props

| Prop       | Type     | Default | Description                         |
| ---------- | -------- | ------- | ----------------------------------- |
| `label`    | string   | -       | Select label                        |
| `options`  | array    | -       | Array of `{ value, label }` objects |
| `value`    | string   | -       | Selected value                      |
| `onChange` | function | -       | Change handler                      |
| `required` | boolean  | `false` | Shows required indicator            |
| `error`    | string   | -       | Error message                       |

#### Usage

```jsx
const positions = [
  { value: "goleira", label: "Goleira" },
  { value: "zagueira", label: "Zagueira" },
  { value: "meia", label: "Meia" },
  { value: "atacante", label: "Atacante" },
];

<SelectInput
  label="Posição"
  options={positions}
  value={position}
  onChange={(e) => setPosition(e.target.value)}
  required
/>;
```

---

### ConfirmModal

A specialized modal for confirmation dialogs.

**Location:** `/app/components/ui/ConfirmModal.jsx`

#### Props

| Prop          | Type     | Default       | Description                          |
| ------------- | -------- | ------------- | ------------------------------------ |
| `isOpen`      | boolean  | -             | Controls modal visibility            |
| `onClose`     | function | -             | Close/cancel handler                 |
| `onConfirm`   | function | -             | Confirm action handler               |
| `title`       | string   | -             | Modal title                          |
| `message`     | string   | -             | Confirmation message                 |
| `confirmText` | string   | `"Confirmar"` | Confirm button text                  |
| `cancelText`  | string   | `"Cancelar"`  | Cancel button text                   |
| `variant`     | string   | `"danger"`    | Button variant (`danger`, `primary`) |

#### Usage

```jsx
<ConfirmModal
  isOpen={showDeleteConfirm}
  onClose={() => setShowDeleteConfirm(false)}
  onConfirm={handleDelete}
  title="Deletar Post"
  message="Tem certeza que deseja deletar este post? Esta ação não pode ser desfeita."
  confirmText="Deletar"
  cancelText="Cancelar"
  variant="danger"
/>
```

---

### StepIndicator

A visual step indicator for multi-step processes.

**Location:** `/app/components/ui/StepIndicator.jsx`

#### Props

| Prop          | Type   | Default | Description                  |
| ------------- | ------ | ------- | ---------------------------- |
| `steps`       | array  | -       | Array of step labels         |
| `currentStep` | number | -       | Current step index (0-based) |

#### Usage

```jsx
const steps = ["Dados Pessoais", "Informações de Contato", "Confirmação"];

<StepIndicator steps={steps} currentStep={1} />;
```

---

## Card Components

### PostCard

Displays a social media post with author info, content, image, and like functionality.

**Location:** `/app/components/cards/PostCard.jsx`

#### Props

| Prop   | Type   | Default | Description      |
| ------ | ------ | ------- | ---------------- |
| `post` | object | -       | Post data object |

#### Post Object Structure

```javascript
{
  id: number,
  authorId: number,
  authorUsername: string,
  authorType: string, // "PLAYER", "ORGANIZATION", "SPECTATOR"
  authorProfilePhotoUrl: string,
  content: string,
  imageUrl: string | null,
  createdAt: string, // ISO date
  totalLikes: number,
  isLikedByCurrentUser: boolean
}
```

#### Usage

```jsx
<PostCard post={post} />
```

#### Features

- Author avatar and name (clickable to profile)
- Post content with line breaks preserved
- Optional post image
- Like/unlike toggle with optimistic UI
- Timestamp formatting (relative and absolute)
- Responsive image sizing

---

### NotificationCard

A notification card with swipe gestures, mark as read, and delete actions.

**Location:** `/app/components/cards/NotificationCard.jsx`

#### Props

| Prop               | Type     | Default | Description                        |
| ------------------ | -------- | ------- | ---------------------------------- |
| `notification`     | object   | -       | Notification data                  |
| `onMarkAsRead`     | function | -       | Mark as read handler               |
| `onDelete`         | function | -       | Delete handler                     |
| `onActionComplete` | function | -       | Action complete callback           |
| `selectable`       | boolean  | `false` | Shows checkbox for batch selection |
| `selected`         | boolean  | `false` | Selection state                    |
| `onToggleSelect`   | function | -       | Toggle selection handler           |

#### Notification Object

```javascript
{
  id: number,
  type: string, // "TEAM_INVITE", "GAME_INVITE", "SYSTEM", etc.
  title: string,
  message: string,
  createdAt: string,
  read: boolean,
  link: string | null
}
```

#### Usage

```jsx
<NotificationCard
  notification={notification}
  onMarkAsRead={handleMarkAsRead}
  onDelete={handleDelete}
  onActionComplete={() => refetchNotifications()}
/>
```

#### Features

- Swipe left to reveal actions (mobile)
- Visual distinction for unread (purple left border)
- Type-specific icons (emoji-based)
- Relative timestamp formatting
- Inline actions for invites (accept/decline)

---

### NotificationCardSkeleton

Loading placeholder for notification cards.

**Location:** `/app/components/cards/NotificationCardSkeleton.jsx`

#### Usage

```jsx
{
  isLoading && (
    <>
      <NotificationCardSkeleton />
      <NotificationCardSkeleton />
      <NotificationCardSkeleton />
    </>
  );
}
```

---

### GameCard

Displays game information including teams, date, location, and status.

**Location:** `/app/components/cards/GameCard.jsx`

#### Props

| Prop       | Type     | Default | Description               |
| ---------- | -------- | ------- | ------------------------- |
| `game`     | object   | -       | Game data object          |
| `onEdit`   | function | -       | Edit handler (optional)   |
| `onDelete` | function | -       | Delete handler (optional) |

#### Usage

```jsx
<GameCard game={game} onEdit={handleEdit} onDelete={handleDelete} />
```

---

### TeamCard

Displays team information with member count and join/leave actions.

**Location:** `/app/components/cards/TeamCard.jsx`

#### Props

| Prop      | Type     | Default | Description        |
| --------- | -------- | ------- | ------------------ |
| `team`    | object   | -       | Team data object   |
| `onJoin`  | function | -       | Join team handler  |
| `onLeave` | function | -       | Leave team handler |

#### Usage

```jsx
<TeamCard team={team} onJoin={handleJoin} onLeave={handleLeave} />
```

---

### UserListCard

Displays user information in a list format with follow/unfollow actions.

**Location:** `/app/components/cards/UserListCard.jsx`

#### Props

| Prop         | Type     | Default | Description      |
| ------------ | -------- | ------- | ---------------- |
| `user`       | object   | -       | User data object |
| `onFollow`   | function | -       | Follow handler   |
| `onUnfollow` | function | -       | Unfollow handler |

#### Usage

```jsx
<UserListCard user={user} onFollow={handleFollow} onUnfollow={handleUnfollow} />
```

---

## Chat Components

### MessageBubble

Displays a chat message with sender info and timestamp.

**Location:** `/app/components/chat/MessageBubble.jsx`

#### Props

| Prop      | Type   | Default | Description         |
| --------- | ------ | ------- | ------------------- |
| `message` | object | -       | Message data object |

#### Message Object

```javascript
{
  id: number,
  senderId: number,
  senderName: string,
  content: string,
  sentAt: string // ISO date
}
```

#### Usage

```jsx
<MessageBubble message={message} />
```

#### Features

- Automatic alignment based on sender (left for others, right for own messages)
- Color coding (purple for own, gray for others)
- Sender name for incoming messages
- Timestamp formatting (HH:MM)
- Supports line breaks in content

---

### ConversationItem

Displays a conversation preview in the chat list.

**Location:** `/app/components/chat/ConversationItem.jsx`

#### Props

| Prop           | Type     | Default | Description                    |
| -------------- | -------- | ------- | ------------------------------ |
| `conversation` | object   | -       | Conversation data              |
| `isActive`     | boolean  | `false` | Highlights active conversation |
| `onClick`      | function | -       | Click handler                  |

#### Usage

```jsx
<ConversationItem
  conversation={conversation}
  isActive={selectedConversationId === conversation.id}
  onClick={() => handleSelectConversation(conversation.id)}
/>
```

---

### MessageInput

A text input for composing and sending messages.

**Location:** `/app/components/chat/MessageInput.jsx`

#### Props

| Prop          | Type     | Default                    | Description      |
| ------------- | -------- | -------------------------- | ---------------- |
| `value`       | string   | -                          | Message text     |
| `onChange`    | function | -                          | Change handler   |
| `onSend`      | function | -                          | Send handler     |
| `placeholder` | string   | `"Digite sua mensagem..."` | Placeholder text |
| `disabled`    | boolean  | `false`                    | Disables input   |

#### Usage

```jsx
<MessageInput
  value={message}
  onChange={(e) => setMessage(e.target.value)}
  onSend={handleSendMessage}
  placeholder="Enviar mensagem..."
/>
```

---

## Profile Components

### ProfileHeader

Displays user profile header with avatar, name, stats, and follow button.

**Location:** `/app/components/profile/ProfileHeader.jsx`

#### Props

| Prop           | Type     | Default | Description                 |
| -------------- | -------- | ------- | --------------------------- |
| `user`         | object   | -       | User data object            |
| `isOwnProfile` | boolean  | `false` | True if viewing own profile |
| `onFollow`     | function | -       | Follow handler              |
| `onUnfollow`   | function | -       | Unfollow handler            |
| `onEdit`       | function | -       | Edit profile handler        |

#### Usage

```jsx
<ProfileHeader
  user={user}
  isOwnProfile={currentUserId === user.id}
  onFollow={handleFollow}
  onUnfollow={handleUnfollow}
  onEdit={() => router.push("/profile/edit")}
/>
```

---

### PlayerStats

Displays player statistics (games, goals, assists).

**Location:** `/app/components/profile/PlayerStats.jsx`

#### Props

| Prop    | Type   | Default | Description       |
| ------- | ------ | ------- | ----------------- |
| `stats` | object | -       | Player statistics |

#### Stats Object

```javascript
{
  gamesPlayed: number,
  goals: number,
  assists: number
}
```

#### Usage

```jsx
<PlayerStats stats={playerStats} />
```

---

## List Components

### PostList

Renders a list of posts with loading and empty states.

**Location:** `/app/components/lists/PostList.jsx`

#### Props

| Prop           | Type    | Default                    | Description             |
| -------------- | ------- | -------------------------- | ----------------------- |
| `posts`        | array   | -                          | Array of post objects   |
| `loading`      | boolean | `false`                    | Shows loading skeletons |
| `emptyMessage` | string  | `"Nenhum post encontrado"` | Empty state message     |

#### Usage

```jsx
<PostList
  posts={posts}
  loading={isLoading}
  emptyMessage="Ainda não há posts. Seja o primeiro a publicar!"
/>
```

---

### TeamList

Renders a list of teams with loading and empty states.

**Location:** `/app/components/lists/TeamList.jsx`

#### Props

| Prop      | Type    | Default | Description             |
| --------- | ------- | ------- | ----------------------- |
| `teams`   | array   | -       | Array of team objects   |
| `loading` | boolean | `false` | Shows loading skeletons |

#### Usage

```jsx
<TeamList teams={teams} loading={isLoading} />
```

---

### TeamInviteList

Renders a list of team invitations with accept/decline actions.

**Location:** `/app/components/lists/TeamInviteList.jsx`

#### Props

| Prop        | Type     | Default | Description             |
| ----------- | -------- | ------- | ----------------------- |
| `invites`   | array    | -       | Array of invite objects |
| `onAccept`  | function | -       | Accept invite handler   |
| `onDecline` | function | -       | Decline invite handler  |

#### Usage

```jsx
<TeamInviteList
  invites={teamInvites}
  onAccept={handleAcceptInvite}
  onDecline={handleDeclineInvite}
/>
```

---

## Form Components

### CreateTeamForm

A complete form for creating a new team.

**Location:** `/app/components/forms/CreateTeamForm.jsx`

#### Props

| Prop       | Type     | Default | Description         |
| ---------- | -------- | ------- | ------------------- |
| `onSubmit` | function | -       | Form submit handler |
| `onCancel` | function | -       | Cancel handler      |

#### Usage

```jsx
<CreateTeamForm onSubmit={handleCreateTeam} onCancel={() => router.back()} />
```

---

## Layout Components

### Header

The main application header with navigation and user menu.

**Location:** `/app/components/layout/Header.jsx`

#### Features

- Logo and site title
- Navigation links (Feed, Jogos, Times)
- User avatar and dropdown menu
- Notification bell with unread count
- Theme toggle
- Responsive mobile menu

#### Usage

```jsx
<Header />
```

---

### Footer

The application footer with links and copyright.

**Location:** `/app/components/layout/Footer.jsx`

#### Usage

```jsx
<Footer />
```

---

## Component Guidelines

### General Principles

1. **Accessibility First**

   - All interactive elements have proper ARIA labels
   - Keyboard navigation is fully supported
   - Focus states are visible
   - Screen reader compatibility is tested

2. **Responsive Design**

   - Mobile-first approach
   - Tested from 320px to 1920px
   - Touch-friendly targets (min 44x44px)

3. **Theme Support**

   - All components support light and dark themes
   - Use design system color tokens
   - Test in both themes before committing

4. **Performance**

   - Use `React.memo` for expensive components
   - Optimize re-renders with proper prop comparison
   - Lazy load images with Next.js Image component

5. **Consistency**
   - Follow established patterns from existing components
   - Use design system tokens for spacing, colors, typography
   - Maintain consistent naming conventions

### Naming Conventions

**Component Files:**

- PascalCase: `MyComponent.jsx`
- Location: `/app/components/{category}/MyComponent.jsx`

**Component Props:**

- camelCase: `onClick`, `isLoading`, `userName`

**CSS Classes:**

- Tailwind utility classes
- Design system custom classes (kebab-case): `bg-surface`, `text-primary`

### File Structure

```
/app/components/
├── ui/              # Generic UI components (buttons, inputs, modals)
├── cards/           # Card components for displaying content
├── chat/            # Chat-specific components
├── feed/            # Feed-specific components
├── forms/           # Form components
├── layout/          # Layout components (header, footer)
├── lists/           # List/collection components
└── profile/         # Profile-specific components
```

---

## Creating New Components

### Component Template

Use this template when creating new components:

```jsx
"use client";

import { memo } from "react";
import PropTypes from "prop-types";

/**
 * MyComponent - Brief description of what this component does
 *
 * @param {Object} props - Component props
 * @param {string} props.title - Title text
 * @param {Function} props.onClick - Click handler
 * @param {string} [props.className] - Additional CSS classes
 */
const MyComponent = ({ title, onClick, className = "" }) => {
  return (
    <div className={`bg-surface rounded-lg p-4 ${className}`}>
      <h3 className="text-lg font-semibold text-primary mb-2">{title}</h3>
      <button
        onClick={onClick}
        className="bg-accent text-on-brand px-4 py-2 rounded-lg"
        aria-label={`Action for ${title}`}
      >
        Click Me
      </button>
    </div>
  );
};

MyComponent.propTypes = {
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default memo(MyComponent);
```

### Checklist for New Components

Before creating a pull request:

- [ ] Component follows naming conventions
- [ ] Component is in correct directory
- [ ] Props are documented with JSDoc comments
- [ ] PropTypes are defined (or TypeScript types)
- [ ] Component supports light/dark theme
- [ ] Component is responsive (tested at 320px, 768px, 1920px)
- [ ] All interactive elements have ARIA labels
- [ ] Keyboard navigation works correctly
- [ ] Component is memoized if it has expensive renders
- [ ] Component is added to this documentation
- [ ] Usage examples are provided
- [ ] Component has unit tests (optional but recommended)

---

## Component Testing

### Unit Testing Example

```jsx
import { render, screen, fireEvent } from "@testing-library/react";
import Button from "./Button";

describe("Button", () => {
  it("renders children correctly", () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText("Click Me")).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    fireEvent.click(screen.getByText("Click Me"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("disables button when loading", () => {
    render(<Button loading>Submit</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
```

---

## Resources

### Related Documentation

- [Design System](/docs/DESIGN-SYSTEM.md) - Design tokens and guidelines
- [Accessibility](/docs/ACCESSIBILITY.md) - WCAG 2.1 AA compliance
- [Testing Guide](/docs/TESTING-GUIDE.md) - Testing strategy and examples

### External Resources

- [React 19 Documentation](https://react.dev)
- [Next.js 15 Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

---

## Changelog

| Version | Date       | Changes                                 |
| ------- | ---------- | --------------------------------------- |
| 1.0     | 2025-11-04 | Initial component library documentation |

---

**Maintained by:** PassaBola Development Team
**Questions?** Open a GitHub Discussion or contact the frontend lead.
