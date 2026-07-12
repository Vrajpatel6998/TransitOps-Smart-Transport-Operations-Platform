/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, Truck, Users, Navigation, Wrench, Fuel, BarChart3, Settings, 
  LogOut, Menu, X, User as UserIcon
} from 'lucide-react';

interface PageLayoutProps {
  id?: string;
  children: React.ReactNode;
  activePath: string;
  onNavigate: (path: string) => void;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  id,
  children,
  activePath,
  onNavigate,
}) => {
  const { user, logout, canAccess } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Define sidebar navigation links and required feature guard keys
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, feature: 'dashboard' },
    { name: 'Vehicles', path: '/vehicles', icon: Truck, feature: 'vehicles_view' },
    { name: 'Drivers', path: '/drivers', icon: Users, feature: 'drivers_view' },
    { name: 'Trips & Dispatch', path: '/trips', icon: Navigation, feature: 'trips_view' },
    { name: 'Maintenance', path: '/maintenance', icon: Wrench, feature: 'maintenance' },
    { name: 'Fuel & Expenses', path: '/fuel-expenses', icon: Fuel, feature: 'fuel_expenses_view' },
    { name: 'Reports', path: '/reports', icon: BarChart3, feature: 'reports' },
    { name: 'User Admin', path: '/settings', icon: Settings, feature: 'settings' },
  ];

  const filteredNavItems = navItems.filter(item => canAccess(item.feature));

  const handleNavClick = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <div id={id} className="min-h-screen flex flex-col md:flex-row bg-slate-50/50">
      
      {/* --- Sidebar (Desktop) --- */}
      <aside className="hidden md:flex flex-col w-60 bg-slate-900 text-slate-100 shrink-0 border-r border-slate-800">
        {/* Logo / Brand */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-800 bg-slate-950/40">
          <div className="w-8 h-8 bg-teal-500 rounded flex items-center justify-center shadow-sm shadow-teal-500/20">
            <Truck className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="font-bold text-base tracking-tight text-white">Transit<span className="text-teal-400">Ops</span></span>
        </div>

        {/* Nav list */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePath === item.path;
            return (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2 rounded-md text-xs font-semibold transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-teal-600/15 text-teal-400 border-l-4 border-teal-500 rounded-r-md shadow-2xs'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                {item.name}
              </button>
            );
          })}
        </nav>

        {/* User profile & Logout footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/20">
          <div className="flex items-center gap-2.5 px-2 py-1.5">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 text-teal-400 font-bold shrink-0 text-xs">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate leading-none">{user?.name}</p>
              <p className="text-[10px] text-slate-500 truncate mt-0.5">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="mt-3 w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded bg-slate-800/40 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-900/30 transition-all cursor-pointer text-xs font-bold"
          >
            <LogOut className="w-3 h-3" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* --- Mobile Top Navigation Header --- */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-slate-900 text-slate-100 border-b border-slate-800 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-teal-500 rounded flex items-center justify-center">
            <Truck className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-sm tracking-tight text-white">TransitOps</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1 rounded-md text-slate-400 hover:text-white bg-slate-800 cursor-pointer"
        >
          {mobileMenuOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
        </button>
      </header>

      {/* --- Mobile Navigation Dropdown Overlay --- */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-slate-900 text-slate-100 flex flex-col pt-14">
          <nav className="flex-1 px-5 py-6 space-y-1.5 overflow-y-auto">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePath === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavClick(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-teal-600/15 text-teal-400 border-l-4 border-teal-500 rounded-r-lg'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4.5 h-4.5 shrink-0" />
                  {item.name}
                </button>
              );
            })}
          </nav>
          <div className="p-5 border-t border-slate-800 bg-slate-950/40">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 text-teal-400 font-bold shrink-0 text-sm">
                {user?.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-xs font-bold text-white">{user?.name}</p>
                <p className="text-[10px] text-slate-400">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      )}

      {/* --- Main Content Scaffold --- */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Desktop Top Header Bar */}
        <header className="hidden md:flex items-center justify-between px-6 py-3 bg-white border-b border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Platform</span>
            <span className="text-slate-300 text-xs">/</span>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              {filteredNavItems.find(item => item.path === activePath)?.name || 'Dashboard'}
            </h2>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100/60 px-2.5 py-0.5 rounded">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] font-bold text-emerald-800 tracking-wider">SYS CONNECTED</span>
            </div>
            <div className="h-6 w-px bg-slate-200" />
            <div className="flex items-center gap-2.5">
              <div className="text-right">
                <span className="block text-xs font-bold text-slate-800 leading-none">{user?.name}</span>
                <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mt-1">{user?.role}</span>
              </div>
              <div className="w-8 h-8 rounded bg-teal-50 border border-teal-100/60 flex items-center justify-center text-teal-700 font-bold shrink-0 text-xs">
                {user?.name.slice(0, 2).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Content Body Pane */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>

    </div>
  );
};

export default PageLayout;
