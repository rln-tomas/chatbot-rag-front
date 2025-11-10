import EmptyBoxIcon from "../icons/EmptyBoxIcon";

function EmptyState({ title, description, icon }) {
  const IconComponent = icon || EmptyBoxIcon;

  return (
    <div className="text-center py-8">
      <IconComponent className="w-16 h-16 mx-auto text-gray-400 mb-4" />
      <p className="text-gray-600">{title}</p>
      {description && <p className="text-sm text-gray-500 mt-2">{description}</p>}
    </div>
  );
}

export default EmptyState;
