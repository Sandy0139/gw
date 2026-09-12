import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthResponse, ApiResponse } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isBuyer: boolean;
  isSupplier: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMe = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await api.get<ApiResponse<User>>('/auth/me');
        if (res.success) {
          setUser(res.data);
        } else {
          logout();
        }
      } catch (err) {
        console.error('Failed to load user session', err);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    fetchMe();
  }, [token]);

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const isBuyer = user?.role === 'BUYER';
  const isSupplier = user?.role === 'SUPPLIER';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isBuyer,
        isSupplier,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
