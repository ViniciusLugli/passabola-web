import { MessageCircle } from "lucide-react";
import ConversationItem from "@/app/components/chat/ConversationItem";

/**
 * Displays list of conversations with connection status
 */
export default function ConversationList({
  conversations,
  activeConversation,
  isConnected,
  onSelectConversation,
  className = "",
}) {
  return (
    <div className={`flex flex-col bg-surface-muted ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-default">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-primary">Conversas</h2>
          {isConnected && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-xs text-secondary">Online</span>
            </div>
          )}
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <EmptyConversations />
        ) : (
          <>
            {conversations.map((conversation) => (
              <ConversationItem
                key={conversation.otherUserId}
                conversation={conversation}
                isActive={
                  String(activeConversation?.otherUserId) ===
                  String(conversation.otherUserId)
                }
                onClick={() => onSelectConversation(conversation)}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}

function EmptyConversations() {
  return (
    <div className="p-8 text-center text-secondary">
      <MessageCircle className="w-12 h-12 mx-auto mb-3 text-secondary opacity-50" />
      <p className="font-medium mb-2">Nenhuma conversa ainda</p>
      <p className="text-sm opacity-75">
        Inicie uma conversa visitando o perfil de um usuário
      </p>
    </div>
  );
}
