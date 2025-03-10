import { createContext, useState, useEffect } from "react";
import { logout, login, getUserRoleFromToken, isAuthenticatedOrRefreshToken } from "../services/authService";
import authAPI from "../api/authAPI";
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true); // Initialize loading as true
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isDoctor, setIsDoctor] = useState(false)

    const getUser = async () => {
        if (isAuthenticated) {
            const { data } = await authAPI.get('/auth/me/');
            setUser(data);
            console.log(data);
            const role = getUserRoleFromToken();
            if (role === 'D') {
                setIsDoctor(true)
            }
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

            if (isAuthenticated) {
                const role = getUserRoleFromToken();
                if(role !== 'D'){
                    toast.error("Only Doctors can login in this Page")
                    logout();
                }
            }
        };

        checkAuth();
    }, []);

    const handleLogout = async () => {
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
        <AuthContext.Provider value={{ user, isAuthenticated, isDoctor, getUser, setUser, login: handleLogin, logout: handleLogout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node // Important: Define children as a prop
};