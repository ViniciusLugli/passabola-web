import { logRequestResponse } from "./logger";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

let authToken = null;
export const setAuthToken = (token) => {
  authToken = token;
};

export const clearAuthToken = () => {
  authToken = null;
};

async function fetchApi(endpoint, options = {}) {
  if (!global._pendingFetchRequests) global._pendingFetchRequests = new Map();
  const pendingMap = global._pendingFetchRequests;

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

  const dedupeKey = JSON.stringify({
    endpoint,
    method: config.method,
    body: body ?? null,
  });
  if (pendingMap.has(dedupeKey)) {
    return pendingMap.get(dedupeKey);
  }

  const promise = (async () => {
    try {
      const requestHeadersForLog = config.headers;
      const requestBodyForLog = body ? body : null;

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

        try {
          const respHeaders = {};
          response.headers.forEach &&
            response.headers.forEach((v, k) => (respHeaders[k] = v));

          // Erros esperados de ranking (404/500) quando jogador não tem ranking ainda
          const isExpectedRankingError =
            endpoint.includes("/rankings/") &&
            (response.status === 404 || response.status === 500);

          logRequestResponse({
            level: isExpectedRankingError ? "warn" : "error",
            route: endpoint,
            method: config.method,
            requestBody: requestBodyForLog,
            requestHeaders: requestHeadersForLog,
            responseBody: parsedBody,
            responseStatus: response.status,
            responseHeaders: respHeaders,
            message: isExpectedRankingError
              ? "Ranking ainda não disponível (jogador sem jogos competitivos)"
              : errorObj.message,
          });
        } catch (_) {}

        return Promise.reject(errorObj);
      }

      if (response.status === 204) {
        try {
          const respHeaders = {};
          response.headers.forEach &&
            response.headers.forEach((v, k) => (respHeaders[k] = v));
          logRequestResponse({
            level: "info",
            route: endpoint,
            method: config.method,
            requestBody: requestBodyForLog,
            requestHeaders: requestHeadersForLog,
            responseBody: null,
            responseStatus: 204,
            responseHeaders: respHeaders,
          });
        } catch (_) {}
        return null;
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const parsed = await response.json();
        try {
          const respHeaders = {};
          response.headers.forEach &&
            response.headers.forEach((v, k) => (respHeaders[k] = v));
          logRequestResponse({
            level: "info",
            route: endpoint,
            method: config.method,
            requestBody: requestBodyForLog,
            requestHeaders: requestHeadersForLog,
            responseBody: parsed,
            responseStatus: response.status,
            responseHeaders: respHeaders,
          });
        } catch (_) {}
        return parsed;
      } else {
        const text = await response.text();
        try {
          const respHeaders = {};
          response.headers.forEach &&
            response.headers.forEach((v, k) => (respHeaders[k] = v));
          logRequestResponse({
            level: "info",
            route: endpoint,
            method: config.method,
            requestBody: requestBodyForLog,
            requestHeaders: requestHeadersForLog,
            responseBody: text,
            responseStatus: response.status,
            responseHeaders: respHeaders,
          });
        } catch (_) {}
        return text ? text : null;
      }
    } catch (error) {
      try {
        logRequestResponse({
          level: "error",
          route: endpoint,
          method: (options && options.method) || "GET",
          requestBody: body ?? null,
          requestHeaders: (options && options.headers) || {},
          responseBody: null,
          responseStatus: null,
          responseHeaders: {},
          message: error?.message || String(error),
          meta: { error },
        });
      } catch (_) {}
      return Promise.reject({ message: error.message || String(error) });
    }
  })();

  pendingMap.set(dedupeKey, promise);
  promise.finally(() => pendingMap.delete(dedupeKey));
  return promise;
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
import createRankingRoutes from "./routes/rankingRoutes";

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
  rankings: createRankingRoutes(fetchApi),
};
