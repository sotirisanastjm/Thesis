import { Note } from "../Models/Note";

export const fetchNotes = async (walletAddress: string, token: string) => {
    const response = await fetch("https://localhost:7261/api/Note/fetch-notepad", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(walletAddress),
    });

    if (!response.ok) throw new Error("Failed to fetch chat");

    const data = await response.json();
    return data;
};

export const addFolder = async (objectId: string, token: string, name: string, walletAddress: string) => {

    let request = {
        wallet: walletAddress,
        name: name,
        objectId: objectId,
    };

    const response = await fetch("https://localhost:7261/api/Note/create-folder", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(request),
    });

    if (!response.ok) throw new Error("Failed to fetch chat");

    const data = await response.json();
    return data;
};

export const addNoteAsync = async (token: string, notepadId: string, index: number, note: Note, walletAddress: string) => {

    let request = {
        wallet: walletAddress,
        note: note,
        objectId: notepadId,
        index: index
    };

    const response = await fetch("https://localhost:7261/api/Note/add-note", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(request),
    });

    if (!response.ok) throw new Error("Failed to add Note");

    const data = await response.json();
    return data;
};