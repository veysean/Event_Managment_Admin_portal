import React, { createContext, useState, useEffect } from 'react';
import { isAuthenticated, setToken, logout as removeToken, getToken } from '../utils/auth';
import {jwtDecode} from 'jwt-decode';

// Create Context
export const AuthContext = createContext();

// Provider Component
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = isAuthenticated();
    setAuth(userData);
    setLoading(false);
  }, []);

  const login = (token) => {
    setToken(token);
    try {
      const decoded = jwtDecode(token);
      setAuth({ token, user: decoded });

    } catch (error) {
      console.error('Invalid token during login:', error);
      removeToken();
      setAuth(null);
    }
  };

  const logout = () => {
    removeToken();
    setAuth(null);
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
