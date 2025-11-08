import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import useAuthStore from "../store/authStore";
import chatService from "../services/chatService";
import conversationService from "../services/conversationService";

function ChatPage() {
  const navigate = useNavigate();
  const { user, accessToken, logout } = useAuthStore();
  const [message, setMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [loadingConversations, setLoadingConversations] = useState(true);

  // Cargar conversaciones al montar el componente
  useEffect(() => {
    const loadConversations = async () => {
      try {
        setLoadingConversations(true);
        const data = await conversationService.getConversations(accessToken);
        setConversations(data);
      } catch (error) {
        console.error("Error al cargar conversaciones:", error);
      } finally {
        setLoadingConversations(false);
      }
    };

    loadConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadConversations = async () => {
    try {
      setLoadingConversations(true);
      const data = await conversationService.getConversations(accessToken);
      setConversations(data);
    } catch (error) {
      console.error("Error al cargar conversaciones:", error);
    } finally {
      setLoadingConversations(false);
    }
  };

  const handleSelectConversation = async (convId) => {
    try {
      setConversationId(convId);
      setMessages([]);
      setIsLoading(true);

      // Cargar los mensajes de la conversación
      const conversationData = await conversationService.getConversationById(
        convId,
        accessToken
      );

      // Transformar los mensajes del backend al formato del componente
      if (conversationData.messages && conversationData.messages.length > 0) {
        const formattedMessages = conversationData.messages.map((msg) => ({
          id: msg.id,
          text: msg.content,
          sender: msg.is_user_message ? "user" : "bot",
          timestamp: new Date(msg.created_at),
        }));
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error("Error al cargar mensajes de la conversación:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewConversation = () => {
    setMessages([]);
    setConversationId(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessageText = message.trim();
    setMessage("");
    setIsLoading(true);

    // Agregar mensaje del usuario
    const userMessage = {
      id: Date.now(),
      text: userMessageText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Crear mensaje del bot vacío que se irá llenando con el streaming
    const botMessageId = Date.now() + 1;
    const botMessage = {
      id: botMessageId,
      text: "",
      sender: "bot",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, botMessage]);

    try {
      await chatService.sendMessage(
        userMessageText,
        conversationId,
        accessToken,
        // Callback para actualizar el texto del bot en tiempo real
        (accumulatedText) => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === botMessageId ? { ...msg, text: accumulatedText } : msg
            )
          );
        },
        // Callback para guardar el conversation_id
        (newConversationId) => {
          if (!conversationId) {
            setConversationId(newConversationId);
            // Recargar la lista de conversaciones para mostrar la nueva
            loadConversations();
          }
        }
      );
    } catch (error) {
      console.error("Error en chat:", error);

      // Actualizar el mensaje del bot con un error
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMessageId
            ? {
                ...msg,
                text: "Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.",
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-72 bg-gray-900 border-r border-gray-800 transition-transform duration-300 ease-in-out flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="p-5 border-b border-gray-800">
          <button
            onClick={handleNewConversation}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span className="text-sm font-medium">Nueva conversación</span>
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-5">
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
                <button
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv.id)}
                  className={`w-full px-4 py-3 text-left text-sm rounded-lg hover:bg-gray-800 cursor-pointer transition-colors ${
                    conversationId === conv.id
                      ? "bg-gray-800 text-white"
                      : "text-gray-400"
                  }`}
                >
                  <p className="font-medium truncate">
                    {conv.title || "Nueva conversación"}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                    <span>{conv.message_count} mensajes</span>
                    <span>•</span>
                    <span>
                      {new Date(conv.updated_at).toLocaleDateString("es-ES")}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* User Section */}
        <div className="p-5 border-t border-gray-800">
          <div className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-800 transition-colors">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-base font-semibold">
                {user?.email?.[0]?.toUpperCase() || "U"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.name || "Usuario"}
              </p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-gray-700 rounded transition-colors"
              title="Cerrar sesión"
            >
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay para mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <h1 className="text-xl font-semibold text-gray-900">Chat</h1>
        </header>

        {/* Messages Area */}
        <main className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center p-6">
              <div className="text-center max-w-2xl">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-lg">
                  <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  ¡Hola, {user?.name || user?.email}!
                </h2>
                <p className="text-gray-600 mb-8 text-base">
                  ¿En qué puedo ayudarte hoy?
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <button className="p-5 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all text-left">
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      Explicar un concepto
                    </p>
                    <p className="text-xs text-gray-500">
                      Ayuda con temas complejos
                    </p>
                  </button>
                  <button className="p-5 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all text-left">
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      Generar ideas
                    </p>
                    <p className="text-xs text-gray-500">
                      Brainstorming creativo
                    </p>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto px-6 py-8 space-y-8">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-4 ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.sender === "bot" && (
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                    </div>
                  )}
                  <div
                    className={`flex flex-col max-w-[75%] ${
                      msg.sender === "user" ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`px-5 py-4 rounded-2xl ${
                        msg.sender === "user"
                          ? "bg-blue-600 text-white rounded-br-sm"
                          : "bg-white border border-gray-200 text-gray-900 rounded-bl-sm shadow-sm"
                      }`}
                    >
                      <p className="text-base whitespace-pre-wrap leading-relaxed">
                        {msg.text}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500 mt-2 px-2">
                      {msg.timestamp.toLocaleTimeString("es-ES", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  {msg.sender === "user" && (
                    <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-base font-semibold">
                        {user?.email?.[0]?.toUpperCase() || "U"}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>

        {/* Input Area */}
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
                {isLoading ? (
                  <svg
                    className="w-6 h-6 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                )}
              </button>
            </div>
          </form>
        </footer>
      </div>
    </div>
  );
}

export default ChatPage;
