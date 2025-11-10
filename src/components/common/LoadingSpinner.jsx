import SpinnerIcon from "../icons/SpinnerIcon";

function LoadingSpinner({ message, size = "default" }) {
  const sizeClasses = {
    small: "w-4 h-4",
    default: "w-8 h-8",
    large: "w-12 h-12",
  };

  return (
    <div className="text-center py-8">
      <SpinnerIcon
        className={`${sizeClasses[size]} animate-spin mx-auto text-blue-600`}
      />
      {message && <p className="mt-4 text-gray-600">{message}</p>}
    </div>
  );
}

export default LoadingSpinner;
