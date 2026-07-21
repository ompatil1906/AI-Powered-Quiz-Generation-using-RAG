import { useState, useEffect } from 'react';
import { loginUserApi, signupUserApi } from '../api/quizApi';

const AUTH_USER_KEY = 'ai_quiz_studio_user';
const AUTH_TOKEN_KEY = 'ai_quiz_studio_token';

export function useAuth(showToast) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(AUTH_USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem(AUTH_TOKEN_KEY) || null;
    } catch (e) {
      return null;
    }
  });

  const [isAuthLoading, setIsAuthLoading] = useState(false);

  const login = async (email, password) => {
    setIsAuthLoading(true);
    try {
      const data = await loginUserApi(email, password);
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.user));
      localStorage.setItem(AUTH_TOKEN_KEY, data.token);
      showToast?.(`Welcome back, ${data.user.fullName}!`, 'success');
      return true;
    } catch (error) {
      showToast?.(error.message || 'Login failed', 'error');
      return false;
    } finally {
      setIsAuthLoading(false);
    }
  };

  const signup = async (fullName, email, password) => {
    setIsAuthLoading(true);
    try {
      const data = await signupUserApi(fullName, email, password);
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.user));
      localStorage.setItem(AUTH_TOKEN_KEY, data.token);
      showToast?.(`Account created! Welcome, ${data.user.fullName}!`, 'success');
      return true;
    } catch (error) {
      showToast?.(error.message || 'Registration failed', 'error');
      return false;
    } finally {
      setIsAuthLoading(false);
    }
  };

  const loginAsDemo = async () => {
    return login('demo@learnyst.com', 'password123');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(AUTH_USER_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    showToast?.('Logged out successfully', 'info');
  };

  return {
    user,
    token,
    isAuthLoading,
    login,
    signup,
    loginAsDemo,
    logout,
  };
}
