/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PageLayout } from './components/PageLayout';

// Pages
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Vehicles } from './pages/Vehicles';
import { Drivers } from './pages/Drivers';
import { Trips } from './pages/Trips';
import { Maintenance } from './pages/Maintenance';
import { FuelExpenses } from './pages/FuelExpenses';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';

const RouterComponent: React.FC = () => {
  const { user, loading } = useAuth();
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    // Sync React state with browser history back/forward operations
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState(null, '', path);
    setCurrentPath(path);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 gap-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500" />
        <p className="text-sm font-semibold text-slate-400">Loading TransitOps platform...</p>
      </div>
    );
  }

  // Auth Guard redirect check
  const isAuthenticated = !!user;

  // Render Page Content mapping based on Path
  const renderPage = () => {
    // Public page
    if (currentPath === '/login' || !isAuthenticated) {
      return <Login onNavigate={navigateTo} />;
    }

    switch (currentPath) {
      case '/':
      case '/dashboard':
        return <Dashboard onNavigate={navigateTo} />;
      case '/vehicles':
        return <Vehicles />;
      case '/drivers':
        return <Drivers />;
      case '/trips':
        return <Trips />;
      case '/maintenance':
        return <Maintenance />;
      case '/fuel-expenses':
        return <FuelExpenses />;
      case '/reports':
        return <Reports />;
      case '/settings':
        return <Settings />;
      default:
        // Fallback
        return <Dashboard onNavigate={navigateTo} />;
    }
  };

  const isLoginPage = currentPath === '/login' || !isAuthenticated;

  if (isLoginPage) {
    return renderPage();
  }

  return (
    <PageLayout activePath={currentPath === '/' ? '/dashboard' : currentPath} onNavigate={navigateTo}>
      {renderPage()}
    </PageLayout>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <RouterComponent />
    </AuthProvider>
  );
}
