// contexts/authContext.js
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({}); // pass: Bdm12R34%
  
  useEffect(() => {
    const userData = Cookies.get('user');
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        setUser(parsedData);
      } catch (error) {
        console.error('Failed to parse user data:', error);
      }
    }
  }, []); 

  const isLoggedin = useCallback(() => {
    if (user != null && user.access_token != "" && user.access_token !== undefined) {
      return true;
    }

    return false;
  }, []);

  const login = useCallback(async (email, password) => {
    try {
        const formData = new FormData();
        formData.append('username', email);
        formData.append('password', password);
        const response = await axios.post(`${API_BASE_URL}/default-auth/authenticate`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
        Cookies.set('user', JSON.stringify(response.data), { expires: 7, secure: false });
        setUser(response.data);
      } catch (error) {
        throw new Error(error.response?.data?.detail || 'Failed to login.' + error);
      }    
  }, []);

  const logout = useCallback(() => {
    Cookies.remove('user'); // Clear user cookie
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
