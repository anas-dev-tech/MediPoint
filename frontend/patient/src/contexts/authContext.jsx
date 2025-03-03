import { createContext, useState, useEffect } from "react";
import { logout, login, register,getUserRoleFromToken, isAuthenticatedOrRefreshToken } from "../services/authService";
import authAPI from "../api/authAPI";
import PropTypes from 'prop-types';
import {toast} from 'react-toastify'

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true); // Initialize loading as true
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const getUser = async () => {
    if (isAuthenticated) {
      const { data } = await authAPI.get('/auth/me/');
      setUser(data);
      // const role = getUserRoleFromToken();
    }
  };
  useEffect(() => {
    const checkAuth = async () => {
      const authStatus = await isAuthenticatedOrRefreshToken();
      const role = getUserRoleFromToken();
      
      if(role !== 'P'){
        toast.error("only Patient can login in this Page")
        logout();
      }

      console.log("role", role)
      setIsAuthenticated(authStatus);
      if (authStatus) {
        await getUser();
      }
      setLoading(false);
    };
    checkAuth(); 
  }, []); 
  
  const handleLogout = async () => {
    setIsAuthenticated(false);
    logout();
  }

  const handleLogin = async (email, password) => {
    setLoading(true);
    const { success } = await login(email, password);
    if (success) {
      await getUser();
      setIsAuthenticated(true)
      setLoading(false);
      return { success }
    }
    setLoading(false)
  };

  return (
    <AuthContext.Provider value={{ user,register, isAuthenticated, getUser, setUser, login: handleLogin, logout: handleLogout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node // Important: Define children as a prop
};