const API_URL = "http://localhost:8080/api";

let authToken = null;
export const setAuthToken = (token) => {
  authToken = token;
};

async function fetchApi(endpoint, options = {}) {
  const { body, ...customConfig } = options;
  const headers = { "Content-Type": "application/json" };

  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  const config = {
    method: body ? "POST" : options.method || "GET",
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: response.statusText }));
      return Promise.reject(errorData);
    }
    if (response.status === 204) {
      return null; // No Content
    }
    return response.json();
  } catch (error) {
    return Promise.reject(error);
  }
}

export const api = {
  auth: {
    registerPlayer: (data) => fetchApi("/auth/register/player", { body: data }),
    registerOrganization: (data) =>
      fetchApi("/auth/register/organization", { body: data }),
    registerSpectator: (data) =>
      fetchApi("/auth/register/spectator", { body: data }),
    login: (credentials) => fetchApi("/auth/login", { body: credentials }),
  },

  players: {
    getAll: ({ page = 0, size = 20 } = {}) =>
      fetchApi(`/players?page=${page}&size=${size}`),
    getById: (id) => fetchApi(`/players/${id}`),
    getByUsername: (username) => fetchApi(`/players/username/${username}`),
    search: (name, { page = 0, size = 10 } = {}) =>
      fetchApi(`/players/search?name=${name}&page=${page}&size=${size}`),
    getByOrganization: (orgId, { page = 0, size = 10 } = {}) =>
      fetchApi(`/players/organization/${orgId}?page=${page}&size=${size}`),
    update: (id, data) =>
      fetchApi(`/players/${id}`, { method: "PUT", body: data }),
    follow: (id) => fetchApi(`/players/${id}/follow`, { method: "POST" }),
    unfollow: (id) => fetchApi(`/players/${id}/follow`, { method: "DELETE" }),
    getFollowers: (id, { page = 0, size = 20 } = {}) =>
      fetchApi(`/players/${id}/followers?page=${page}&size=${size}`),
    getFollowing: (id, { page = 0, size = 20 } = {}) =>
      fetchApi(`/players/${id}/following?page=${page}&size=${size}`),
  },

  organizations: {
    getAll: ({ page = 0, size = 20 } = {}) =>
      fetchApi(`/organizations?page=${page}&size=${size}`),
    getById: (id) => fetchApi(`/organizations/${id}`),
    search: (name, { page = 0, size = 10 } = {}) =>
      fetchApi(`/organizations/search?name=${name}&page=${page}&size=${size}`),
    update: (id, data) =>
      fetchApi(`/organizations/${id}`, { method: "PUT", body: data }),
    follow: (id) => fetchApi(`/organizations/${id}/follow`, { method: "POST" }),
  },

  games: {
    getAll: ({ page = 0, size = 20 } = {}) =>
      fetchApi(`/games?page=${page}&size=${size}`),
    getById: (id) => fetchApi(`/games/${id}`),
    getByOrganization: (orgId, { page = 0, size = 10 } = {}) =>
      fetchApi(`/games/organization/${orgId}?page=${page}&size=${size}`),
    getByStatus: (status, { page = 0, size = 10 } = {}) =>
      fetchApi(`/games/status/${status}?page=${page}&size=${size}`),
    getByChampionship: (championship, { page = 0, size = 10 } = {}) =>
      fetchApi(
        `/games/championship?championship=${championship}&page=${page}&size=${size}`
      ),
    create: (data) => fetchApi("/games", { body: data }),
    update: (id, data) =>
      fetchApi(`/games/${id}`, { method: "PUT", body: data }),
    delete: (id) => fetchApi(`/games/${id}`, { method: "DELETE" }),
    updateScore: (id, { homeGoals, awayGoals }) =>
      fetchApi(
        `/games/${id}/score?homeGoals=${homeGoals}&awayGoals=${awayGoals}`,
        { method: "PATCH" }
      ),
    subscribe: (id) => fetchApi(`/games/${id}/subscribe`, { method: "POST" }),
  },

  posts: {
    getAll: ({ page = 0, size = 20 } = {}) =>
      fetchApi(`/posts?page=${page}&size=${size}`),
    getById: (id) => fetchApi(`/posts/${id}`),
    getByAuthor: (authorId, { page = 0, size = 10 } = {}) =>
      fetchApi(`/posts/author/${authorId}?page=${page}&size=${size}`),
    getMyPosts: ({ page = 0, size = 10 } = {}) =>
      fetchApi(`/posts/my-posts?page=${page}&size=${size}`),
    getByRole: (role, { page = 0, size = 10 } = {}) =>
      fetchApi(`/posts/role/${role}?page=${page}&size=${size}`),
    getByType: (type, { page = 0, size = 10 } = {}) =>
      fetchApi(`/posts/type/${type}?page=${page}&size=${size}`),
    getMostLiked: ({ page = 0, size = 10 } = {}) =>
      fetchApi(`/posts/most-liked?page=${page}&size=${size}`),
    getWithImages: ({ page = 0, size = 10 } = {}) =>
      fetchApi(`/posts/with-images?page=${page}&size=${size}`),
    search: (content, { page = 0, size = 10 } = {}) =>
      fetchApi(`/posts/search?content=${content}&page=${page}&size=${size}`),
    create: (data) => fetchApi("/posts", { body: data }),
    update: (id, data) =>
      fetchApi(`/posts/${id}`, { method: "PUT", body: data }),
    delete: (id) => fetchApi(`/posts/${id}`, { method: "DELETE" }),
    like: (id) => fetchApi(`/posts/${id}/like`, { method: "POST" }),
    unlike: (id) => fetchApi(`/posts/${id}/unlike`, { method: "POST" }),
    comment: (id, comment) =>
      fetchApi(`/posts/${id}/comment`, { body: { comment } }),
    share: (id) => fetchApi(`/posts/${id}/share`, { method: "POST" }),
  },

  spectators: {
    getAll: ({ page = 0, size = 20 } = {}) =>
      fetchApi(`/spectators?page=${page}&size=${size}`),
    getById: (id) => fetchApi(`/spectators/${id}`),
    getByFavoriteTeam: (teamId, { page = 0, size = 10 } = {}) =>
      fetchApi(`/spectators/favorite-team/${teamId}?page=${page}&size=${size}`),
    update: (id, data) =>
      fetchApi(`/spectators/${id}`, { method: "PUT", body: data }),
  },

  teams: {
    create: (data) => fetchApi("/teams", { body: data }),
    getAll: ({
      page = 0,
      size = 10,
      sortBy = "createdAt",
      sortDir = "desc",
    } = {}) =>
      fetchApi(
        `/teams?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`
      ),
    getById: (id) => fetchApi(`/teams/${id}`),
    search: (name, { page = 0, size = 10 } = {}) =>
      fetchApi(`/teams/search?name=${name}&page=${page}&size=${size}`),
    sendInvite: (teamId, invitedPlayerId) =>
      fetchApi(`/teams/${teamId}/invites`, {
        method: "POST",
        body: { invitedPlayerId },
      }),
    getTeamInvites: (teamId) => fetchApi(`/teams/${teamId}/invites`),
    getMyPendingInvites: () => fetchApi(`/teams/my-invites`),
    acceptInvite: (inviteId) =>
      fetchApi(`/teams/invites/${inviteId}/accept`, { method: "POST" }),
    rejectInvite: (inviteId) =>
      fetchApi(`/teams/invites/${inviteId}/reject`, { method: "POST" }),
    cancelInvite: (inviteId) =>
      fetchApi(`/teams/invites/${inviteId}`, { method: "DELETE" }),
    leaveTeam: (teamId) =>
      fetchApi(`/teams/${teamId}/leave`, { method: "POST" }),
    removePlayer: (teamId, playerId) =>
      fetchApi(`/teams/${teamId}/players/${playerId}`, { method: "DELETE" }),
  },

  games: {
    getAll: ({ page = 0, size = 20 } = {}) =>
      fetchApi(`/games?page=${page}&size=${size}`),
    getById: (id) => fetchApi(`/games/${id}`),
    getByOrganization: (orgId, { page = 0, size = 10 } = {}) =>
      fetchApi(`/games/organization/${orgId}?page=${page}&size=${size}`),
    getByStatus: (status, { page = 0, size = 10 } = {}) =>
      fetchApi(`/games/status/${status}?page=${page}&size=${size}`),
    getByChampionship: (championship, { page = 0, size = 10 } = {}) =>
      fetchApi(
        `/games/championship?championship=${championship}&page=${page}&size=${size}`
      ),
    create: (data) => fetchApi("/games", { body: data }),
    update: (id, data) =>
      fetchApi(`/games/${id}`, { method: "PUT", body: data }),
    delete: (id) => fetchApi(`/games/${id}`, { method: "DELETE" }),
    updateScore: (id, { homeGoals, awayGoals }) =>
      fetchApi(
        `/games/${id}/score?homeGoals=${homeGoals}&awayGoals=${awayGoals}`,
        { method: "PATCH" }
      ),
    subscribe: (id) => fetchApi(`/games/${id}/subscribe`, { method: "POST" }),
  },

  posts: {
    getAll: ({ page = 0, size = 20 } = {}) =>
      fetchApi(`/posts?page=${page}&size=${size}`),
    getById: (id) => fetchApi(`/posts/${id}`),
    getByAuthor: (authorId, { page = 0, size = 10 } = {}) =>
      fetchApi(`/posts/author/${authorId}?page=${page}&size=${size}`),
    getMyPosts: ({ page = 0, size = 10 } = {}) =>
      fetchApi(`/posts/my-posts?page=${page}&size=${size}`),
    getByRole: (role, { page = 0, size = 10 } = {}) =>
      fetchApi(`/posts/role/${role}?page=${page}&size=${size}`),
    getByType: (type, { page = 0, size = 10 } = {}) =>
      fetchApi(`/posts/type/${type}?page=${page}&size=${size}`),
    getMostLiked: ({ page = 0, size = 10 } = {}) =>
      fetchApi(`/posts/most-liked?page=${page}&size=${size}`),
    getWithImages: ({ page = 0, size = 10 } = {}) =>
      fetchApi(`/posts/with-images?page=${page}&size=${size}`),
    search: (content, { page = 0, size = 10 } = {}) =>
      fetchApi(`/posts/search?content=${content}&page=${page}&size=${size}`),
    create: (data) => fetchApi("/posts", { body: data }),
    update: (id, data) =>
      fetchApi(`/posts/${id}`, { method: "PUT", body: data }),
    delete: (id) => fetchApi(`/posts/${id}`, { method: "DELETE" }),
    like: (id) => fetchApi(`/posts/${id}/like`, { method: "POST" }),
    unlike: (id) => fetchApi(`/posts/${id}/unlike`, { method: "POST" }),
    comment: (id, comment) =>
      fetchApi(`/posts/${id}/comment`, { body: { comment } }),
    share: (id) => fetchApi(`/posts/${id}/share`, { method: "POST" }),
  },
};
