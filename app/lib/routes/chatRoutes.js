export default function createChatRoutes(fetchApi) {
  return {
    getConversations: (params = {}) => {
      const queryParams = new URLSearchParams();
      if (params.page !== undefined) queryParams.append("page", params.page);
      if (params.size !== undefined) queryParams.append("size", params.size);
      if (params.sort) queryParams.append("sort", params.sort);

      const queryString = queryParams.toString();
      return fetchApi(`/chats${queryString ? `?${queryString}` : ""}`);
    },

    createConversation: (data) =>
      fetchApi("/chats", { method: "POST", body: data }),

    getConversationById: (chatId) => fetchApi(`/chats/${chatId}`),

    deleteConversation: (chatId) =>
      fetchApi(`/chats/${chatId}`, { method: "DELETE" }),

    getMessages: (chatId, params = {}) => {
      const queryParams = new URLSearchParams();
      if (params.page !== undefined) queryParams.append("page", params.page);
      if (params.size !== undefined) queryParams.append("size", params.size);
      if (params.sort) queryParams.append("sort", params.sort);

      const queryString = queryParams.toString();
      return fetchApi(
        `/chats/${chatId}/messages${queryString ? `?${queryString}` : ""}`
      );
    },

    sendMessage: (chatId, content) =>
      fetchApi(`/chats/${chatId}/messages`, {
        method: "POST",
        body: { content },
      }),

    markAsRead: (chatId) =>
      fetchApi(`/chats/${chatId}/read`, { method: "PUT" }),

    getUnreadCount: () => fetchApi("/chats/unread-count"),
  };
}
