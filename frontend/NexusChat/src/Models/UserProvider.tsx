import { Message } from "./Message";
import { User } from "./User";

export type UserProviderType = {
    user: User | null;
    token: string | null;
    login: (token: string, User: User) => void;
    logout: () => void;
    setChatID: (id: string) => void;
    getChatID: () => void;
    messages: Message[];
    setMessages: (messages: Message[]) => void;
    setPrevMessages: (messages: Message[]) => void;
    addMessage: (message: Message) => void;
    updateMessage: (message: Message, tempID: string) => void;
};