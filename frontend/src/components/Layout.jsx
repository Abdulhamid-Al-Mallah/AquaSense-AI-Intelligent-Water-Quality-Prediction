import React from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  FlaskConical,
  History,
  LogOut,
  ShieldCheck,
  User,
  Activity,
  Droplet
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/', label: 'Overview & Analytics', icon: LayoutDashboard, end: true },
    { to: '/analyze', label: 'Lab & What-If Simulator', icon: FlaskConical },
    { to: '/history', label: 'Audit Logs & Reports', icon: History }
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Deep Navy/Slate Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0 no-print">
        <div>
          {/* Logo & Header */}
          <div className="px-6 py-5 border-b border-slate-800 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
              <Droplet className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-white font-bold tracking-tight text-lg">AquaSense</span>
                <span className="text-sky-400 font-extrabold text-xs px-1.5 py-0.5 rounded bg-sky-950/60 border border-sky-800">AI</span>
              </div>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mt-0.5">Water Intelligence</p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1.5">
            <div className="px-3 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Operational Suite</div>
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-sky-600/15 text-sky-400 border border-sky-500/30 shadow-sm'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center space-x-3 mb-3 px-2">
            <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
              <User className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-200 truncate">{user?.name || 'Lab Analyst'}</p>
              <div className="flex items-center space-x-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <p className="text-[10px] text-slate-400 uppercase tracking-wide capitalize">{user?.role || 'analyst'}</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 py-2 px-3 text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg border border-transparent hover:border-rose-900/40 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Operational Bar */}
        <header className="h-14 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0 no-print">
          <div className="flex items-center space-x-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-semibold text-slate-600">Decision Engine: XGBoost Active (0.9738 F1)</span>
          </div>

          <div className="flex items-center space-x-4 text-xs text-slate-500">
            <div className="flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>WHO Standard Compliance Mode</span>
            </div>
            <span className="text-slate-300">|</span>
            <div className="flex items-center space-x-1.5">
              <Activity className="w-4 h-4 text-sky-600" />
              <span>API Gateway: Online</span>
            </div>
          </div>
        </header>

        {/* Dynamic Outlet */}
        <div className="p-8 flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
