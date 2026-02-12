import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, CreditCard, Calendar, Sparkles, Church } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/congregation', icon: Users, label: 'Data Jemaat' },
    { to: '/finance', icon: CreditCard, label: 'Keuangan' },
    { to: '/schedule', icon: Calendar, label: 'Jadwal & Kegiatan' },
    { to: '/ai-assistant', icon: Sparkles, label: 'AI Assistant' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden no-print">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex-shrink-0 flex flex-col shadow-xl">
        <div className="p-6 border-b border-slate-700 flex items-center space-x-3">
          <Church className="w-8 h-8 text-blue-400" />
          <div>
            <h1 className="text-lg font-bold leading-none">SIM-GEREJA</h1>
            <p className="text-xs text-slate-400 mt-1">Sistem Terintegrasi</p>
          </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-slate-700">
          <div className="text-xs text-slate-500 text-center">
            &copy; 2024 SIM-GEREJA Terintegrasi
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10 p-4 flex justify-between items-center h-16 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800">Sistem Informasi Manajemen Gereja</h2>
          <div className="flex items-center space-x-3">
            <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-700">Administrator</p>
                <p className="text-xs text-slate-500">Majelis Jemaat</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold shadow-sm">
              A
            </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-auto p-6 bg-slate-50">
          <div className="max-w-7xl mx-auto space-y-6 pb-10">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;