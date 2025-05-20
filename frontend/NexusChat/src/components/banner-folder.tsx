import { useEffect, useRef, useState } from "react";
import { useUser } from "../Context/UserProvider";
import { UserProviderType } from "../Models/UserProvider";
import { FolderComponent } from "./folder-component";
import { Folder } from "../Models/Folder";
import { CreateFolder } from "./create-folder";
import { Link } from "react-router-dom";


const BannerFolder = (props: { active: boolean; onPopUpChange: (newState: boolean) => void }) => {
    const modalOpen = props.active;
    const user: UserProviderType = useUser();
    const [popUp, setPopUp] = useState(false);
    const [createFolder, setCreateFolder] = useState(false);
    const [selectedFolder, setFolder] = useState<Folder | null>(null);
    const [isOpenFolder, setOpenFolder] = useState(false);
    const notesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (selectedFolder?.id) {
            notesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [selectedFolder?.id]);

    useEffect(() => {
        if (popUp) props.onPopUpChange(popUp);

        if (popUp) {
            document.body.classList.add('overflow-y-hidden');

        } else {
            document.body.classList.remove('overflow-y-hidden');
        }

        return () => {
            document.body.classList.remove('overflow-y-hidden');
        };
    }, [popUp, props]);

    const openFolder = (id: string) => {
        let folder = user.notepad?.folders.find((folder) => id == folder.id);
        if (folder) {
            setFolder(folder);
            setOpenFolder(true);
        }
    };

    return (

        <>
            {user.notepad && (

                <div className="hidden lg:h-full lg:flex justify-center items-center">
                    <div className={`transition-all duration-700 grid ${modalOpen ? ' grid-cols-2 gap-x-4 gap-y-14 lg:grid-cols-3' : 'grid-cols-1 gap-2'}`}>
                        {user.notepad.folders.slice(0, user.notepad.folders.length > 5 ? 5 : user.notepad.folders.length).map((folder) => (
                            <FolderComponent onClick={(id) => { openFolder(id); setPopUp(true) }} id={folder.id} key={folder.id} title={folder.name} active={modalOpen} />
                        ))}
                        {user.notepad.folders.length < 6 && (
                            <button onClick={() => { setPopUp(true); setCreateFolder(true); }} className={`${modalOpen ? 'p-4' : 'p-2'} w-fit bg-dark-600/60 rounded-2xl hover:cursor-pointer active:bg-dark-600/30 hover:shadow-xl hover:shadow-dark-600 hover:scale-105`}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" width={`${modalOpen ? "48" : "24"}`} height={`${modalOpen ? "48" : "24"}`} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="fill-[#FFA000] stroke-dark-900">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
                                </svg>
                            </button>
                        )}
                        {user.notepad.folders.length > 5 && (
                            <Link to="/notepad" className={`${modalOpen ? 'p-4' : 'p-2'} w-full bg-dark-600/60 rounded-2xl hover:cursor-pointer active:bg-dark-600/30 hover:shadow-xl hover:shadow-dark-600 hover:scale-105`}>
                                <svg xmlns="http://www.w3.org/2000/svg" width={`${modalOpen ? "48" : "24"}`} height={`${modalOpen ? "48" : "24"}`} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="stroke-dark-900">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 0 0 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v2.25A2.25 2.25 0 0 0 6 10.5Zm0 9.75h2.25A2.25 2.25 0 0 0 10.5 18v-2.25a2.25 2.25 0 0 0-2.25-2.25H6a2.25 2.25 0 0 0-2.25 2.25V18A2.25 2.25 0 0 0 6 20.25Zm9.75-9.75H18a2.25 2.25 0 0 0 2.25-2.25V6A2.25 2.25 0 0 0 18 3.75h-2.25A2.25 2.25 0 0 0 13.5 6v2.25a2.25 2.25 0 0 0 2.25 2.25Z" />
                                </svg>
                            </Link>
                        )}
                    </div>
                </div>
            )}

            {popUp && createFolder && (
                <CreateFolder onClick={() => { setCreateFolder(false); setPopUp(false) }}></CreateFolder>
            )}

            {popUp && isOpenFolder && (
                <div className="fixed backdrop-blur-sm w-full h-full inset-0">
                    <div className="bg-dark-900 shadow-2xl shadow-dark-400 opacity-[0.96] center-modal left-[50%] top-[50%] absolute w-[90%] sm:w-4/5 lg:w-[60%] h-[70%] rounded-xl p-8 flex flex-col gap-8 items-center">
                        <button className="hover:cursor-pointer" onClick={() => { setOpenFolder(false); setPopUp(false) }}>
                            <svg className="absolute top-0 right-0 mt-2 mr-4 size-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                        </button>

                        <h2 className="text-2xl lg:text-3xl font-bold">{selectedFolder?.name}</h2>

                        <div className="flex-1 w-full h-full justify-end flex flex-col space-y-8">

                            {selectedFolder?.notes.map((note) => (
                                <div
                                    key={note.id}
                                    className={`py-4 px-6 rounded-lg max-w-[70%] ${note.sender === 0
                                        ? "bg-dark-600 self-start"
                                        : "bg-brown-700 self-end"
                                        }`}
                                >
                                    {note.message}
                                </div>
                            ))}
                            <div ref={notesEndRef} />
                        </div>
                    </div>
                </div>
            )}
        </>

    );
};


export default BannerFolder;