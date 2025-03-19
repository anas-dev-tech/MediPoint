import { createContext, useState, useEffect } from "react";
import { logout, login, register, getUserRoleFromToken, isAuthenticatedOrRefreshToken } from "../services/authService";
import authAPI from "../api/authAPI";
import PropTypes from 'prop-types';
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true); // Initialize loading as true
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const getUser = async () => {
    if (isAuthenticated) {
      const { data } = await authAPI.get('/auth/me/');
      if(data.user.role !== "P"){
        handleLogout();
      }else{
        setUser(data);
      }
      // const role = getUserRoleFromToken();
    }
  };
  useEffect(() => {
    const checkAuth = async () => {
      const authStatus = await isAuthenticatedOrRefreshToken();
      setIsAuthenticated(authStatus);
      setLoading(false);
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    setIsAuthenticated(false);
    setUser({});
    navigate('/');
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
    <AuthContext.Provider value={
      { 
        user, register, isAuthenticated, 
        setLoading, setIsAuthenticated,
         getUser, setUser,
          login, logout: handleLogout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node // Important: Define children as a prop
};