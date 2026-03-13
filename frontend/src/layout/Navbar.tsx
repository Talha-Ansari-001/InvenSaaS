import React from 'react';
import { HiMenuAlt2, HiOutlineLogout, HiOutlineUserCircle } from 'react-icons/hi';
import { useAuth } from '../hooks/useAuth';

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <div className="flex items-center">
        <button 
          className="lg:hidden text-gray-500 hover:text-gray-900" 
          onClick={toggleSidebar}
        >
          <HiMenuAlt2 className="h-6 w-6" />
        </button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 border-r pr-4">
          <HiOutlineUserCircle className="h-6 w-6 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">{user?.username}</span>
          <span className="rounded bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-800">
            {user?.role}
          </span>
        </div>

        <button 
          onClick={logout}
          className="flex items-center space-x-2 text-sm font-medium text-gray-500 hover:text-red-600"
        >
          <HiOutlineLogout className="h-5 w-5" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
