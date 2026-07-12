import React from 'react';
import { 
  LayoutDashboard, 
  Truck, 
  Users, 
  Wrench, 
  Fuel, 
  DollarSign, 
  Settings, 
  LogOut 
} from 'lucide-react';
import { store, useGlobalState } from '../../store';

interface SidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export function Sidebar({ currentTab, onTabChange }: SidebarProps) {
  const { user } = useGlobalState();

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, roles: ['Admin', 'FleetManager', 'Driver', 'SafetyOfficer', 'FinancialAnalyst'] },
    { id: 'vehicles', name: 'Vehicles', icon: Truck, roles: ['Admin', 'FleetManager', 'Driver', 'SafetyOfficer', 'FinancialAnalyst'] },
    { id: 'drivers', name: 'Drivers', icon: Users, roles: ['Admin', 'FleetManager', 'SafetyOfficer'] },
    { id: 'maintenance', name: 'Maintenance', icon: Wrench, roles: ['Admin', 'FleetManager'] },
    { id: 'fuelLogs', name: 'Fuel Logs', icon: Fuel, roles: ['Admin', 'FleetManager', 'Driver', 'FinancialAnalyst'] },
    { id: 'expenses', name: 'Expenses', icon: DollarSign, roles: ['Admin', 'FleetManager', 'FinancialAnalyst'] },
    { id: 'settings', name: 'Settings', icon: Settings, roles: ['Admin'] },
  ];

  const allowedItems = menuItems.filter(item => !user || item.roles.includes(user.role));

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col h-full z-20 transition-all duration-300">
      <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-950/40">
        <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent tracking-wider">
          TransitOps
        </span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {allowedItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive 
                  ? 'bg-gradient-to-r from-emerald-500/10 to-teal-500/10 text-emerald-400 border border-emerald-500/20 shadow-md shadow-emerald-950/10' 
                  : 'hover:bg-slate-800/60 hover:text-slate-100 border border-transparent'
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-300'
              }`} />
              <span>{item.name}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800 bg-slate-950/30">
        <button
          onClick={() => store.logout()}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
