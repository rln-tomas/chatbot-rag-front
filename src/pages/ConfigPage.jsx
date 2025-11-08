import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import useAuthStore from "../store/authStore";
import configService from "../services/configService";

function ConfigPage() {
  const navigate = useNavigate();
  const { user, accessToken, logout, useStreaming, setUseStreaming } =
    useAuthStore();
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isScrapingLoading, setIsScrapingLoading] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [configs, setConfigs] = useState([]);
  const [loadingConfigs, setLoadingConfigs] = useState(true);

  // Cargar configuraciones al montar el componente
  useEffect(() => {
    loadConfigs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadConfigs = async () => {
    try {
      setLoadingConfigs(true);
      const data = await configService.getConfigs(accessToken);
      setConfigs(data.items || []);
    } catch (error) {
      console.error("Error al cargar configuraciones:", error);
      // Si es error de autenticación, redirigir a login
      if (error.authError) {
        logout();
        navigate("/login");
        return;
      }
      setError("Error al cargar las configuraciones");
    } finally {
      setLoadingConfigs(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar que la URL no esté vacía
    if (!url.trim()) {
      setError("Por favor, ingresa una URL");
      return;
    }

    // Validar formato básico de URL
    try {
      new URL(url);
    } catch {
      setError("Por favor, ingresa una URL válida");
      return;
    }

    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      await configService.createUrlConfig(url, accessToken);
      setSuccess("URL agregada exitosamente");
      setUrl("");

      // Recargar la lista de configuraciones
      await loadConfigs();

      // Limpiar el mensaje de éxito después de 3 segundos
      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (error) {
      console.error("Error al guardar configuración:", error);
      // Si es error de autenticación, redirigir a login
      if (error.authError) {
        logout();
        navigate("/login");
        return;
      }
      setError(error.message || "Error al guardar la configuración");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartScraping = async (configId) => {
    setError("");
    setSuccess("");
    setIsScrapingLoading((prev) => ({ ...prev, [configId]: true }));

    try {
      const response = await configService.startScraping(configId, accessToken);
      setSuccess(
        `Scraping iniciado exitosamente. Task ID: ${
          response.task_id || response.id
        }`
      );

      // Recargar la lista de configuraciones para actualizar estados
      await loadConfigs();

      // Limpiar el mensaje de éxito después de 5 segundos
      setTimeout(() => {
        setSuccess("");
      }, 5000);
    } catch (error) {
      console.error("Error al iniciar scraping:", error);
      // Si es error de autenticación, redirigir a login
      if (error.authError) {
        logout();
        navigate("/login");
        return;
      }
      setError(error.message || "Error al iniciar el scraping");
    } finally {
      setIsScrapingLoading((prev) => ({ ...prev, [configId]: false }));
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      processing: "bg-blue-100 text-blue-800 border-blue-200",
      completed: "bg-green-100 text-green-800 border-green-200",
      failed: "bg-red-100 text-red-800 border-red-200",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getStatusText = (status) => {
    const texts = {
      pending: "Pendiente",
      processing: "Procesando",
      completed: "Completado",
      failed: "Fallido",
    };
    return texts[status] || status;
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
            onClick={() => navigate("/chat")}
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
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <span className="text-sm font-medium">Ir al Chat</span>
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-5">
          <div className="space-y-3">
            <div className="px-3 py-2 text-gray-400 text-xs font-semibold uppercase tracking-wider">
              Configuración
            </div>
            <button className="w-full px-4 py-3 text-left text-sm rounded-lg bg-gray-800 text-white transition-colors">
              <div className="flex items-center gap-3">
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
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
                <span className="font-medium">URLs para RAG</span>
              </div>
            </button>
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
          <h1 className="text-xl font-semibold text-gray-900">Configuración</h1>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Configuraciones Generales */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Configuraciones Generales
                </h2>
                <p className="text-gray-600">
                  Ajusta las preferencias de funcionamiento del chat
                </p>
              </div>

              <div className="flex items-center justify-between py-4">
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-900 mb-1">
                    Modo de respuesta
                  </h3>
                  <p className="text-sm text-gray-600">
                    {useStreaming
                      ? "Streaming: Las respuestas se muestran en tiempo real mientras se generan"
                      : "Normal: Las respuestas se muestran completas al finalizar"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setUseStreaming(!useStreaming)}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    useStreaming ? "bg-blue-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                      useStreaming ? "translate-x-7" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Card Container para URLs */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Agregar URL para RAG
                </h2>
                <p className="text-gray-600">
                  Ingresa una URL para realizar scraping y agregar contenido a
                  la base de conocimiento.
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label
                    htmlFor="url"
                    className="block text-base font-medium text-gray-700 mb-3"
                  >
                    URL
                  </label>
                  <input
                    id="url"
                    name="url"
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://ejemplo.com"
                    disabled={isLoading}
                    className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>

                {error && (
                  <div className="rounded-xl bg-red-50 border border-red-200 p-4 mb-6">
                    <p className="text-sm text-red-600 flex items-center gap-2">
                      <svg
                        className="w-5 h-5 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {error}
                    </p>
                  </div>
                )}

                {success && (
                  <div className="rounded-xl bg-green-50 border border-green-200 p-4 mb-6">
                    <p className="text-sm text-green-600 flex items-center gap-2">
                      <svg
                        className="w-5 h-5 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {success}
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading || !url.trim()}
                  className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-sm hover:shadow-md transform hover:scale-[1.01] transition-all duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-sm flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="w-5 h-5 animate-spin"
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
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <>
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
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>Guardar URL</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Lista de Configuraciones */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 md:p-8 mt-6">
              <div className="mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  Configuraciones
                </h2>
                <p className="text-sm sm:text-base text-gray-600">
                  Lista de URLs configuradas para scraping
                </p>
              </div>

              {loadingConfigs ? (
                <div className="text-center py-8">
                  <svg
                    className="w-8 h-8 animate-spin mx-auto text-blue-600"
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
                  <p className="mt-4 text-gray-600">
                    Cargando configuraciones...
                  </p>
                </div>
              ) : configs.length === 0 ? (
                <div className="text-center py-8">
                  <svg
                    className="w-16 h-16 mx-auto text-gray-400 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                  <p className="text-gray-600">No hay configuraciones aún</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Agrega una URL arriba para comenzar
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {configs.map((config) => (
                    <div
                      key={config.id}
                      className="border border-gray-200 rounded-xl p-4 sm:p-5 hover:border-gray-300 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                            <h3 className="text-sm sm:text-base font-semibold text-gray-900 break-all sm:truncate">
                              {config.url}
                            </h3>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium border self-start ${getStatusColor(
                                config.status
                              )}`}
                            >
                              {getStatusText(config.status)}
                            </span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <svg
                                className="w-4 h-4 flex-shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                                />
                              </svg>
                              ID: {config.id}
                            </span>
                            <span>
                              {new Date(config.created_at).toLocaleDateString(
                                "es-ES",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </span>
                          </div>
                          {config.status === "failed" && (
                            <p className="mt-2 text-xs sm:text-sm text-red-600 break-words">
                              Error al procesar la configuración
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => handleStartScraping(config.id)}
                          disabled={
                            isScrapingLoading[config.id] ||
                            config.status === "processing" ||
                            config.status === "completed"
                          }
                          className="w-full sm:w-auto px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 sm:flex-shrink-0"
                        >
                          {isScrapingLoading[config.id] ? (
                            <>
                              <svg
                                className="w-4 h-4 animate-spin"
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
                              <span className="hidden sm:inline">
                                Iniciando...
                              </span>
                              <span className="sm:hidden">Iniciando</span>
                            </>
                          ) : (
                            <>
                              <svg
                                className="w-4 h-4 flex-shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M13 10V3L4 14h7v7l9-11h-7z"
                                />
                              </svg>
                              <span className="hidden sm:inline">
                                Iniciar Scraping
                              </span>
                              <span className="sm:hidden">Iniciar</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default ConfigPage;
