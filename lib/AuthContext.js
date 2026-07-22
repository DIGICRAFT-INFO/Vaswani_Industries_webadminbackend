'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import adminApi from '@/lib/admin-api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem('vil_admin_user');
    const token = localStorage.getItem('vil_admin_token');
    if (stored && token) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await adminApi.post('/auth/login', { email, password });
    if (data.success) {
      localStorage.setItem('vil_admin_token', data.token);
      localStorage.setItem('vil_admin_user', JSON.stringify(data.user));
      setUser(data.user);
      router.push('/admin');
    }
    return data;
  };

  const logout = () => {
    localStorage.removeItem('vil_admin_token');
    localStorage.removeItem('vil_admin_user');
    setUser(null);
    router.push('/admin/login');
  };

  const updateUser = (updates) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem('vil_admin_user', JSON.stringify(updated));
  };

  // Check if user has a specific permission
  const hasPermission = (perm) => {
    if (!user) return false;
    if (user.role === 'superadmin') return true;
    return (user.permissions || ['overview']).includes(perm);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
