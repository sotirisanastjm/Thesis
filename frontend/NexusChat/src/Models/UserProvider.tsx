import { Folder } from "./Folder";
import { Message } from "./Message";
import { Note } from "./Note";
import { Notepad } from "./Notepad";
import { User } from "./User";

export type UserProviderType = {
    user: User | null;
    token: string | null;
    login: (token: string, User: User) => void;
    logout: () => void;
    setChatID: (id: string) => void;
    getChatID: () => void;
    messages: Message[];
    notepad: Notepad | null;
    setMessages: (messages: Message[]) => void;
    setPrevMessages: (messages: Message[]) => void;
    addMessage: (message: Message) => void;
    updateMessage: (message: Message, tempID: string) => void;
    addFolder: (folder: Folder) => void;
    update: () => void;
    addNoteToFolder: (folderId: string, note: Note) => void;
};