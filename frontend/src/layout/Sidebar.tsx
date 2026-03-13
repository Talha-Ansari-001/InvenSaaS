import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  HiOutlineViewGrid, 
  HiOutlineCube, 
  HiOutlineClipboardList, 
  HiOutlineTruck, 
  HiOutlineUsers, 
  HiOutlineChartBar,
  HiX
} from 'react-icons/hi';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const navItems = [
    { name: 'Dashboard', icon: HiOutlineViewGrid, path: '/' },
    { name: 'Products', icon: HiOutlineCube, path: '/products' },
    { name: 'Inventory', icon: HiOutlineClipboardList, path: '/inventory' },
    { name: 'Orders', icon: HiOutlineTruck, path: '/orders' },
    { name: 'Suppliers', icon: HiOutlineTruck, path: '/suppliers' },
    { name: 'Users', icon: HiOutlineUsers, path: '/users' },
    { name: 'Reports', icon: HiOutlineChartBar, path: '/reports' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      <div 
        className={`fixed inset-0 z-20 bg-gray-900/50 transition-opacity lg:hidden ${isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        onClick={() => setIsOpen(false)}
      />

      <aside 
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-indigo-900 transition duration-300 lg:static lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-2 text-white">
            <HiOutlineCube className="h-8 w-8 text-indigo-400" />
            <span className="text-xl font-bold">InvenSaaS</span>
          </div>
          <button className="lg:hidden text-white" onClick={() => setIsOpen(false)}>
            <HiX className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-4 px-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => 
                `flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-indigo-800 text-white' 
                    : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
