import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('dd_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('dd_user');
      }
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // Simulate auth — accept any non-empty credentials
    if (!email || !password) return { error: 'Email and password are required.' };
    const userData = {
      id: 'user_1',
      email,
      name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      company: localStorage.getItem('dd_signup_company') || 'Acme Ventures',
      role: 'Analyst',
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem('dd_user', JSON.stringify(userData));
    setUser(userData);
    return { success: true };
  };

  const signup = (company, email, password) => {
    if (!company || !email || !password) return { error: 'All fields are required.' };
    if (password.length < 8) return { error: 'Password must be at least 8 characters.' };
    localStorage.setItem('dd_signup_company', company);
    return login(email, password);
  };

  const logout = () => {
    localStorage.removeItem('dd_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
