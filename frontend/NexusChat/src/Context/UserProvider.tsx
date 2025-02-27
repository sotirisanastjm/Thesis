import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "../Models/User";
import { UserProviderType } from "../Models/UserProvider";

const UserContext = createContext<UserProviderType | undefined>(undefined);

export const UserProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    const [User, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);

    const apiRequest = async (url: string, options: RequestInit = {}) => {
        const headers = {
            ...(options.headers || {}),
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
        };

        return fetch(url, { ...options, headers });
    };

    useEffect(() => {
        const savedToken = localStorage.getItem("token");
        if (savedToken) {
            setToken(savedToken);

            apiRequest("https://localhost:7261/api/Auth/login", {
                method: "POST", 
            })
                .then(async (response) => {
                    if (response.ok) {
                        const user = await response.json();
                        setUser(user); 
                    } else {
                        logout(); 
                    }
                })
                .catch(() => logout());
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
        throw new Error("use User must be used within a UserProvider");
    }
    return context;
};
export const getUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("use User must be used within a UserProvider");
    }
    return context.User;
};
