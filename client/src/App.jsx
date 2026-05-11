import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, History as HistoryIcon, Settings as SettingsIcon, Heart } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import Settings from './pages/Settings';
import { clsx } from 'clsx';

const NavLink = ({ to, icon: Icon, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={clsx(
        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
        isActive 
          ? "bg-pink-50 text-pink-600 font-bold shadow-sm shadow-pink-100" 
          : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
      )}
    >
      <Icon size={20} className={clsx(isActive ? "text-pink-600" : "text-gray-400 group-hover:text-gray-600")} />
      <span>{children}</span>
    </Link>
  );
};

function App() {
  return (
    <Router basename="/daily-love-note">
      <div className="min-h-screen bg-[#F8F9FD] flex flex-col md:flex-row font-sans text-gray-900">
        <Toaster position="top-right" />
        
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-gray-100 p-6 flex flex-col shrink-0">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-pink-200">
              <Heart size={24} fill="currentColor" />
            </div>
            <div>
              <h1 className="font-black text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-rose-600">
                Daily Love
              </h1>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Automation</p>
            </div>
          </div>

          <nav className="space-y-2 flex-1">
            <NavLink to="/" icon={LayoutDashboard}>Dashboard</NavLink>
            <NavLink to="/history" icon={HistoryIcon}>History</NavLink>
            <NavLink to="/settings" icon={SettingsIcon}>Settings</NavLink>
          </nav>

          <div className="mt-auto pt-6 border-t border-gray-50 px-2">
            <p className="text-[10px] text-gray-400 font-medium">Built with ❤️ by Sahed</p>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-10 max-w-6xl overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/history" element={<History />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
