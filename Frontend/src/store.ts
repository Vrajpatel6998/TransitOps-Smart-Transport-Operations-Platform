import { useState, useEffect } from 'react';
import { User } from './utils/types';

// Simple pub-sub store implementation for global auth state
type Listener = (state: StoreState) => void;

interface StoreState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  activeTab: string;
}

let globalState: StoreState = {
  user: null,
  token: null,
  isAuthenticated: false,
  activeTab: 'dashboard',
};

const listeners = new Set<Listener>();

function emit() {
  listeners.forEach(listener => listener({ ...globalState }));
}

export const store = {
  getState() {
    return { ...globalState };
  },
  
  setUser(user: User | null) {
    globalState.user = user;
    emit();
  },

  setToken(token: string | null) {
    globalState.token = token;
    globalState.isAuthenticated = !!token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('token', token);
      } else {
        localStorage.removeItem('token');
      }
    }
    emit();
  },

  setActiveTab(tab: string) {
    globalState.activeTab = tab;
    emit();
  },

  logout() {
    globalState.user = null;
    globalState.token = null;
    globalState.isAuthenticated = false;
    globalState.activeTab = 'dashboard';
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    emit();
  },

  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  initialize() {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      if (storedToken) {
        globalState.token = storedToken;
        globalState.isAuthenticated = true;
      }
      if (storedUser) {
        try {
          globalState.user = JSON.parse(storedUser);
        } catch {
          // ignore
        }
      }
      emit();
    }
  }
};

export function useGlobalState() {
  const [state, setState] = useState<StoreState>({ ...globalState });

  useEffect(() => {
    store.initialize();
    const unsubscribe = store.subscribe(setState);
    return unsubscribe;
  }, []);

  return state;
}
