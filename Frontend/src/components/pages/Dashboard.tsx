import React from 'react';
import { useGetData } from '../../hooks/useGetData';
import { apiUrls } from '../../utils/api/apiUrl';
import { DashboardKPIs } from '../../utils/types';
import { 
  Truck, 
  Users, 
  Wrench, 
  Fuel, 
  DollarSign, 
  Percent, 
  Activity, 
  AlertCircle 
} from 'lucide-react';

export function Dashboard() {
  const { data: kpis, loading, error } = useGetData<DashboardKPIs>(apiUrls.dashboardKPIs);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !kpis) {
    return (
      <div className="p-6 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center gap-3">
        <AlertCircle className="w-6 h-6" />
        <span>Failed to load dashboard metrics: {error}</span>
      </div>
    );
  }

  const statCards = [
    { name: 'Active Vehicles', value: kpis.activeVehicles, icon: Truck, color: 'from-emerald-500 to-teal-500' },
    { name: 'Vehicles Available', value: kpis.availableVehicles, icon: Truck, color: 'from-blue-500 to-indigo-500' },
    { name: 'Active Drivers', value: kpis.activeDrivers, icon: Users, color: 'from-amber-500 to-orange-500' },
    { name: 'In Shop (Maintenance)', value: kpis.vehiclesInMaintenance, icon: Wrench, color: 'from-rose-500 to-pink-500' },
    { name: 'Total Fuel Liters', value: `${kpis.totalLiters.toLocaleString()} L`, icon: Fuel, color: 'from-cyan-500 to-blue-500' },
    { name: 'Total Fuel Cost', value: `$${kpis.totalFuelCost.toLocaleString()}`, icon: DollarSign, color: 'from-emerald-500 to-green-500' },
    { name: 'General Expenses', value: `$${kpis.totalExpenses.toLocaleString()}`, icon: DollarSign, color: 'from-violet-500 to-purple-500' },
    { name: 'Total Operations Cost', value: `$${(kpis.totalFuelCost + kpis.totalExpenses).toLocaleString()}`, icon: DollarSign, color: 'from-fuchsia-500 to-pink-500' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div 
              key={idx}
              className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 relative overflow-hidden group hover:border-slate-700/80 transition-all duration-300 shadow-lg shadow-slate-950/20 hover:shadow-slate-950/40"
            >
              {/* Decorative side gradient glow */}
              <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${stat.color}`} />
              
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-slate-400 tracking-wide uppercase">{stat.name}</p>
                  <p className="text-2xl font-bold text-slate-100 mt-2 tracking-tight">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${stat.color} flex items-center justify-center text-slate-950 shadow-md transition-transform duration-300 group-hover:scale-110`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Operational Highlights Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-400" />
          <span>Fleet Overview</span>
        </h3>
        <p className="text-slate-400 text-sm leading-relaxed">
          TransitOps provides real-time tracking of operational metrics. The summary cards above show active resources, fuel expenses, maintenance schedules, and operational overheads directly from the PostgreSQL backend. 
          Use the navigation links in the sidebar to review detailed records, register new assets, manage active drivers, log fuel receipts, and track operational overheads.
        </p>
      </div>
    </div>
  );
}
