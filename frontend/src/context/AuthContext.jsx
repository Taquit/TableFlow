import { useState } from 'react';
import { AuthContext } from '../hooks/useAuth';

const readStoredUser = () => {
    try {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    } catch {
        return null;
    }
};

const readStoredToken = () => {
    try {
        return localStorage.getItem('token');
    } catch {
        return null;
    }
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(readStoredUser);
    const [token, setToken] = useState(readStoredToken);

    const login = (userData, authToken) => {
        setUser(userData);
        setToken(authToken);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', authToken);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading: false }}>
            {children}
        </AuthContext.Provider>
    );
};
