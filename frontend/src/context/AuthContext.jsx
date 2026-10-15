import { createContext, useContext, useState } from 'react';
import api from '../api';

const AuthContext = createContext(null);

const VALID_ROLES = ['student', 'faculty'];

// Only trust a stored user if it is a well-formed object with a valid role.
// Prevents the "/undefined" redirect caused by stale/corrupt localStorage.
const loadStoredUser = () => {
  try {
    const raw = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (!raw || !token) return null;

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    if (!VALID_ROLES.includes(parsed.role)) return null;
    if (!parsed.id || !parsed.name) return null;

    return parsed;
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadStoredUser);

  // role: 'student' | 'faculty'   mode: 'login' | 'register'
  const authenticate = async (role, mode, payload) => {
    const { data } = await api.post(`/auth/${role}/${mode}`, payload);

    if (!data?.token || !data?.user || !VALID_ROLES.includes(data.user.role)) {
      throw new Error('Unexpected server response. Please try again.');
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, authenticate, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);