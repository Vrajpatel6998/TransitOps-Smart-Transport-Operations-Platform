import React from 'react';
import { useGlobalState } from '../../store';
import { User as UserIcon } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
}

export function Navbar({ currentTab }: NavbarProps) {
  const { user } = useGlobalState();

  const formatTitle = (tab: string) => {
    if (tab === 'fuelLogs') return 'Fuel Logs';
    return tab.charAt(0).toUpperCase() + tab.slice(1);
  };

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/60 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10">
      <h2 className="text-xl font-bold text-slate-100">{formatTitle(currentTab)}</h2>

      {user && (
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-semibold text-slate-200">{user.name}</p>
            <p className="text-xs font-medium text-slate-400">{user.email}</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-xs font-semibold text-emerald-400">
            <UserIcon className="w-3.5 h-3.5" />
            <span>{user.role}</span>
          </div>
        </div>
      )}
    </header>
  );
}
