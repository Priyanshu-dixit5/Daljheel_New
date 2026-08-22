import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  adminLogin as adminLoginApi,
  fetchMe,
  getToken,
  login as loginApi,
  logoutApi,
  register as registerApi,
  setToken,
  updateProfile as updateProfileApi,
  uploadAvatar as uploadAvatarApi,
} from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return null;
    }
    try {
      const data = await fetchMe();
      setUser(data.user);
      return data.user;
    } catch {
      setToken('');
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const value = useMemo(() => {
    async function register(payload) {
      const data = await registerApi(payload);
      setToken(data.token);
      setUser(data.user);
      return data.user;
    }

    async function login(payload) {
      const data = await loginApi(payload);
      setToken(data.token);
      setUser(data.user);
      return data.user;
    }

    async function loginAdmin(payload) {
      const data = await adminLoginApi(payload);
      setToken(data.token);
      setUser(data.user);
      return data.user;
    }

    async function logout() {
      try {
        await logoutApi();
      } catch {
        // ignore network errors on logout
      }
      setToken('');
      setUser(null);
    }

    async function updateProfile(payload) {
      const data = await updateProfileApi(payload);
      setUser(data.user);
      return data.user;
    }

    async function uploadAvatar(file) {
      const data = await uploadAvatarApi(file);
      setUser(data.user);
      return data.user;
    }

    return {
      user,
      loading,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === 'admin',
      register,
      login,
      loginAdmin,
      logout,
      updateProfile,
      uploadAvatar,
      refreshUser,
    };
  }, [user, loading, refreshUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
