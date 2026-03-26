import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authMe, getStoredToken, setStoredToken } from '../api/admin';

interface AuthContextValue {
  token: string | null;
  username: string | null;
  loading: boolean;
  setSession: (token: string | null, username?: string | null) => void;
  refreshProfile: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => getStoredToken());
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    const t = getStoredToken();
    if (!t) {
      setUsername(null);
      setLoading(false);
      return;
    }
    try {
      const me = await authMe();
      setUsername(me.username);
      setToken(t);
    } catch {
      setStoredToken(null);
      setToken(null);
      setUsername(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshProfile();
  }, [refreshProfile]);

  const setSession = useCallback((next: string | null, user?: string | null) => {
    setStoredToken(next);
    setToken(next);
    if (user !== undefined) {
      setUsername(user);
    }
  }, []);

  const logout = useCallback(() => {
    setStoredToken(null);
    setToken(null);
    setUsername(null);
  }, []);

  const value = useMemo(
    () => ({ token, username, loading, setSession, refreshProfile, logout }),
    [token, username, loading, setSession, refreshProfile, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
