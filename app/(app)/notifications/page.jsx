"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/app/context/ToastContext";
import NotificationCard from "@/app/components/cards/NotificationCard";
import ConfirmModal from "@/app/components/ui/ConfirmModal";
import NotificationsLoadingState from "@/app/components/notifications/NotificationsLoadingState";
import NotificationsEmptyState from "@/app/components/notifications/NotificationsEmptyState";
import NotificationsHeader from "@/app/components/notifications/NotificationsHeader";
import NotificationsTabs from "@/app/components/notifications/NotificationsTabs";
import NotificationsBatchActions from "@/app/components/notifications/NotificationsBatchActions";
import { useAuth } from "@/app/context/AuthContext";
import { useNotifications } from "@/app/context/NotificationContext";
import { api } from "@/app/lib/api";
import { useNotificationsFilter } from "@/app/hooks/useNotificationsFilter";
import { useNotificationsSelection } from "@/app/hooks/useNotificationsSelection";

export default function NotificationsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const {
    notifications: liveNotifications,
    unreadCount,
    isConnected,
    markAsReadLocally,
    removeNotificationLocally,
    clearReadNotificationsLocally,
    markAllAsReadLocally,
    setNotificationsList,
    updateUnreadCount,
    addNotification,
  } = useNotifications();

  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);

  // Debug: Log user info
  console.log("[DEBUG] Current user:", {
    id: user?.id,
    userType: user?.userType,
    username: user?.username,
    fullUser: user,
  });

  // Use custom hook for filtering
  const { filter, setFilter, filteredNotifications, counts: notificationCounts } =
    useNotificationsFilter(liveNotifications);

  // Use custom hook for selection
  const {
    selectedIds,
    toggleSelect,
    selectAll,
    clearSelection,
    selectAllCheckboxRef,
    isAllSelected,
  } = useNotificationsSelection(filteredNotifications, filter);

  const [batchActionLoading, setBatchActionLoading] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteAllLoading, setDeleteAllLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    let isMounted = true;

    const loadNotifications = async () => {
      setLoading(true);
      try {
        const response = await api.notifications.getAll({ page: 0, size: 50 });
        console.log("[DEBUG] Raw API response:", response);
        const notificationsList = response.content || [];
        console.log("[DEBUG] Notifications list:", notificationsList);
        console.log("[DEBUG] Notifications count:", notificationsList.length);

        if (isMounted) {
          setNotificationsList(notificationsList);
        }

        const countResponse = await api.notifications.getUnreadCount();
        if (isMounted) {
          updateUnreadCount(countResponse.unreadCount || 0);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Erro ao buscar notificações:", err);
          showToast(err.message || "Erro ao carregar notificações.", "error");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadNotifications();

    return () => {
      isMounted = false; // Cleanup
    };
  }, [user, router, setNotificationsList, updateUnreadCount, showToast]);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await api.notifications.markAsRead(notificationId);
      markAsReadLocally(notificationId);
    } catch (err) {
      console.error("Erro ao marcar como lida:", err);
      showToast("Erro ao marcar notificação como lida.", "error");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      // PATCH /api/notifications/read-all retorna { message: "...", count: 10 }
      const response = await api.notifications.markAllAsRead();
      markAllAsReadLocally();
      showToast(
        response.message || "Todas as notificações foram marcadas como lidas!",
        "success"
      );
    } catch (err) {
      console.error("Erro ao marcar todas como lidas:", err);
      showToast("Erro ao marcar todas as notificações como lidas.", "error");
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      await api.notifications.delete(notificationId);
      removeNotificationLocally(notificationId);
      showToast("Notificação deletada!", "success");
    } catch (err) {
      console.error("Erro ao deletar notificação:", err);
      showToast("Erro ao deletar notificação.", "error");
    }
  };


  const handleMarkSelectedAsRead = async () => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    setBatchActionLoading(true);
    try {
      await Promise.all(ids.map((id) => api.notifications.markAsRead(id)));
      ids.forEach((id) => markAsReadLocally(id));
      showToast(`${ids.length} notificações marcadas como lidas.`, "success");
      clearSelection();
    } catch (err) {
      console.error(
        "Erro ao marcar notificações selecionadas como lidas:",
        err
      );
      showToast("Erro ao marcar notificações como lidas.", "error");
    } finally {
      setBatchActionLoading(false);
    }
  };

  const handleDeleteSelectedConfirmed = async () => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) {
      setConfirmDeleteOpen(false);
      return;
    }
    setBatchActionLoading(true);
    try {
      await Promise.all(ids.map((id) => api.notifications.delete(id)));
      ids.forEach((id) => removeNotificationLocally(id));
      showToast(`${ids.length} notificações deletadas.`, "success");
      clearSelection();
      setConfirmDeleteOpen(false);
    } catch (err) {
      console.error("Erro ao deletar notificações selecionadas:", err);
      showToast("Erro ao deletar notificações.", "error");
    } finally {
      setBatchActionLoading(false);
    }
  };

  const handleActionComplete = (type, message) => {
    showToast(message, type);
  };

  const addMockNotifications = () => {
    const now = Date.now();
    const mocks = [
      {
        id: `mock-${now}-1`,
        title: "Convite para time",
        message: "Você recebeu um convite para ingressar no time Gêmeas FC",
        type: "TEAM_INVITE",
        createdAt: new Date().toISOString(),
        read: false,
        link: "/teams/123",
      },
      {
        id: `mock-${now}-2`,
        title: "Partida atualizada",
        message: "Horário alterado: Jogo contra Rivais às 18:00",
        type: "GAME_UPDATE",
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        read: false,
        link: "/games/456",
      },
      {
        id: `mock-${now}-3`,
        title: "Novo post",
        message: "Time adversário postou um update no feed",
        type: "NEW_POST",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
        read: true,
      },
      {
        id: `mock-${now}-4`,
        title: "Novo seguidor",
        message: "A usuária Ana começou a te seguir",
        type: "NEW_FOLLOWER",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        read: false,
      },
      {
        id: `mock-${now}-5`,
        title: "Sistema",
        message: "Manutenção agendada para domingo às 02:00",
        type: "SYSTEM",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
        read: true,
      },
    ];

    // add newest first
    mocks.forEach((m) => addNotification(m));
    showToast(`${mocks.length} notificações mock adicionadas`, "success");
  };

  const handleDeleteAllRead = async () => {
    setDeleteAllLoading(true);
    try {
      const readNotifications = liveNotifications.filter((n) => n.read);

      await Promise.all(
        readNotifications.map((notif) => api.notifications.delete(notif.id))
      );

      clearReadNotificationsLocally();
      showToast(
        `${readNotifications.length} notificações lidas foram deletadas!`,
        "success"
      );
    } catch (err) {
      console.error("Erro ao deletar notificações lidas:", err);
      showToast("Erro ao deletar notificações lidas.", "error");
    } finally {
      setDeleteAllLoading(false);
    }
  };

  if (loading) {
    return <NotificationsLoadingState />;
  }

  return (
    <div className="min-h-screen">
      <main className="container mx-auto p-4 mt-8 max-w-4xl">
        <div className="relative bg-surface border border-default rounded-2xl shadow-elevated p-4 md:p-8 flex flex-col gap-6">
          <NotificationsHeader
            onBack={() => router.back()}
            unreadCount={unreadCount}
            isConnected={isConnected}
            onAddMocks={addMockNotifications}
          />

          {/* notifications shown via ToastProvider */}

          {/* Filtros e Ações */}
          <NotificationsTabs
            activeFilter={filter}
            onFilterChange={setFilter}
            counts={notificationCounts}
            onMarkAllAsRead={handleMarkAllAsRead}
            onDeleteAllRead={handleDeleteAllRead}
            unreadCount={unreadCount}
            hasReadNotifications={liveNotifications.some((n) => n.read)}
            deleteAllLoading={deleteAllLoading}
          />

          {/* Checkbox "Selecionar Tudo" */}
          {filteredNotifications.length > 0 && (
            <div className="flex items-center gap-3 px-1">
              <label className="flex items-center gap-2 cursor-pointer p-2 -m-2">
                <input
                  ref={selectAllCheckboxRef}
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={(e) => {
                    if (e.target.checked) {
                      selectAll();
                    } else {
                      clearSelection();
                    }
                  }}
                  aria-label="Selecionar todas as notificações"
                  className="w-5 h-5 cursor-pointer"
                />
                <span className="text-sm font-medium text-secondary">
                  Selecionar tudo
                  {selectedIds.size > 0 &&
                    selectedIds.size < filteredNotifications.length &&
                    ` (${selectedIds.size}/${filteredNotifications.length})`}
                </span>
              </label>
            </div>
          )}

          {/* Barra de ações em lote (quando houver seleção) */}
          <NotificationsBatchActions
            selectedCount={selectedIds.size}
            onMarkAsRead={handleMarkSelectedAsRead}
            onDelete={() => setConfirmDeleteOpen(true)}
            onClearSelection={clearSelection}
            loading={batchActionLoading}
          />

          {/* Lista de Notificações */}
          <div className="flex flex-col gap-3">
            {filteredNotifications.length === 0 ? (
              <NotificationsEmptyState filter={filter} />
            ) : (
              filteredNotifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                  onDelete={handleDelete}
                  onActionComplete={handleActionComplete}
                  selectable={true}
                  selected={selectedIds.has(notification.id)}
                  onToggleSelect={toggleSelect}
                />
              ))
            )}
          </div>
          {/* Confirm modal para deletar seleção */}
          <ConfirmModal
            isOpen={confirmDeleteOpen}
            title={"Deletar notificações"}
            message={`Tem certeza que deseja deletar ${
              selectedIds.size
            } notificação${selectedIds.size > 1 ? "s" : ""}?`}
            onCancel={() => setConfirmDeleteOpen(false)}
            onConfirm={handleDeleteSelectedConfirmed}
            confirmLabel={"Sim, deletar"}
            cancelLabel={"Cancelar"}
            loading={batchActionLoading}
          />
        </div>
      </main>
    </div>
  );
}
