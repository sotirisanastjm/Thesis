/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_SITE_NAME: string; // Add other environment variables here if needed
    readonly VITE_API_URL: string; // Add other environment variables here if needed
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
