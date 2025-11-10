import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import useAuthStore from "../store/authStore";
import configService from "../services/configService";
import AppSidebar from "../components/sidebar/AppSidebar";
import ToggleSwitch from "../components/common/ToggleSwitch";
import UrlForm from "../components/config/UrlForm";
import ConfigList from "../components/config/ConfigList";
import ChatIcon from "../components/icons/ChatIcon";
import LinkIcon from "../components/icons/LinkIcon";
import MenuIcon from "../components/icons/MenuIcon";

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

  return (
    <div className="flex h-screen bg-gray-50">
      <AppSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        user={user}
        onLogout={handleLogout}
        headerButton={
          <button
            onClick={() => navigate("/chat")}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            <ChatIcon />
            <span className="text-sm font-medium">Ir al Chat</span>
          </button>
        }
        navigationItems={
          <>
            <div className="px-3 py-2 text-gray-400 text-xs font-semibold uppercase tracking-wider">
              Configuración
            </div>
            <button className="w-full px-4 py-3 text-left text-sm rounded-lg bg-gray-800 text-white transition-colors">
              <div className="flex items-center gap-3">
                <LinkIcon />
                <span className="font-medium">URLs para RAG</span>
              </div>
            </button>
          </>
        }
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

              <ToggleSwitch
                enabled={useStreaming}
                onChange={() => setUseStreaming(!useStreaming)}
                label="Modo de respuesta"
                description={
                  useStreaming
                    ? "Streaming: Las respuestas se muestran en tiempo real mientras se generan"
                    : "Normal: Las respuestas se muestran completas al finalizar"
                }
              />
            </div>

            {/* URL Form */}
            <UrlForm
              url={url}
              setUrl={setUrl}
              onSubmit={handleSubmit}
              isLoading={isLoading}
              error={error}
              success={success}
            />

            {/* Config List */}
            <ConfigList
              configs={configs}
              isLoading={loadingConfigs}
              loadingStates={isScrapingLoading}
              onStartScraping={handleStartScraping}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

export default ConfigPage;
