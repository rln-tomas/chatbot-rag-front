const API_URL = import.meta.env.VITE_API_URL;

/**
 * Servicio para manejar las peticiones de chat con streaming
 */
class ChatService {
  /**
   * Envía un mensaje al chat y procesa la respuesta en streaming
   * @param {string} message - Mensaje del usuario
   * @param {number|null} conversationId - ID de la conversación actual
   * @param {string} accessToken - Token de autenticación
   * @param {Function} onChunk - Callback que se ejecuta con cada chunk de texto recibido
   * @param {Function} onConversationId - Callback para actualizar el conversation_id
   * @returns {Promise<void>}
   */
  async sendMessage(
    message,
    conversationId,
    accessToken,
    onChunk,
    onConversationId
  ) {
    try {
      // Preparar el body de la petición
      const requestBody = {
        message: message,
      };

      // Solo incluir conversation_id si existe (no es null o undefined)
      // Si es null/undefined, el backend creará una nueva conversación
      if (conversationId !== null && conversationId !== undefined) {
        requestBody.conversation_id = conversationId;
      } else {
        // Pasar 0 o no incluirlo para crear nueva conversación
        requestBody.conversation_id = 0;
      }

      const response = await fetch(`${API_URL}/api/v1/chat/stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`);
      }

      await this.processStream(
        response,
        conversationId,
        onChunk,
        onConversationId
      );
    } catch (error) {
      console.error("Error en chatService:", error);
      throw error;
    }
  }

  /**
   * Procesa el stream de la respuesta SSE
   * @param {Response} response - Respuesta fetch con el stream
   * @param {number|null} currentConversationId - ID de conversación actual antes del mensaje
   * @param {Function} onChunk - Callback para cada chunk de texto
   * @param {Function} onConversationId - Callback para el conversation_id
   * @returns {Promise<void>}
   */
  async processStream(
    response,
    currentConversationId,
    onChunk,
    onConversationId
  ) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let accumulatedText = "";
    let conversationIdNotified = false;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n");

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6).trim();

          if (data === "[DONE]") {
            return;
          }

          try {
            const parsed = JSON.parse(data);

            // Si hay un conversation_id y es una conversación nueva o diferente, notificarlo
            if (
              parsed.conversation_id &&
              onConversationId &&
              !conversationIdNotified
            ) {
              // Solo notificar si:
              // 1. No teníamos conversation_id (nueva conversación)
              // 2. O el conversation_id cambió
              if (
                currentConversationId === null ||
                currentConversationId === undefined ||
                currentConversationId !== parsed.conversation_id
              ) {
                onConversationId(parsed.conversation_id);
                conversationIdNotified = true;
              }
            }

            // Si hay contenido, acumularlo y notificarlo
            if (parsed.content) {
              accumulatedText += parsed.content;
              if (onChunk) {
                onChunk(accumulatedText);
              }
            }
          } catch (parseError) {
            console.error("Error parsing SSE data:", parseError);
          }
        }
      }
    }
  }
}

export default new ChatService();
