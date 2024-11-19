import { User } from "./User";

export type UserProviderType = {
    User: User | null;
    token: string | null;
    login: (token: string, User: User) => void;
    logout: () => void;
};