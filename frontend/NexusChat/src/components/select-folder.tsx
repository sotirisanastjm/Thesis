import { useState } from "react";
import { useUser } from "../Context/UserProvider";
import { Message } from "../Models/Message";
import { UserProviderType } from "../Models/UserProvider";
import { CreateFolder } from "./create-folder";
import { FolderComponent } from "./folder-component";
import { addNoteAsync } from "../services/NoteService";
import { useSignTransaction } from "@mysten/dapp-kit";
import { executeTransaction } from "../services/TransactionService";

type SelectFolderProps = {
    message: Message,
    onClick?: (flag: boolean) => void;
};

export const SelectFolder = ({ message, onClick }: SelectFolderProps) => {

    const user: UserProviderType = useUser();
    const [createFolder, setCreateFolder] = useState(false);
    const [error, setError] = useState(false);
    const { mutateAsync: signTransaction } = useSignTransaction();

    const addNote = async (id: string) => {
        if (!isNoteInFolder(id, message.id)) {
            user.addNoteToFolder(id, message);
            onClick?.(false);
            const index = user.notepad?.folders.findIndex((folder) => folder.id == id);
            if (user?.token && user.user && user?.notepad && index != undefined) {
                const response: any = await addNoteAsync(user.token, user.notepad.id, index, message, user?.user?.walletAddress);

                let { signature } = await signTransaction({
                    transaction: response?.txBytes,
                    chain: 'sui:devnet',
                });

                await executeTransaction({ bytes: response?.txBytes, signature: signature }, user?.token);
            }
        } else {
            setError(true);
        }
    };

    const isNoteInFolder = (folderId: string, noteId: string): boolean => {
        if (!user.notepad) return false;

        const folder = user.notepad.folders.find((f) => f.id === folderId);
        if (!folder) return false;

        return folder.notes.some((note) => note.id === noteId);
    };


    return (
        <div className="fixed backdrop-blur-sm w-full h-full inset-0">
            <div className="bg-dark-900 shadow-2xl shadow-dark-400 opacity-[0.96] center-modal left-[50%] top-[50%] absolute w-[90%] sm:w-4/5 lg:w-[60%] h-[70%] rounded-xl p-4 flex flex-col gap-20 items-center">
                <button className="hover:cursor-pointer" onClick={() => { onClick?.(false) }}>
                    <svg className="absolute top-0 right-0 mt-2 mr-4 size-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                </button>
                <div className="text-center w-full lg:w-2/3 mx-auto">
                    <h2 className="text-2xl lg:text-3xl font-bold mb-2">Notepad</h2>
                    <h3 className="text-lg lg:text-xl text-brown-500">Save messages as notes and keep them neatly organized</h3>
                </div>

                {user.notepad && (

                    <div className={`transition-all p-14 overflow-y-auto duration-700 w-fit justify-items-center grid grid-cols-2 gap-x-14 gap-y-14 lg:grid-cols-3`}>
                        {user.notepad.folders.map((folder) => (
                            <FolderComponent onClick={(id) => { addNote(id) }} id={folder.id} key={folder.id} title={folder.name} active={true} />
                        ))}
                        <button onClick={() => { setCreateFolder(true) }} className={`p-4 w-fit bg-dark-600/60 rounded-2xl hover:cursor-pointer active:bg-dark-600/30 hover:shadow-xl hover:shadow-dark-600 hover:scale-105`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" width={`48`} height={`48`} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="fill-[#FFA000] stroke-dark-900">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
                            </svg>
                        </button>


                    </div>

                )}
            </div>
            {createFolder && (
                <CreateFolder onClick={() => { setCreateFolder(false); }}></CreateFolder>
            )}
            {error && (
                <div className="fixed backdrop-blur-[2px] w-full h-full inset-0">
                    <div className="bg-dark-900 shadow-2xl shadow-dark-400 center-modal left-[50%] top-[50%] absolute w-[80%] sm:w-[40%] h-[20%] rounded-xl p-8 flex flex-col gap-20 items-center">
                        <button className="hover:cursor-pointer" onClick={() => { setError(false) }}>
                            <svg className="absolute top-0 right-0 mt-2 mr-4 size-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                        </button>
                        <div className="text-center w-full lg:w-2/3 mx-auto">
                            <h3 className="text-lg lg:text-xl text-red">This Message already exists in this Folder.</h3>
                        </div>


                    </div>

                </div>
            )}
        </div>

    );
};