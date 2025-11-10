import { useNavigate } from "react-router";
import PropTypes from "prop-types";
import AppSidebar from "./AppSidebar";
import ConversationItem from "../chat/ConversationItem";
import PlusIcon from "../icons/PlusIcon";
import TrashIcon from "../icons/TrashIcon";
import SettingsIcon from "../icons/SettingsIcon";

function ChatSidebar({
  isSidebarOpen,
  setIsSidebarOpen,
  conversations,
  loadingConversations,
  conversationId,
  user,
  onNewConversation,
  onSelectConversation,
  onDeleteAllConversations,
  onLogout,
}) {
  const navigate = useNavigate();

  return (
    <AppSidebar
      isOpen={isSidebarOpen}
      onClose={() => setIsSidebarOpen(false)}
      user={user}
      onLogout={onLogout}
      headerButton={
        <div className="space-y-3">
          <button
            onClick={onNewConversation}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            <PlusIcon />
            <span className="text-sm font-medium">Nueva conversación</span>
          </button>

          <button
            onClick={onDeleteAllConversations}
            disabled={conversations.length === 0}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <TrashIcon />
            <span className="text-sm font-medium">Eliminar todas</span>
          </button>
        </div>
      }
    >
      <div className="space-y-3">
        <div className="px-3 py-2 text-gray-400 text-xs font-semibold uppercase tracking-wider">
          Historial
        </div>
        {loadingConversations ? (
          <div className="px-4 py-3 text-gray-500 text-sm text-center">
            Cargando...
          </div>
        ) : conversations.length === 0 ? (
          <div className="px-4 py-3 text-gray-500 text-sm text-center">
            No hay conversaciones
          </div>
        ) : (
          conversations.map((conv) => (
            <ConversationItem
              key={conv.id}
              conversation={conv}
              isActive={conversationId === conv.id}
              onSelect={onSelectConversation}
            />
          ))
        )}
      </div>

      {/* Settings Section */}
      <div className="mt-auto pt-5 border-t border-gray-800">
        <button
          onClick={() => navigate("/config")}
          className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
        >
          <SettingsIcon />
          <span className="text-sm font-medium">Configuración</span>
        </button>
      </div>
    </AppSidebar>
  );
}

ChatSidebar.propTypes = {
  isSidebarOpen: PropTypes.bool.isRequired,
  setIsSidebarOpen: PropTypes.func.isRequired,
  conversations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string,
      message_count: PropTypes.number,
      updated_at: PropTypes.string,
    })
  ).isRequired,
  loadingConversations: PropTypes.bool.isRequired,
  conversationId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  user: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
  }),
  onNewConversation: PropTypes.func.isRequired,
  onSelectConversation: PropTypes.func.isRequired,
  onDeleteAllConversations: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default ChatSidebar;
