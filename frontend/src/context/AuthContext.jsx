import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../services/api';

const AuthenticationContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [authToken, setAuthToken] = useState(localStorage.getItem('aquasense_token') || null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Validate existing stored token and retrieve fresh user profile on startup
  useEffect(() => {
    const checkExistingSession = async () => {
      const storedToken = localStorage.getItem('aquasense_token');
      if (!storedToken) {
        setIsInitializing(false);
        return;
      }

      try {
        const response = await apiClient.get('/auth/me');
        if (response.data && response.data.success) {
          setCurrentUser(response.data.user);
          localStorage.setItem('aquasense_user', JSON.stringify(response.data.user));
        }
      } catch (sessionError) {
        console.error('Session expired or invalid:', sessionError.message);
        logout();
      } finally {
        setIsInitializing(false);
      }
    };

    checkExistingSession();
  }, []);

  const login = async (emailAddress, password) => {
    const response = await apiClient.post('/auth/login', {
      email: emailAddress,
      password: password
    });

    if (response.data && response.data.success) {
      const { token: receivedToken, user: receivedUserData } = response.data;
      setAuthToken(receivedToken);
      setCurrentUser(receivedUserData);
      localStorage.setItem('aquasense_token', receivedToken);
      localStorage.setItem('aquasense_user', JSON.stringify(receivedUserData));
      return receivedUserData;
    }

    throw new Error(response.data?.error || 'Login attempt failed.');
  };

  const register = async (fullName, emailAddress, password) => {
    const response = await apiClient.post('/auth/register', {
      name: fullName,
      email: emailAddress,
      password: password
    });

    if (response.data && response.data.success) {
      const { token: receivedToken, user: receivedUserData } = response.data;
      setAuthToken(receivedToken);
      setCurrentUser(receivedUserData);
      localStorage.setItem('aquasense_token', receivedToken);
      localStorage.setItem('aquasense_user', JSON.stringify(receivedUserData));
      return receivedUserData;
    }

    throw new Error(response.data?.error || 'Registration failed.');
  };

  const logout = () => {
    setAuthToken(null);
    setCurrentUser(null);
    localStorage.removeItem('aquasense_token');
    localStorage.removeItem('aquasense_user');
  };

  return (
    <AuthenticationContext.Provider
      value={{
        user: currentUser,
        token: authToken,
        loading: isInitializing,
        login: login,
        register: register,
        logout: logout,
        isAuthenticated: Boolean(authToken)
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthenticationContext);
  if (!context) {
    throw new Error('useAuth must be called inside an AuthProvider component.');
  }
  return context;
};
