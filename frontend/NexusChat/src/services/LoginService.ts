
export const ValidateClient = async (walletAddress: string) => {
    try {
        const response = await fetch("https://localhost:7261/api/Auth/validate-client", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(walletAddress),
        });

        if (!response.ok) {
            throw new Error("Failed to log in");
        }

        return response.json();
    } catch (error) {
        console.error("Validate Client Failed:", error);
        throw error;
    }
};

export const validateToken = async (token: string, walletAddress: string) => {
    const response = await fetch("https://localhost:7261/api/Auth/validate-client", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(walletAddress),
    });

    if (!response.ok) {
        throw new Error("Invalid token");
    }

    return response.json();
};
