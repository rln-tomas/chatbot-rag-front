import Avatar from "../common/Avatar";
import SuggestionCard from "./SuggestionCard";

function WelcomeScreen({ userName }) {
  return (
    <div className="h-full flex items-center justify-center p-6">
      <div className="text-center max-w-2xl">
        <div className="inline-flex items-center justify-center w-20 h-20 mb-6">
          <Avatar type="bot" size="large" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          ¡Hola, {userName}!
        </h2>
        <p className="text-gray-600 mb-8 text-base">
          ¿En qué puedo ayudarte hoy?
        </p>
      </div>
    </div>
  );
}

export default WelcomeScreen;
