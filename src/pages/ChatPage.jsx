import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import useAuthStore from "../store/authStore";
import chatService from "../services/chatService";
import conversationService from "../services/conversationService";
import ChatSidebar from "../components/sidebar/ChatSidebar";
import ChatMessage from "../components/chat/ChatMessage";
import ChatInput from "../components/chat/ChatInput";
import WelcomeScreen from "../components/chat/WelcomeScreen";
import MenuIcon from "../components/icons/MenuIcon";

function ChatPage() {
  const navigate = useNavigate();
  const { user, accessToken, logout, useStreaming } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const messagesEndRef = useRef(null);
  const scrollTimeoutRef = useRef(null);

  // Auto-scroll optimizado al final cuando cambian los mensajes
  useEffect(() => {
    // Cancelar el timeout anterior si existe
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Usar requestAnimationFrame para scroll más eficiente durante streaming
    scrollTimeoutRef.current = setTimeout(() => {
      requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({
          behavior: "auto",
          block: "end",
        });
      });
    }, 0);

    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [messages]);

  // Cargar conversaciones al montar el componente
  useEffect(() => {
    const loadConversations = async () => {
      try {
        setLoadingConversations(true);
        const data = await conversationService.getConversations(accessToken);
        setConversations(data);
      } catch (error) {
        console.error("Error al cargar conversaciones:", error);
        // Si es error de autenticación, redirigir a login
        if (error.authError) {
          logout();
          navigate("/login");
        }
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
      // Si es error de autenticación, redirigir a login
      if (error.authError) {
        logout();
        navigate("/login");
      }
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
      // Si es error de autenticación, redirigir a login
      if (error.authError) {
        logout();
        navigate("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewConversation = () => {
    setMessages([]);
    setConversationId(null);
  };

  const handleDeleteAllConversations = async () => {
    // Confirmar antes de eliminar
    if (
      !window.confirm(
        "¿Estás seguro de que deseas eliminar todas las conversaciones? Esta acción no se puede deshacer."
      )
    ) {
      return;
    }

    try {
      await conversationService.deleteAllConversations(accessToken);

      // Limpiar el estado local
      setConversations([]);
      setMessages([]);
      setConversationId(null);

      // Recargar conversaciones
      await loadConversations();
    } catch (error) {
      console.error("Error al eliminar conversaciones:", error);
      // Si es error de autenticación, redirigir a login
      if (error.authError) {
        logout();
        navigate("/login");
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSubmit = async (userMessageText) => {
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
      if (useStreaming) {
        // Modo streaming
        await chatService.sendMessage(
          userMessageText,
          conversationId,
          accessToken,
          // Callback para actualizar el texto del bot en tiempo real
          (accumulatedText) => {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === botMessageId
                  ? { ...msg, text: accumulatedText }
                  : msg
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
      } else {
        // Modo normal (sin streaming)
        const response = await chatService.sendMessageNormal(
          userMessageText,
          conversationId,
          accessToken
        );

        // Actualizar el conversation_id si es nuevo
        if (!conversationId && response.conversation_id) {
          setConversationId(response.conversation_id);
          loadConversations();
        }

        // Actualizar el mensaje del bot con la respuesta completa
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMessageId
              ? {
                  ...msg,
                  text: response.response || response.bot_message.content,
                }
              : msg
          )
        );
      }
    } catch (error) {
      console.error("Error en chat:", error);

      // Si es error de autenticación, redirigir a login
      if (error.authError) {
        logout();
        navigate("/login");
        return;
      }

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
      <ChatSidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        conversations={conversations}
        loadingConversations={loadingConversations}
        conversationId={conversationId}
        user={user}
        onNewConversation={handleNewConversation}
        onSelectConversation={handleSelectConversation}
        onDeleteAllConversations={handleDeleteAllConversations}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MenuIcon />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">Chat</h1>
        </header>

        {/* Messages Area */}
        <main className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <WelcomeScreen userName={user?.name || user?.email} />
          ) : (
            <div className="max-w-3xl mx-auto px-6 py-8 space-y-8">
              {messages.map((msg, index) => {
                // Verificar si este es el último mensaje del bot y está en streaming
                const isLastBotMessage =
                  msg.sender === "bot" &&
                  index === messages.length - 1 &&
                  isLoading;

                return (
                  <ChatMessage
                    key={msg.id}
                    message={msg}
                    isStreaming={isLastBotMessage}
                    userEmail={user?.email}
                  />
                );
              })}
              {/* Elemento invisible para hacer scroll automático */}
              <div ref={messagesEndRef} />
            </div>
          )}
        </main>

        {/* Input Area */}
        <ChatInput onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </div>
  );
}

export default ChatPage;
