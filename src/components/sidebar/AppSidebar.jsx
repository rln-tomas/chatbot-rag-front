import UserSection from "./UserSection";

function AppSidebar({
  isOpen,
  onClose,
  user,
  onLogout,
  headerButton,
  navigationItems,
  children,
}) {
  return (
    <>
      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-72 bg-gray-900 border-r border-gray-800 transition-transform duration-300 ease-in-out flex flex-col`}
      >
        {/* Sidebar Header */}
        {headerButton && (
          <div className="p-5 border-b border-gray-800">{headerButton}</div>
        )}

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-5">
          {navigationItems && (
            <div className="space-y-3">{navigationItems}</div>
          )}
          {children}
        </div>

        {/* User Section */}
        {user && <UserSection user={user} onLogout={onLogout} />}
      </aside>

      {/* Overlay para mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
    </>
  );
}

export default AppSidebar;
