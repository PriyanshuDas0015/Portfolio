import { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from '../services/adminApi';
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    authApi
      .me()
      .then((data) => setAdmin(data.admin))
      .catch(() => setAdmin(null))
      .finally(() => setLoading(false));
  }, []);
  const login = async (values) => {
    const data = await authApi.login(values);
    setAdmin(data.admin);
    return data;
  };
  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      setAdmin(null);
    }
  };
  return (
    <AuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);
