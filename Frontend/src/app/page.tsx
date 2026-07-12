"use client";

import React from 'react';
import { useGlobalState, store } from '../store';
import { Sidebar } from '../components/shared/Sidebar';
import { Navbar } from '../components/shared/Navbar';
import { Login } from '../components/pages/Login';
import { Dashboard } from '../components/pages/Dashboard';
import { Vehicles } from '../components/pages/Vehicles';
import { Drivers } from '../components/pages/Drivers';
import { Maintenance } from '../components/pages/Maintenance';
import { FuelLogs } from '../components/pages/FuelLogs';
import { Expenses } from '../components/pages/Expenses';
import { Settings } from '../components/pages/Settings';

export default function Home() {
  const { isAuthenticated, activeTab } = useGlobalState();

  if (!isAuthenticated) {
    return <Login />;
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'vehicles':
        return <Vehicles />;
      case 'drivers':
        return <Drivers />;
      case 'maintenance':
        return <Maintenance />;
      case 'fuelLogs':
        return <FuelLogs />;
      case 'expenses':
        return <Expenses />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden text-slate-100 font-sans">
      {/* Sidebar */}
      <Sidebar 
        currentTab={activeTab} 
        onTabChange={(tab) => store.setActiveTab(tab)} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-950">
        <Navbar currentTab={activeTab} />
        
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            {renderActiveView()}
          </div>
        </main>
      </div>
    </div>
  );
}
