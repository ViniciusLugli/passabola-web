# Sistema de Seguimento - PassaBola Web

## 📋 Visão Geral

O sistema de seguimento permite que usuários (Players, Organizations e Spectators) sigam uns aos outros, visualizem listas de seguidores/seguindo e acompanhem contagens em tempo real.

## 🔑 Conceitos Importantes

### userId vs id

**CRÍTICO**: A API backend utiliza dois tipos de identificadores:

- **`id`**: ID da entidade específica (Player, Organization, Spectator) - usado apenas para buscar perfis
- **`userId`**: ID global do usuário no sistema - **SEMPRE usado nas APIs de follow**

**Exemplo**:
```javascript
// ❌ ERRADO
await api.follow.follow(user.id, "PLAYER");

// ✅ CORRETO
await api.follow.follow(user.userId, "PLAYER");
```

## 🛠️ Estrutura de Arquivos

### Modelos (`app/models/`)
- **`user.js`**: Classe base com propriedade `userId`
- **`player.js`**: Herda de User, adiciona `userId` no construtor
- **`organization.js`**: Herda de User, adiciona `userId` no construtor
- **`spectator.js`**: Herda de User, adiciona `userId` no construtor

### Componentes (`app/components/`)
- **`ProfileHeader.jsx`**: Header de perfil com botão seguir/deixar de seguir
- **`UserListCard.jsx`**: Card para exibir usuários em listas

### Páginas (`app/user/[userType]/[id]/`)
- **`page.jsx`**: Página de perfil do usuário
- **`followers/page.jsx`**: Lista de seguidores
- **`following/page.jsx`**: Lista de quem o usuário segue

### Rotas da API (`app/lib/routes/followRoutes.js`)
Todas as rotas seguem o padrão correto com `userId`.

## 📡 Endpoints da API

### Seguir/Deixar de Seguir (Privado - Requer Token)

```javascript
// Seguir usuário
POST /api/follow
Authorization: Bearer {token}
Body: { targetUserId: 1, targetUserType: "PLAYER" }

// Deixar de seguir
DELETE /api/follow
Authorization: Bearer {token}
Body: { targetUserId: 1, targetUserType: "PLAYER" }

// Verificar se está seguindo
POST /api/follow/check
Authorization: Bearer {token}
Body: { targetUserId: 1, targetUserType: "PLAYER" }
Response: true | false
```

### Listas (Privado - Requer Token)

```javascript
// Meus seguidores
GET /api/follow/my-followers?page=0&size=20
Authorization: Bearer {token}

// Quem eu sigo
GET /api/follow/my-following?page=0&size=20
Authorization: Bearer {token}
```

### Listas Públicas (Não requer token)

```javascript
// Seguidores de um usuário
GET /api/follow/followers/{userId}/{userType}?page=0&size=20

// Quem um usuário está seguindo
GET /api/follow/following/{userId}/{userType}?page=0&size=20
```

## 🎯 Fluxos de Uso

### 1. Seguir um Usuário

```javascript
const handleFollow = async () => {
  try {
    await api.follow.follow(user.userId, user.userType.toUpperCase());
    setIsFollowing(true);
    setFollowersCount((prev) => prev + 1);
  } catch (error) {
    console.error("Erro ao seguir:", error);
  }
};
```

### 2. Verificar Status de Seguimento

```javascript
useEffect(() => {
  const checkFollowingStatus = async () => {
    if (loggedInUser && loggedInUser.userId !== user.userId) {
      try {
        const response = await api.follow.checkFollowing(
          user.userId,
          user.userType
        );
        setIsFollowing(response);
      } catch (error) {
        console.error("Erro:", error);
        setIsFollowing(false);
      }
    }
  };
  checkFollowingStatus();
}, [user, loggedInUser]);
```

### 3. Buscar Listas de Seguidores

