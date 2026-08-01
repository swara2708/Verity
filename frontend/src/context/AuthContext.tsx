import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch, getAuthToken, setAuthToken, removeAuthToken } from '../lib/api';

export interface UserProfile {
  id: string;
  org_id: string;
  role: 'hr_admin' | 'manager' | 'employee' | 'peer';
  name: string;
  status: string;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  loginHR: (token: string, user: UserProfile) => void;
  loginEmployee: (token: string, user: UserProfile) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    const token = getAuthToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const data = await apiFetch<UserProfile>('/auth/me');
      setUser(data);
    } catch (err) {
      console.error('Failed to fetch user context:', err);
      removeAuthToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const loginHR = (token: string, userProfile: UserProfile) => {
    setAuthToken(token);
    setUser(userProfile);
  };

  const loginEmployee = (token: string, userProfile: UserProfile) => {
    setAuthToken(token);
    setUser(userProfile);
  };

  const logout = () => {
    removeAuthToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginHR, loginEmployee, logout, refreshUser }}>
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
