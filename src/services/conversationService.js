const API_URL = import.meta.env.VITE_API_URL;

/**
 * Servicio para manejar las operaciones de conversaciones
 */
class ConversationService {
  /**
   * Obtiene todas las conversaciones del usuario autenticado
   * @param {string} accessToken - Token de autenticación
   * @returns {Promise<Array>} Lista de conversaciones
   */
  async getConversations(accessToken) {
    try {
      const response = await fetch(`${API_URL}/api/v1/chat/conversations`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        // Si es error de autenticación, lanzar un error especial
        if (response.status === 401 || response.status === 403) {
          const authError = new Error("Sesión expirada");
          authError.authError = true;
          throw authError;
        }
        throw new Error(`Error al obtener conversaciones: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error en conversationService.getConversations:", error);
      throw error;
    }
  }

  /**
   * Obtiene una conversación específica con todos sus mensajes
   * @param {number} conversationId - ID de la conversación
   * @param {string} accessToken - Token de autenticación
   * @returns {Promise<Object>} Conversación con mensajes
   */
  async getConversationById(conversationId, accessToken) {
    try {
      const response = await fetch(
        `${API_URL}/api/v1/chat/conversations/${conversationId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        // Si es error de autenticación, lanzar un error especial
        if (response.status === 401 || response.status === 403) {
          const authError = new Error("Sesión expirada");
          authError.authError = true;
          throw authError;
        }
        throw new Error(`Error al obtener conversación: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error en conversationService.getConversationById:", error);
      throw error;
    }
  }

  /**
   * Elimina todas las conversaciones del usuario autenticado
   * @param {string} accessToken - Token de autenticación
   * @returns {Promise<Object>} Mensaje de éxito con cantidad de conversaciones eliminadas
   */
  async deleteAllConversations(accessToken) {
    try {
      const response = await fetch(`${API_URL}/api/v1/chat/conversations`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        // Si es error de autenticación, lanzar un error especial
        if (response.status === 401 || response.status === 403) {
          const authError = new Error("Sesión expirada");
          authError.authError = true;
          throw authError;
        }
        throw new Error(`Error al eliminar conversaciones: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(
        "Error en conversationService.deleteAllConversations:",
        error
      );
      throw error;
    }
  }
}

export default new ConversationService();
