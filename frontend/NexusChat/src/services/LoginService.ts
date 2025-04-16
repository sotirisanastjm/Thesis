export const LoginWithWallet = async (form: any) => {
    try {
        const response = await fetch("https://localhost:7261/api/Auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(form),
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

export const RegisterUser = async (form: any) => {
    try {
        const response = await fetch("https://localhost:7261/api/Auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(form),
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


export const ValidateAddress = async (walletAddress: string) => {
    try {
        const response = await fetch("https://localhost:7261/api/Auth/validate-address", {
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
        console.error("Login error:", error);
        throw error;
    }
}