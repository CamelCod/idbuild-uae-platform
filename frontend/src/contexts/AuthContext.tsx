import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  email: string;
  role: 'contractor' | 'client' | 'admin';
  name: string;
  company?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for stored auth token
    const token = localStorage.getItem('auth_token');
    if (token) {
      // In a real app, we'd validate the token with the backend
      // For GitHub Pages demo, we'll use mock user data
      const mockUser: User = {
        id: '1',
        email: 'demo@bidbuild.ae',
        role: 'contractor',
        name: 'Demo Contractor',
        company: 'UAE Construction Co.',
      };
      setUser(mockUser);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // In a real app, this would call the backend API
    // For GitHub Pages demo, we'll use mock authentication
    if (email && password) {
      const mockUser: User = {
        id: '1',
        email,
        role: 'contractor',
        name: 'Demo User',
        company: 'UAE Construction Co.',
      };
      setUser(mockUser);
      localStorage.setItem('auth_token', 'mock_token');
      navigate('/dashboard');
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_token');
    navigate('/login');
  };

  const register = async (userData: any) => {
    // Mock registration
    console.log('Registering user:', userData);
    navigate('/login');
  };

  const value = {
    user,
    loading,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};