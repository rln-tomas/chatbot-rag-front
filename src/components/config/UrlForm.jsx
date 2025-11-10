import Alert from "../common/Alert";
import UrlInput from "../forms/UrlInput";
import CheckIcon from "../icons/CheckIcon";
import SpinnerIcon from "../icons/SpinnerIcon";

function UrlForm({ url, setUrl, onSubmit, isLoading, error, success }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Agregar URL para RAG
        </h2>
        <p className="text-gray-600">
          Ingresa una URL para realizar scraping y agregar contenido a la base
          de conocimiento.
        </p>
      </div>

      <form onSubmit={onSubmit}>
        <UrlInput
          id="url"
          name="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://ejemplo.com"
          disabled={isLoading}
          label="URL"
        />

        {error && <Alert type="error" message={error} />}
        {success && <Alert type="success" message={success} />}

        {(error || success) && <div className="mb-6" />}

        <button
          type="submit"
          disabled={isLoading || !url.trim()}
          className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-sm hover:shadow-md transform hover:scale-[1.01] transition-all duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-sm flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <SpinnerIcon className="w-5 h-5 animate-spin" />
              <span>Guardando...</span>
            </>
          ) : (
            <>
              <CheckIcon />
              <span>Guardar URL</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default UrlForm;
