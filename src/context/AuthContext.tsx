'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType } from '@/types';
import Loading from '@/app/loading/page';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

let logoutCallback: () => void;

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Nuevo estado para controlar la carga

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false); // Terminamos de verificar el token
  }, []);

  const login = (token: string) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  logoutCallback = logout;

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {!loading ? children : <Loading></Loading>} {/* Mostramos Loading mientras verificamos */}
    </AuthContext.Provider>
  );
};

export const logout = () => {
    if (logoutCallback) {
      logoutCallback();
    }
  };

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
