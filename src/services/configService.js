const API_URL = import.meta.env.VITE_API_URL;

/**
 * Servicio para manejar las configuraciones de URLs para RAG
 */
class ConfigService {
  /**
   * Obtiene la lista de configuraciones del usuario
   * @param {string} accessToken - Token de autenticación
   * @param {number} page - Número de página (opcional)
   * @param {number} pageSize - Tamaño de página (opcional)
   * @returns {Promise<Object>} - Lista de configuraciones
   */
  async getConfigs(accessToken, page = 1, pageSize = 50) {
    try {
      const response = await fetch(
        `${API_URL}/api/v1/configs?page=${page}&page_size=${pageSize}`,
        {
          method: "GET",
          headers: {
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
        const errorData = await response.json();
        throw new Error(
          errorData.message || `Error del servidor: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error en getConfigs:", error);
      throw error;
    }
  }

  /**
   * Crea una nueva configuración de URL para scraping
   * @param {string} url - URL a agregar para RAG
   * @param {string} accessToken - Token de autenticación
   * @returns {Promise<Object>} - Configuración creada
   */
  async createUrlConfig(url, accessToken) {
    try {
      const response = await fetch(`${API_URL}/api/v1/configs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        // Si es error de autenticación, lanzar un error especial
        if (response.status === 401 || response.status === 403) {
          const authError = new Error("Sesión expirada");
          authError.authError = true;
          throw authError;
        }
        const errorData = await response.json();
        throw new Error(
          errorData.message || `Error del servidor: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error en configService:", error);
      throw error;
    }
  }

  /**
   * Inicia el trabajo de scraping para una configuración
   * @param {number} configId - ID de la configuración
   * @param {string} accessToken - Token de autenticación
   * @returns {Promise<Object>} - Respuesta con el task ID
   */
  async startScraping(configId, accessToken) {
    try {
      const response = await fetch(`${API_URL}/api/v1/scraping/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ config_id: configId }),
      });

      if (!response.ok) {
        // Si es error de autenticación, lanzar un error especial
        if (response.status === 401 || response.status === 403) {
          const authError = new Error("Sesión expirada");
          authError.authError = true;
          throw authError;
        }
        const errorData = await response.json();
        throw new Error(
          errorData.message || `Error del servidor: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error en startScraping:", error);
      throw error;
    }
  }
}

export default new ConfigService();
