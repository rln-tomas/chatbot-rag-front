import LoadingSpinner from "../common/LoadingSpinner";
import EmptyState from "../common/EmptyState";
import ConfigItem from "./ConfigItem";

function ConfigList({
  configs,
  isLoading,
  loadingStates,
  onStartScraping,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 md:p-8 mt-6">
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Configuraciones
        </h2>
        <p className="text-sm sm:text-base text-gray-600">
          Lista de URLs configuradas para scraping
        </p>
      </div>

      {isLoading ? (
        <LoadingSpinner message="Cargando configuraciones..." />
      ) : configs.length === 0 ? (
        <EmptyState
          title="No hay configuraciones aún"
          description="Agrega una URL arriba para comenzar"
        />
      ) : (
        <div className="space-y-4">
          {configs.map((config) => (
            <ConfigItem
              key={config.id}
              config={config}
              onStartScraping={onStartScraping}
              isLoading={loadingStates[config.id]}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ConfigList;
