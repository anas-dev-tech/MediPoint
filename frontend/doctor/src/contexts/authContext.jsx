import { createContext, useState, useEffect } from "react";
import { logout, login, getUserRoleFromToken, isAuthenticatedOrRefreshToken } from "../services/authService";
import authAPI from "../api/authAPI";
import PropTypes from 'prop-types';


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true); // Initialize loading as true
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const getUser = async () => {
        if (isAuthenticated) {
            const { data } = await authAPI.get('/auth/me/');
            setUser(data);
        }
    };

    useEffect(() => {
        const checkAuth = async () => {
            const authStatus = await isAuthenticatedOrRefreshToken();
            setIsAuthenticated(authStatus);
            if (authStatus) {
                await getUser(); // Ensure getUser() is called when authenticated
            }
            setLoading(false); // Set loading to false after authentication check
        };

        checkAuth();
    }, []);

    const handleLogout =  () => {
        logout();
        setIsAuthenticated(false);
    }

    const handleLogin = async (email, password) => {
        setLoading(true);
        const { success, message } = await login(email, password);
        if (success) {
            await getUser();
            setLoading(false);
            setIsAuthenticated(true)
            return { success, message }
        } else {
            setLoading(false);
            return { success, message }
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, getUser, setUser, login: handleLogin, logout: handleLogout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node // Important: Define children as a prop
};