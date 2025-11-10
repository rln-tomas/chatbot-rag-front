import { useEffect, useState, useRef } from "react";
import ReactMarkdown from "react-markdown";

/**
 * Componente que muestra texto con animación de "typing" durante el streaming
 * Simula el efecto de escritura carácter por carácter como ChatGPT
 * Soporta renderizado de Markdown
 */
function StreamingText({ text, isStreaming }) {
  const [displayText, setDisplayText] = useState("");
  const [targetText, setTargetText] = useState("");
  const animationFrameRef = useRef(null);
  const lastUpdateTimeRef = useRef(Date.now());

  useEffect(() => {
    // Actualizar el texto objetivo cuando cambia el texto entrante
    setTargetText(text);
  }, [text]);

  useEffect(() => {
    // Función de animación que actualiza el texto mostrado carácter por carácter
    const animateText = () => {
      const now = Date.now();
      const timeSinceLastUpdate = now - lastUpdateTimeRef.current;

      // Actualizar cada 20ms aproximadamente para un efecto suave y rápido
      if (timeSinceLastUpdate >= 20 && displayText.length < targetText.length) {
        // Calcular cuántos caracteres añadir (1-3 para hacer más natural)
        const charsToAdd = Math.min(
          Math.ceil(Math.random() * 2) + 1,
          targetText.length - displayText.length
        );

        setDisplayText(
          targetText.substring(0, displayText.length + charsToAdd)
        );
        lastUpdateTimeRef.current = now;
      }

      // Continuar la animación si aún hay texto por mostrar
      if (displayText.length < targetText.length) {
        animationFrameRef.current = requestAnimationFrame(animateText);
      }
    };

    // Si el texto objetivo es más largo, iniciar la animación
    if (targetText.length > displayText.length) {
      animationFrameRef.current = requestAnimationFrame(animateText);
    }
    // Si el texto objetivo cambió completamente (nuevo mensaje), resetear
    else if (targetText.length < displayText.length) {
      setDisplayText(targetText);
    }

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [targetText, displayText]);

  return (
    <span className="inline markdown-content">
      <ReactMarkdown
        components={{
          // Personalizar componentes de markdown para estilos inline
          p: ({ children }) => <span className="block mb-2">{children}</span>,
          strong: ({ children }) => <strong className="font-bold">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
          code: ({ inline, children }) => 
            inline ? (
              <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-red-600">
                {children}
              </code>
            ) : (
              <code className="block bg-gray-100 p-2 rounded text-sm font-mono overflow-x-auto my-2">
                {children}
              </code>
            ),
          pre: ({ children }) => <pre className="my-2">{children}</pre>,
          ul: ({ children }) => <ul className="list-disc list-inside my-2">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-inside my-2">{children}</ol>,
          li: ({ children }) => <li className="ml-2">{children}</li>,
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              {children}
            </a>
          ),
          h1: ({ children }) => <h1 className="text-2xl font-bold my-2">{children}</h1>,
          h2: ({ children }) => <h2 className="text-xl font-bold my-2">{children}</h2>,
          h3: ({ children }) => <h3 className="text-lg font-bold my-2">{children}</h3>,
        }}
      >
        {displayText}
      </ReactMarkdown>
      {/* Cursor parpadeante mientras está escribiendo */}
      {isStreaming && displayText.length > 0 && (
        <span className="inline-block w-0.5 h-5 bg-blue-500 ml-1 animate-blink align-middle"></span>
      )}
      {/* Indicador de espera cuando aún no hay texto */}
      {isStreaming && displayText.length === 0 && (
        <span className="inline-flex gap-1">
          <span
            className="inline-block w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          ></span>
          <span
            className="inline-block w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          ></span>
          <span
            className="inline-block w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          ></span>
        </span>
      )}
    </span>
  );
}

export default StreamingText;
