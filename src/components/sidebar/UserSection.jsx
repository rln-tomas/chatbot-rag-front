import LogoutIcon from "../icons/LogoutIcon";

function UserSection({ user, onLogout }) {
  return (
    <div className="p-5 border-t border-gray-800">
      <div className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-800 transition-colors">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white text-base font-semibold">
            {user?.email?.[0]?.toUpperCase() || "U"}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">
            {user?.name || "Usuario"}
          </p>
          <p className="text-xs text-gray-400 truncate">{user?.email}</p>
        </div>
        <button
          onClick={onLogout}
          className="p-2 hover:bg-gray-700 rounded transition-colors"
          title="Cerrar sesión"
        >
          <LogoutIcon className="w-5 h-5 text-gray-400" />
        </button>
      </div>
    </div>
  );
}

export default UserSection;
