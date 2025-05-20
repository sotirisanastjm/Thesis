import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { User } from "../Models/User";
import { UserProviderType } from "../Models/UserProvider";
import { Message } from "../Models/Message";
import { validateToken } from "../services/LoginService";
import { fetchNotes } from "../services/NoteService";
import { Notepad } from "../Models/Notepad";
import { Folder } from "../Models/Folder";
import { Note } from "../Models/Note";

const UserContext = createContext<UserProviderType | undefined>(undefined);

export const UserProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {

    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
    const [chatID, setChatID] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [notepad, setNotepad] = useState<Notepad | null>(null);
    const run = useRef(true);

    useEffect(() => {
        const savedToken = localStorage.getItem("token");
        if (savedToken && run.current) {
            run.current = false;
            setToken(savedToken);
            handleTokenValidation(savedToken);
        }
    }, []);

    const handleTokenValidation = async (token: string) => {
        try {
            const resultUser = await validateToken(token, "invalid");
            if (resultUser) {
                setUser(resultUser);
                if (!notepad?.id) {
                    getNotes(resultUser.walletAddress, token);
                }
            } else {
                logout();
            }
        } catch (error) {
            logout();
        }
    };

    const login = (token: string, userLogin: User) => {
        setToken(token);
        setUser(userLogin);
        localStorage.setItem("token", token);
        if (!notepad?.id) {
            getNotes(userLogin.walletAddress, token);
        }
    };

    const getNotes = (wallet: string, token: string) => {
        (async () => {
            try {
                const notepad = await fetchNotes(wallet, token);
                setNotepad(notepad);
               
            } catch (error) {
                console.error("Failed to fetch chat:", error);
            }
        })();
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        setMessages([]);
        setNotepad(null);
        localStorage.removeItem("token");
    };

    const update = () => {
        console.log("yes")
        if (user?.walletAddress && token) {
            console.log("yesss!")
            getNotes(user?.walletAddress, token);
        }
    };

    const addMessage = (msg: Message) => {
        setMessages((prev) => [...prev, msg]);
    };

    const addFolder = (folder: Folder) => {
        if (!notepad) return;

        setNotepad({
            ...notepad,
            folders: [...notepad.folders, folder],
        });
    };

    const addNoteToFolder = (folderId: string, note: Note) => {
        if (!notepad) return;

        const updatedFolders = notepad.folders.map((folder) =>
            folder.id === folderId
                ? { ...folder, notes: [...folder.notes, note] }
                : folder
        );

        setNotepad({
            ...notepad,
            folders: updatedFolders,
        });
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
        <UserContext.Provider value={{ user, token, login, logout, messages, notepad, setChatID, getChatID, setMessages, addMessage, addFolder, update, addNoteToFolder, updateMessage, setPrevMessages }}>
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
