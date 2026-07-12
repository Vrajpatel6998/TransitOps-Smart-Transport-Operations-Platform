/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  canAccess: (feature: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Global RBAC capability mapping for user roles and features.
 */
export function checkRoleAccess(role: UserRole, feature: string): boolean {
  if (role === 'Admin') return true; // Admins have absolute access to all features

  switch (feature) {
    case 'settings':
    case 'users_manage':
      return false; // Admin only

    case 'reports':
    case 'vehicle_analytics':
      return ['FleetManager', 'FinancialAnalyst'].includes(role);

    case 'maintenance':
    case 'maintenance_edit':
      return ['FleetManager', 'SafetyOfficer'].includes(role);

    case 'dispatch_trip':
    case 'cancel_trip':
    case 'create_trip':
      return ['FleetManager'].includes(role);

    case 'complete_trip':
      return ['FleetManager', 'Driver'].includes(role);

    case 'edit_drivers':
    case 'update_safety_score':
      return ['FleetManager', 'SafetyOfficer'].includes(role);

    case 'edit_vehicles':
      return ['FleetManager'].includes(role);

    case 'add_expense':
      return ['FleetManager', 'FinancialAnalyst'].includes(role);

    case 'add_fuel':
      return ['FleetManager', 'Driver', 'FinancialAnalyst'].includes(role);

    case 'drivers_view':
      return ['FleetManager', 'SafetyOfficer', 'Driver', 'FinancialAnalyst'].includes(role);

    case 'vehicles_view':
      return ['FleetManager', 'SafetyOfficer', 'Driver', 'FinancialAnalyst'].includes(role);

    case 'trips_view':
      return ['FleetManager', 'SafetyOfficer', 'Driver'].includes(role);

    case 'fuel_expenses_view':
      return ['FleetManager', 'Driver', 'FinancialAnalyst'].includes(role);

    default:
      return true; // Base dashboards, KPI view, user profile
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore session on component mount
    const savedToken = localStorage.getItem('transitops_token');
    const savedUser = localStorage.getItem('transitops_user');
    
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse saved user credentials', e);
        localStorage.removeItem('transitops_token');
        localStorage.removeItem('transitops_user');
      }
    }
    setLoading(false);
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('transitops_token', newToken);
    localStorage.setItem('transitops_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('transitops_token');
    localStorage.removeItem('transitops_user');
    window.location.pathname = '/login';
  };

  const canAccess = (feature: string): boolean => {
    if (!user) return false;
    return checkRoleAccess(user.role, feature);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, canAccess }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
