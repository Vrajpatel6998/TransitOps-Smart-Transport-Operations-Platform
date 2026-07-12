import React from 'react';
import { ActiveStatus } from '../../utils/types';

interface StatusBadgeProps {
  status: ActiveStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const isActive = status === 'active';
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all duration-200 ${
      isActive 
        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
        : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-400' : 'bg-slate-400'}`} />
      <span className="capitalize">{status}</span>
    </span>
  );
}
