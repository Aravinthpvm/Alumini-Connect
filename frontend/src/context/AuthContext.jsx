import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem('alumniUser');
        if (stored) { try { setUser(JSON.parse(stored)); } catch { } }
        setLoading(false);
    }, []);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('alumniUser', JSON.stringify(userData));
        localStorage.setItem('alumniToken', userData.token);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('alumniUser');
        localStorage.removeItem('alumniToken');
    };

    const updateUser = (updates) => {
        const updated = { ...user, ...updates };
        setUser(updated);
        localStorage.setItem('alumniUser', JSON.stringify(updated));
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, updateUser }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};
