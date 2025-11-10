function StatusBadge({ status }) {
  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      processing: "bg-blue-100 text-blue-800 border-blue-200",
      completed: "bg-green-100 text-green-800 border-green-200",
      failed: "bg-red-100 text-red-800 border-red-200",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getStatusText = (status) => {
    const texts = {
      pending: "Pendiente",
      processing: "Procesando",
      completed: "Completado",
      failed: "Fallido",
    };
    return texts[status] || status;
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium border self-start ${getStatusColor(
        status
      )}`}
    >
      {getStatusText(status)}
    </span>
  );
}

export default StatusBadge;
