
import React, { useState, ReactNode } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import { BarChart2, Coins, Target, Menu, X, Users, LogOut, TrendingUp, CandlestickChart, Settings } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

const NavItem: React.FC<{ to: string; icon: ReactNode; label: string; onClick?: () => void }> = ({ to, icon, label, onClick }) => (
  <li>
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center p-3 rounded-lg text-slate-200 hover:bg-slate-700 transition-colors ${
          isActive ? 'bg-primary-600 text-white shadow-inner' : ''
        }`
      }
    >
      {icon}
      <span className="ml-4 font-medium">{label}</span>
    </NavLink>
  </li>
);

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, switchUser, setUser } = useUser();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const otherUser = user?.username === 'Ash' ? 'Anb' : 'Ash';

  const handleSwitchUser = () => {
      switchUser();
      setSidebarOpen(false);
  }

  const handleLogout = () => {
      setUser(null);
  }

  const sidebarContent = (
    <>
        <div className="p-4 border-b border-slate-700">
            <Link to="/dashboard" className="flex items-center text-white" onClick={() => setSidebarOpen(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-primary-400">
                    <path d="M12.378 1.602a.75.75 0 00-.756 0L3 6.632l9 5.25 9-5.25-8.622-5.03zM21.75 7.93l-9 5.25v9l8.628-5.032a.75.75 0 00.372-.648V7.93zM11.25 22.18v-9l-9-5.25v8.57a.75.75 0 00.372.648l8.628 5.032z" />
                </svg>
                <h1 className="text-2xl font-bold ml-2">Nexus</h1>
            </Link>
        </div>
        <nav className="flex-grow p-4">
            <ul className="space-y-2">
                <NavItem to="/dashboard" icon={<BarChart2 size={20} />} label="Dashboard" onClick={() => setSidebarOpen(false)} />
                <NavItem to="/my-expenses" icon={<Coins size={20} />} label="My Expenses" onClick={() => setSidebarOpen(false)} />
                <NavItem to="/shared-expenses" icon={<Users size={20} />} label="Shared Expenses" onClick={() => setSidebarOpen(false)} />
                <NavItem to="/my-investments" icon={<TrendingUp size={20} />} label="My Investments" onClick={() => setSidebarOpen(false)} />
                <NavItem to="/shared-investments" icon={<CandlestickChart size={20} />} label="Shared Investments" onClick={() => setSidebarOpen(false)} />
                <NavItem to="/goals" icon={<Target size={20} />} label="Goals & Reminders" onClick={() => setSidebarOpen(false)} />
            </ul>
        </nav>
        <div className="p-4 border-t border-slate-700 space-y-3">
             <NavItem to="/settings" icon={<Settings size={20} />} label="Settings" onClick={() => setSidebarOpen(false)} />
             <button onClick={handleSwitchUser} className="w-full flex items-center p-3 rounded-lg text-slate-200 hover:bg-slate-700 transition-colors">
                <Users size={20} />
                <span className="ml-4 font-medium">Switch to {otherUser}</span>
            </button>
            <button onClick={handleLogout} className="w-full flex items-center p-3 rounded-lg text-slate-200 hover:bg-slate-700 transition-colors">
                <LogOut size={20} />
                <span className="ml-4 font-medium">Logout</span>
            </button>
        </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
      {/* Static sidebar for larger screens */}
      <aside className="w-64 bg-slate-800 text-white flex-col hidden lg:flex">
          {sidebarContent}
      </aside>

      {/* Mobile sidebar */}
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden ${isSidebarOpen ? 'block' : 'hidden'}`} onClick={() => setSidebarOpen(false)}></div>
      <aside className={`fixed top-0 left-0 h-full w-64 bg-slate-800 text-white flex flex-col z-40 transform transition-transform duration-300 ease-in-out lg:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          {sidebarContent}
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-white dark:bg-slate-800 shadow-md p-4 flex items-center justify-between lg:justify-end">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-600 dark:text-slate-300">
            <Menu size={24} />
          </button>
          <div className="flex items-center space-x-4">
            <span className="font-semibold">Welcome, {user?.username}</span>
            <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold text-lg">
              {user?.username.charAt(0)}
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
