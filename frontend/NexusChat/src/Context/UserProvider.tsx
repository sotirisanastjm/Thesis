import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../Models/User';
import { UserProviderType } from '../Models/UserProvider';

const UserContext = createContext<UserProviderType | undefined>(undefined);

export const UserProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    const [User, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const savedToken = localStorage.getItem("token");
        if (savedToken) {
            setToken(savedToken);
            // Fetch user User from API if needed
        }
    }, []);

    const login = (token: string, User: User) => {
        setToken(token);
        setUser(User);
        localStorage.setItem("token", token);
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
    };

    return (
        <UserContext.Provider value={{ User, token, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};
