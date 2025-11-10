import ChatIcon from "../icons/ChatIcon";

function Avatar({ type = "bot", email, size = "default" }) {
  const sizes = {
    small: "w-8 h-8",
    default: "w-10 h-10",
    large: "w-16 h-16",
  };

  const iconSizes = {
    small: "w-4 h-4",
    default: "w-6 h-6",
    large: "w-8 h-8",
  };

  const textSizes = {
    small: "text-sm",
    default: "text-base",
    large: "text-xl",
  };

  if (type === "bot") {
    return (
      <div
        className={`${sizes[size]} bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0`}
      >
        <ChatIcon className={`${iconSizes[size]} text-white`} />
      </div>
    );
  }

  return (
    <div
      className={`${sizes[size]} bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg flex items-center justify-center flex-shrink-0`}
    >
      <span className={`text-white ${textSizes[size]} font-semibold`}>
        {email?.[0]?.toUpperCase() || "U"}
      </span>
    </div>
  );
}

export default Avatar;
