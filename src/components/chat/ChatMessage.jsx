import PropTypes from "prop-types";
import Avatar from "../common/Avatar";
import MarkdownContent from "../common/MarkdownContent";
import StreamingText from "./StreamingText";

function ChatMessage({ message, isStreaming, userEmail }) {
  const isUser = message.sender === "user";
  const isBot = message.sender === "bot";

  return (
    <div className={`flex gap-4 ${isUser ? "justify-end" : "justify-start"}`}>
      {isBot && <Avatar type="bot" />}
      <div
        className={`flex flex-col max-w-[75%] ${
          isUser ? "items-end" : "items-start"
        }`}
      >
        <div
          className={`px-5 py-4 rounded-2xl ${
            isUser
              ? "bg-blue-600 text-white rounded-br-sm"
              : "bg-white border border-gray-200 text-gray-900 rounded-bl-sm shadow-sm"
          }`}
        >
          <div className="text-base leading-relaxed markdown-content">
            {isBot && isStreaming ? (
              <StreamingText text={message.text} isStreaming={isStreaming} />
            ) : isBot ? (
              <MarkdownContent>{message.text}</MarkdownContent>
            ) : (
              <p className="whitespace-pre-wrap">{message.text}</p>
            )}
          </div>
        </div>
        <span className="text-xs text-gray-500 mt-2 px-2">
          {message.timestamp.toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
      {isUser && <Avatar type="user" email={userEmail} />}
    </div>
  );
}

ChatMessage.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
    sender: PropTypes.oneOf(["user", "bot"]).isRequired,
    timestamp: PropTypes.instanceOf(Date).isRequired,
  }).isRequired,
  isStreaming: PropTypes.bool,
  userEmail: PropTypes.string,
};

ChatMessage.defaultProps = {
  isStreaming: false,
};

export default ChatMessage;
