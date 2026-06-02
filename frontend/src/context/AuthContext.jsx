import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('theme') || 'light';
    } catch (e) {
      return 'light';
    }
  });
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');

        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

          const res = await axios.get('/api/v1/auth/me');
          setUser(res.data.data || res.data.user);
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const register = async (userData) => {
    setLoading(true);
    setError(null);

    try {
      // Extract adminCode from userData and create request body
      const { adminCode, ...registerData } = userData;
      const requestBody = adminCode ? { ...registerData, adminCode } : registerData;

      const res = await axios.post('/api/v1/auth/register', requestBody);

      localStorage.setItem('token', res.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;

      setUser(res.data.data || res.data.user);

      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Реєстрація не вдалася');
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post('/api/v1/auth/login', credentials);

      localStorage.setItem('token', res.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;

      setUser(res.data.data || res.data.user);

      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    navigate('/login');
  };

  const toggleTheme = (value) => {
    const next = value || (theme === 'light' ? 'dark' : 'light');
    setTheme(next);
    try {
      localStorage.setItem('theme', next);
    } catch (e) {
      // ignore
    }
    // apply to document
    if (typeof document !== 'undefined') {
      if (next === 'dark') document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    }
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (theme === 'dark') document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <AuthContext.Provider value={{ user, loading, error, register, login, logout, theme, toggleTheme }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);