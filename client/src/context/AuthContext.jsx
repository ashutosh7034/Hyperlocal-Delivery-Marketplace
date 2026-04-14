import React, { createContext, useState, useCallback } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user')) || null,
    isAuthenticated: !!localStorage.getItem('token'),
    loading: false,
    error: null,
  });

  /**
   * Login user
   */
  const login = useCallback((token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    setAuth({
      token,
      user,
      isAuthenticated: true,
      loading: false,
      error: null,
    });
  }, []);

  /**
   * Logout user
   */
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    setAuth({
      token: null,
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    });
  }, []);

  /**
   * Set error
   */
  const setError = useCallback((error) => {
    setAuth((prev) => ({
      ...prev,
      error,
    }));
  }, []);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setAuth((prev) => ({
      ...prev,
      error: null,
    }));
  }, []);

  const value = {
    ...auth,
    login,
    logout,
    setError,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
