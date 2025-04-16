import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { fromB64 } from "@mysten/sui.js/utils";

const PRIVATE_KEY = "suiprivkey1qqf057xqy3rs7t8qumv9wq22lz5468szh64dw58g3a6r2hle938zvysjtge";

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

export const executeCreateUser = async (transactionUserData: any, formData: any) => {
    try {
        const response = await fetch("https://localhost:7261/api/Transaction/execute_createUser", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ TransactionUserData: transactionUserData, WalletAddress: formData.walletAddress }),
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
