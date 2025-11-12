import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookie from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import axios from '../config/axios';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const isAuthenticated = () => {
        const token = Cookie.get('accessToken');
        if (!token) return false;

        try {
            const decoded = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            return decoded.exp >= currentTime;
        } catch (err){
            Cookie.remove('accessToken');
            return false;
        }
    };

    const login = async (credentials) => {
        const response = await axios.post('auth/login', credentials);
        const { accessToken } = response.data;

        Cookie.set('accessToken', accessToken, {
            expires: 1 / 24,
            secure: true,
            sameSite: 'Strict',
            path: '/',
        });

        await getUser();
        return response.data;
    };

    const register = async (userData) => {
        const response = await axios.post('auth/register', userData);
        return response.data;
    };

    const logout = async () => {
        try {
            await axios.post('auth/logout');
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            Cookie.remove('accessToken');
            setUser(null);
            navigate('/');
        }
    };

    const getUser = async () => {
        try {
            const response = await axios.get('/users/me');
            setUser(response.data);
            return response.data;
        } catch (err) {
            console.error('Get user error:', err);
            setUser(null);
        }
    };

    useEffect(() => {
        const initAuth = async () => {
            if (isAuthenticated()) {
                await getUser();
            }
            setLoading(false);
        };
        initAuth();
    }, []);

    const value = {
        user,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
        getUser
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
