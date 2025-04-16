import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserLogin } from "../Models/User";
import { UserProviderType } from "../Models/UserProvider";
import { Message } from "../Models/Message";

const UserContext = createContext<UserProviderType | undefined>(undefined);

export const UserProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {

    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
    const [chatID, setChatID] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);

    const apiRequest = async (url: string, options: RequestInit = {}) => {
        const headers = {
            ...(options.headers || {}),
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
        };

        return await fetch(url, { ...options, headers });
    };

    useEffect(() => {
        const savedToken = localStorage.getItem("token");
        if (savedToken) {
            setToken(savedToken);
            let userLogin: UserLogin = {
                WalletAddress: "",
                Email: "",
                Username: "",
                Password: ""
            }
            apiRequest("https://localhost:7261/api/Auth/login", {
                method: "POST",
                body: JSON.stringify(userLogin),
            })
                .then(async (response) => {
                    if (response.ok) {
                        const resultUser = await response.json();
                        if (resultUser) {
                            setUser(resultUser);
                        } else {
                            logout();
                        }

                    } else {
                        logout();
                    }
                })
                .catch(() => logout());
        }
    }, []);

    const login = (token: string, userLogin: User) => {
        setToken(token);
        setUser(userLogin);
        localStorage.setItem("token", token);
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        setMessages([]);
        localStorage.removeItem("token");
    };

    const addMessage = (msg: Message) => {
        setMessages((prev) => [...prev, msg]);
    };

    const setPrevMessages = (prevMessages: Message[]) => {
        messages.unshift(...prevMessages);
        setMessages(messages);
    };
    const getChatID = () => {
        return chatID;
    };

    const updateMessage = (updatedMessage: Message, tempID: string) => {
        setMessages((prevMessages) =>
            prevMessages.map((message) =>
                message.id === tempID ? updatedMessage : message
            )
        );
    };

    return (
        <UserContext.Provider value={{ user, token, login, logout, messages, setChatID, getChatID, setMessages, addMessage, updateMessage, setPrevMessages }}>
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
    return context.user;
};
