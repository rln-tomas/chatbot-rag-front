function UrlInput({ id, name, value, onChange, placeholder, disabled, label }) {
  return (
    <div className="mb-6">
      <label
        htmlFor={id}
        className="block text-base font-medium text-gray-700 mb-3"
      >
        {label}
      </label>
      <input
        id={id}
        name={name}
        type="url"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base disabled:bg-gray-100 disabled:cursor-not-allowed"
      />
    </div>
  );
}

export default UrlInput;
