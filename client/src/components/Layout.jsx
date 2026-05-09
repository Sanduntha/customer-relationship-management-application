import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { HiOutlineViewGrid, HiOutlineUsers, HiOutlinePlusCircle, HiOutlineLogout, HiOutlineMenu, HiOutlineSearch, HiOutlineBell, HiOutlineSun, HiOutlineMoon } from 'react-icons/hi';

const Layout = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [headerSearch, setHeaderSearch] = useState('');

  const handleHeaderSearch = (e) => {
    if (e.key === 'Enter' && headerSearch.trim()) {
      navigate(`/leads?search=${encodeURIComponent(headerSearch.trim())}`);
      setHeaderSearch('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/dashboard', icon: HiOutlineViewGrid, label: 'Dashboard' },
    { to: '/leads', icon: HiOutlineUsers, label: 'Lead Pipeline' },
    { to: '/leads/new', icon: HiOutlinePlusCircle, label: 'Create Lead' },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#1e293b]"> {/* slate-800 for sidebar */}
      {/* Brand */}
      <div className="px-6 py-6 shrink-0 flex items-center gap-3 border-b border-slate-700/50">
        <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-sm">
          LF
        </div>
        <div>
          <h1 className="text-lg font-bold text-white leading-tight">LeadFlow</h1>
          <p className="text-xs font-medium text-slate-400">Enterprise CRM</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto custom-scrollbar">
        <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Menu</p>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                ? 'bg-blue-600/10 text-blue-400'
                : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
              }`
            }
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Card */}
      <div className="p-4 bg-slate-900/50 border-t border-slate-700/50 shrink-0">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
            style={{ backgroundColor: user?.avatar_color || '#3b82f6' }}
          >
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <HiOutlineLogout className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 text-gray-900 font-sans">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Desktop Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 transform transition-transform duration-200 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 shrink-0 flex items-center justify-between px-6 bg-white border-b border-gray-200">
          <div className="flex items-center gap-4 flex-1">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 -ml-2 rounded-md text-gray-500 hover:bg-gray-100">
              <HiOutlineMenu className="w-6 h-6" />
            </button>
            <div className="hidden md:flex items-center gap-2 max-w-md w-full bg-gray-100 px-3 py-2 rounded-lg border border-transparent focus-within:bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
              <HiOutlineSearch className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search leads..."
                value={headerSearch}
                onChange={(e) => setHeaderSearch(e.target.value)}
                onKeyDown={handleHeaderSearch}
                className="bg-transparent border-none text-sm text-gray-900 w-full focus:outline-none placeholder:text-gray-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-md text-gray-500 hover:bg-gray-100 transition-colors"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? <HiOutlineSun className="w-5 h-5 text-amber-400" /> : <HiOutlineMoon className="w-5 h-5" />}
            </button>
            <button className="p-2 rounded-md text-gray-500 hover:bg-gray-100 relative" title="Notifications coming soon">
              <HiOutlineBell className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
