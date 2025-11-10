function SuggestionCard({ title, description, onClick }) {
  return (
    <button
      onClick={onClick}
      className="p-5 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all text-left"
    >
      <p className="text-sm font-medium text-gray-900 mb-1">{title}</p>
      <p className="text-xs text-gray-500">{description}</p>
    </button>
  );
}

export default SuggestionCard;
