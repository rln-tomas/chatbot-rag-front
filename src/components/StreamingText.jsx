import { useEffect, useState, useRef } from "react";

/**
 * Componente que muestra texto con animación de "typing" durante el streaming
 * Simula el efecto de escritura carácter por carácter como ChatGPT
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
    <span className="inline">
      {displayText}
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
