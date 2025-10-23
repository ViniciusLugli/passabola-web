export default function createNotificationRoutes(fetchApi) {
  return {
    getAll: (params = {}) => {
      const queryParams = new URLSearchParams();
      if (params.page !== undefined) queryParams.append("page", params.page);
      if (params.size !== undefined) queryParams.append("size", params.size);
      if (params.sort) queryParams.append("sort", params.sort);
      if (params.read !== undefined) queryParams.append("read", params.read);

      const queryString = queryParams.toString();
      return fetchApi(`/notifications${queryString ? `?${queryString}` : ""}`);
    },

    getById: (id) => fetchApi(`/notifications/${id}`),

    markAsRead: (id) =>
      fetchApi(`/notifications/${id}/mark-read`, { method: "PUT" }),

    markAsUnread: (id) =>
      fetchApi(`/notifications/${id}/mark-unread`, { method: "PUT" }),

    markAllAsRead: () =>
      fetchApi("/notifications/mark-all-read", { method: "PUT" }),

    delete: (id) => fetchApi(`/notifications/${id}`, { method: "DELETE" }),

    deleteAllRead: () =>
      fetchApi("/notifications/delete-read", { method: "DELETE" }),

    getUnreadCount: () => fetchApi("/notifications/unread-count"),
  };
}
