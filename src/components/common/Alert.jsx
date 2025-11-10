import ErrorIcon from "../icons/ErrorIcon";
import SuccessIcon from "../icons/SuccessIcon";

function Alert({ type = "error", message }) {
  const styles = {
    error: {
      container: "rounded-xl bg-red-50 border border-red-200 p-4",
      text: "text-sm text-red-600",
    },
    success: {
      container: "rounded-xl bg-green-50 border border-green-200 p-4",
      text: "text-sm text-green-600",
    },
  };

  const Icon = type === "error" ? ErrorIcon : SuccessIcon;

  return (
    <div className={styles[type].container}>
      <p className={`${styles[type].text} flex items-center gap-2`}>
        <Icon className="w-5 h-5 flex-shrink-0" />
        {message}
      </p>
    </div>
  );
}

export default Alert;
