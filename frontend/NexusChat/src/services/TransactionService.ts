import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { fromB64 } from "@mysten/sui.js/utils";

const PRIVATE_KEY = process.env.REACT_APP_PRIVATE_KEY || "";

export const signTransaction = async (txBytesBase64: any) => {
    const keypair = Ed25519Keypair.fromSecretKey(PRIVATE_KEY);
    const txBytes = fromB64(txBytesBase64);
    return await keypair.signTransaction(txBytes);
};

export const executeTransaction = async (block: any, token: any) => {
    const response = await fetch("https://localhost:7261/api/Transaction/execute_Transaction", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(block),
    });

    if (!response.ok) throw new Error("Transaction failed");
};

export const executeCreateUser = async (transactionUserData: any, walletAddress: any) => {
    try {
        const response = await fetch("https://localhost:7261/api/Transaction/execute_createUser", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ TransactionUserData: transactionUserData, WalletAddress: walletAddress }),
        });

        if (!response.ok) {
            throw new Error("Failed to log in");
        }

        return response.json();
    } catch (error) {
        console.error("Login error:", error);
        throw error;
    }
}
