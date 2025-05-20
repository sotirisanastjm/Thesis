import { useState } from "react";
import { useUser } from "../Context/UserProvider";
import { UserProviderType } from "../Models/UserProvider";
import { addFolder } from "../services/NoteService";
import { useSignTransaction } from "@mysten/dapp-kit";
import { executeTransaction } from "../services/TransactionService";

type CreateFolderProps = {
    onClick?: (flag: boolean) => void;
};

export const CreateFolder = ({ onClick }: CreateFolderProps) => {

    const user: UserProviderType = useUser();
    const [messageText, setMessageText] = useState("");
    const { mutateAsync: signTransaction } = useSignTransaction();

    const handleCreateFolder = async () => {
        if (messageText != "") {
            let folder = {
                id: "temp-id",
                name: messageText,
                notes: [],
            };
            user.addFolder(folder)
            onClick?.(false);
            setMessageText("");


            if (user.notepad && user.token && user.user?.walletAddress) {
                const response = await addFolder(user?.notepad?.id, user?.token, messageText, user.user?.walletAddress);

                let { signature } = await signTransaction({
                    transaction: response?.txBytes,
                    chain: 'sui:devnet',
                });

                await executeTransaction({ bytes: response?.txBytes, signature: signature }, user?.token);

                user.update();
            }
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setMessageText(e.target.value);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && messageText !== "") {
            e.preventDefault();
            handleCreateFolder();
        } else if (e.key === "Escape") {
            onClick?.(false)
        }
    };

    return (
        <div className="fixed backdrop-blur-sm w-full h-full inset-0">
            <div className="bg-dark-900 shadow-2xl shadow-dark-400 opacity-[0.96] center-modal left-[50%] top-[50%] absolute w-[80%] sm:w-3/5 md:w-1/2 lg:w-[40%] h-[20%] rounded-xl p-8 flex flex-col justify-center gap-8 items-center">
                <button className="hover:cursor-pointer" onClick={() => { onClick?.(false) }}>
                    <svg className="absolute top-0 right-0 mt-2 mr-4 size-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                </button>

                <h2 className="text-2xl lg:text-3xl font-bold">Create a Folder</h2>
                <div className="relative w-[80%]">
                    <input
                        className="bg-dark-900 w-full text-dark-200 font-mono ring-1 ring-dark-600 focus:ring-2 focus:ring-dark-300 outline-none duration-300 placeholder:text-dark-300 placeholder:opacity-80 rounded-full pr-14 py-4 shadow-md focus:shadow-lg focus:shadow-dark-400 pl-10"
                        placeholder="Type here..."
                        name="text"
                        type="text"
                        value={messageText}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                    />
                    <button
                        type="button"
                        className="hover:cursor-pointer"
                        onClick={() => handleCreateFolder()}
                    >
                        <svg className="absolute right-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-dark-200 hover:stroke-brown-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>

    );
};