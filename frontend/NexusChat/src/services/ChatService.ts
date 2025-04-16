import { Message } from "../Models/Message";

export const fetchChat = async (walletAddress: any, setChatID: any) => {
    const response = await fetch("https://localhost:7261/api/Chat/getChat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(walletAddress),
    });

    if (!response.ok) throw new Error("Failed to fetch chat");

    const data = await response.json();
    setChatID(data.chatId);
    return data.messages;
};

export const sendMessageToAPI = async (request: any, token: any) => {
    const response = await fetch("https://localhost:7261/api/Chat/sendMessage", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(request),
    });

    return response;
};

export const addMessageToBlockchain = async (message: Message, chatID: any, token: any, walletAddress: any) => {
    const request = {
        msgRequest: message,
        chatObjectId: chatID,
        walletAddress: walletAddress
    };

    const response = await fetch("https://localhost:7261/api/Chat/addMessage", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(request),
    });

    if (!response.ok) throw new Error("Failed to log in");

    return await response.json();
};

export const fetchLastDialog = async (chatID: any, token: any) => {
    const response = await fetch("https://localhost:7261/api/Chat/getLastDialog", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(chatID),
    });

    if (!response.ok) throw new Error("Failed to get last dialog");

    return await response.json();
};
