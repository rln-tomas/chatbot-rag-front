import PropTypes from "prop-types";

function ConversationItem({ conversation, isActive, onSelect }) {
  return (
    <button
      onClick={() => onSelect(conversation.id)}
      className={`w-full px-4 py-3 text-left text-sm rounded-lg hover:bg-gray-800 cursor-pointer transition-colors ${
        isActive ? "bg-gray-800 text-white" : "text-gray-400"
      }`}
    >
      <p className="font-medium truncate">
        {conversation.title || "Nueva conversación"}
      </p>
      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
        <span>{conversation.message_count} mensajes</span>
        <span>•</span>
        <span>
          {new Date(conversation.updated_at).toLocaleDateString("es-ES")}
        </span>
      </div>
    </button>
  );
}

ConversationItem.propTypes = {
  conversation: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string,
    message_count: PropTypes.number,
    updated_at: PropTypes.string.isRequired,
  }).isRequired,
  isActive: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default ConversationItem;