```javascript
// Para perfil próprio
const followersResponse = await api.follow.getMyFollowers({
  page: 0,
  size: 20,
});

// Para perfil de outro usuário (público)
const followersResponse = await api.follow.getFollowers(
  user.userId,
  "PLAYER",
  { page: 0, size: 20 }
);

// Extrair dados
const followers = followersResponse.content || [];
const totalFollowers = followersResponse.totalElements || 0;
```

## 📊 Estrutura de Resposta

### Lista de Seguidores/Seguindo

```javascript
{
  "content": [
    {
      "id": 1,                    // ID da entidade
      "userId": 8472639485726394, // ID global (usar este!)
      "username": "maria_silva",
      "name": "Maria Silva",
      "email": "maria@email.com",
      "userType": "PLAYER",
      "bio": "Atacante profissional",
      "profilePhotoUrl": null,
      "bannerUrl": null,
      "phone": "11999999999",
      "createdAt": "2025-10-05T00:00:00",
      "birthDate": "1995-05-15"
    }
  ],
  "totalElements": 50,
  "totalPages": 3,
  "size": 20,
  "number": 0
}
```

## ⚠️ Erros Comuns

### 1. "You cannot follow yourself"
**Causa**: Tentando seguir o próprio perfil
**Solução**: Verificar `loggedInUser.userId !== user.userId` antes de mostrar botão

### 2. "Target user not found"
**Causa**: `userId` incorreto ou usuário não existe
**Solução**: Garantir que está usando `user.userId` e não `user.id`

### 3. "You are already following this user"
**Causa**: Tentando seguir novamente
**Solução**: Verificar status antes com `checkFollowing()`

### 4. 403 Forbidden
**Causa**: Token ausente ou inválido
**Solução**: Verificar `Authorization: Bearer {token}` no header

## 🧪 Como Testar

### 1. Registrar Usuários de Teste

Use o Postman para criar usuários conforme o guia fornecido.

### 2. Testar no Frontend

1. **Login**: Entre com um usuário
2. **Navegar**: Vá para o perfil de outro usuário
3. **Seguir**: Clique no botão "Seguir"
4. **Verificar**: 
   - Contador de seguidores deve aumentar
   - Botão muda para "Deixar de Seguir"
5. **Ver Listas**: Clique em "Seguidores" ou "Seguindo"
6. **Paginação**: Teste navegação entre páginas (se houver > 20 usuários)

### 3. Validar Contagens

```javascript
// As contagens devem vir sempre das APIs
updatedProfileUser.followers = followersListResponse.totalElements;
updatedProfileUser.following = followingListResponse.totalElements;
```

## 🔄 Atualização em Tempo Real

Quando seguir/deixar de seguir:

1. **Estado local atualiza imediatamente** (UX responsiva)
2. **Callback `onFollowChange()`** dispara re-fetch dos dados
3. **Perfil é recarregado** com contagens atualizadas do backend

```javascript
const handleFollow = async () => {
  await api.follow.follow(user.userId, user.userType.toUpperCase());
  setIsFollowing(true);
  setFollowersCount((prev) => prev + 1);
  if (onFollowChange) {
    onFollowChange(); // Re-fetch completo
  }
};
```

## 🎨 Componentes Visuais

### UserListCard

Exibe um card compacto com:
- Avatar redondo
- Nome e username
- Badge com tipo de usuário (Player/Organization/Spectator)
- Bio (em telas maiores)
- Link para o perfil

### ProfileHeader

Exibe:
- Banner e avatar
- Botão seguir/deixar de seguir (se não for próprio perfil)
- Contadores clicáveis de seguidores/seguindo
- Contador de jogos
- Bio

## 📱 Responsividade

Todos os componentes são totalmente responsivos:
- **Mobile**: Layout vertical, informações essenciais
- **Tablet/Desktop**: Layout horizontal, bio visível, avatares maiores

## 🚀 Próximas Melhorias

- [ ] Notificações quando alguém seguir você
- [ ] Sugestões de usuários para seguir
- [ ] Busca de usuários por nome/username
- [ ] Seguir múltiplos usuários de uma vez
- [ ] Sistema de "amigos" (seguimento mútuo)
