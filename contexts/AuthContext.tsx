'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '@/services';
import type { Distributor } from '@/types';
import { getSessionId, clearSessionId } from '@/lib/session-id';

interface AuthContextType {
  user: Distributor | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (distributor: Partial<Distributor>) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Distributor | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // 初始化时从 localStorage 恢复登录状态
  useEffect(() => {
    const initAuth = () => {
      try {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Failed to restore auth state:', error);
        // 清除损坏的数据
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // 获取 sessionId 用于合并购物车
      const sessionId = getSessionId();
      
      const response = await authService.login(email, password, sessionId);
      
      
      if (response.token && response.distributor) {
        setToken(response.token);
        setUser(response.distributor);
        
        // 持久化到 localStorage
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.distributor));
        
        // 登录成功后清除 sessionId（已合并到后端）
        clearSessionId();
      } else {
        console.error('Invalid response structure:', response);
        throw new Error('Login failed: Invalid response');
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (distributor: Partial<Distributor>) => {
    try {
      setLoading(true);
      const response = await authService.register(distributor);
      
      if (response.success) {
        // 注册成功后不自动登录，引导用户去登录页
        return;
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
