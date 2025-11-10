import StatusBadge from "../common/StatusBadge";
import TagIcon from "../icons/TagIcon";
import LightningIcon from "../icons/LightningIcon";
import SpinnerIcon from "../icons/SpinnerIcon";

function ConfigItem({ config, onStartScraping, isLoading }) {
  return (
    <div className="border border-gray-200 rounded-xl p-4 sm:p-5 hover:border-gray-300 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 break-all sm:truncate">
              {config.url}
            </h3>
            <StatusBadge status={config.status} />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <TagIcon className="w-4 h-4 flex-shrink-0" />
              ID: {config.id}
            </span>
            <span>
              {new Date(config.created_at).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
          {config.status === "failed" && (
            <p className="mt-2 text-xs sm:text-sm text-red-600 break-words">
              Error al procesar la configuración
            </p>
          )}
        </div>
        <button
          onClick={() => onStartScraping(config.id)}
          disabled={
            isLoading ||
            config.status === "processing" ||
            config.status === "completed"
          }
          className="w-full sm:w-auto px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 sm:flex-shrink-0"
        >
          {isLoading ? (
            <>
              <SpinnerIcon className="w-4 h-4 animate-spin" />
              <span className="hidden sm:inline">Iniciando...</span>
              <span className="sm:hidden">Iniciando</span>
            </>
          ) : (
            <>
              <LightningIcon className="w-4 h-4 flex-shrink-0" />
              <span className="hidden sm:inline">Iniciar Scraping</span>
              <span className="sm:hidden">Iniciar</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default ConfigItem;
