const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

let authToken = null;
export const setAuthToken = (token) => {
  authToken = token;
};

export const clearAuthToken = () => {
  authToken = null;
};

async function fetchApi(endpoint, options = {}) {
  const { body, ...customConfig } = options;
  const headers = { "Content-Type": "application/json" };

  if (authToken && !customConfig.skipAuth) {
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
      const parsedBody = await response.json().catch(() => null);
      const errorObj = {
        status: response.status,
        statusText: response.statusText,
        body: parsedBody,
      };

      if (parsedBody && typeof parsedBody === "object") {
        if (parsedBody.message) {
          errorObj.message = parsedBody.message;
        } else if (parsedBody.error) {
          errorObj.message = parsedBody.error;
        } else if (parsedBody.errors && Array.isArray(parsedBody.errors)) {
          errorObj.message = parsedBody.errors.join(", ");
        } else {
          errorObj.message = `Erro ${response.status}: ${response.statusText}`;
        }
      } else {
        errorObj.message = `Erro ${response.status}: ${response.statusText}`;
      }

      console.error("API Error:", errorObj);
      return Promise.reject(errorObj);
    }
    if (response.status === 204) {
      return null;
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return response.json();
    } else {
      const text = await response.text();
      return text ? text : null;
    }
  } catch (error) {
    console.error("Fetch Error:", error);
    return Promise.reject({ message: error.message || String(error) });
  }
}

async function fetchApiFormData(endpoint, formData, options = {}) {
  const { ...customConfig } = options;
  const headers = {};

  if (authToken && !customConfig.skipAuth) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  const config = {
    method: "PUT",
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
    body: formData,
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    if (!response.ok) {
      const parsedBody = await response.json().catch(() => null);
      const errorObj = {
        status: response.status,
        statusText: response.statusText,
        body: parsedBody,
      };
      if (parsedBody && typeof parsedBody === "object" && parsedBody.message) {
        errorObj.message = parsedBody.message;
      }
      return Promise.reject(errorObj);
    }
    if (response.status === 204) {
      return null;
    }
    return response.json();
  } catch (error) {
    return Promise.reject(error);
  }
}

import createAuthRoutes from "./routes/authRoutes";
import createPlayerRoutes from "./routes/playerRoutes";
import createOrganizationRoutes from "./routes/organizationRoutes";
import createSpectatorRoutes from "./routes/spectatorRoutes";
import createFollowRoutes from "./routes/followRoutes";
import createGameRoutes from "./routes/gameRoutes";
import createGameParticipantsRoutes from "./routes/gameParticipantsRoutes";
import createGameInvitesRoutes from "./routes/gameInvitesRoutes";
import createPostRoutes from "./routes/postRoutes";
import createTeamRoutes from "./routes/teamRoutes";
import createNotificationRoutes from "./routes/notificationRoutes";
import createChatRoutes from "./routes/chatRoutes";

export const api = {
  auth: createAuthRoutes(fetchApi),
  players: createPlayerRoutes(fetchApi, fetchApiFormData),
  organizations: createOrganizationRoutes(fetchApi, fetchApiFormData),
  spectators: createSpectatorRoutes(fetchApi),
  follow: createFollowRoutes(fetchApi),
  games: createGameRoutes(fetchApi),
  gameParticipants: createGameParticipantsRoutes(fetchApi),
  gameInvites: createGameInvitesRoutes(fetchApi),
  posts: createPostRoutes(fetchApi),
  teams: createTeamRoutes(fetchApi),
  notifications: createNotificationRoutes(fetchApi),
  chats: createChatRoutes(fetchApi),
};
