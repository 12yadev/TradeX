import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { loginUser, registerUser, fetchMe } from '../services/tradingService';
import { getToken, setToken, clearToken } from '../services/api';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!getToken()); // only wait if a token exists

  // On first load, restore the session from a saved token
  useEffect(() => {
    if (!getToken()) return;
    fetchMe()
      .then((res) => setUser(res.user))
      .catch(() => clearToken())
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password, remember = true) => {
    const res = await loginUser({ email, password });
    setToken(res.token, remember);
    setUser(res.user);
  }, []);

  const register = useCallback(async (form) => {
    const res = await registerUser(form);
    setToken(res.token, true);
    setUser(res.user);
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
