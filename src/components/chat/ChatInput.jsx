import { useState } from "react";
import PropTypes from "prop-types";
import SpinnerIcon from "../icons/SpinnerIcon";
import SendIcon from "../icons/SendIcon";

function ChatInput({ onSubmit, isLoading }) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    onSubmit(message.trim());
    setMessage("");
  };

  return (
    <footer className="border-t border-gray-200 p-6 bg-white">
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
        <div className="relative flex items-end gap-3">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Escribe tu mensaje..."
            rows="1"
            disabled={isLoading}
            className="flex-1 px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none max-h-32 text-base min-h-[56px] disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={!message.trim() || isLoading}
            className="w-14 h-14 flex items-center justify-center bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 disabled:opacity-50 flex-shrink-0"
            title="Enviar mensaje"
          >
            {isLoading ? <SpinnerIcon /> : <SendIcon />}
          </button>
        </div>
      </form>
    </footer>
  );
}

ChatInput.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default ChatInput;
