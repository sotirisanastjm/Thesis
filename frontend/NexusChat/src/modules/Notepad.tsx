import { useState } from "react";
import { useUser } from "../Context/UserProvider";
import { UserProviderType } from "../Models/UserProvider";
import image from "../assets/images/notes.jpg";
import { FolderComponent } from "../components/folder-component";
import { Folder } from "../Models/Folder";
import { CreateFolder } from "../components/create-folder";
import { useNavigate } from "react-router-dom";
import { BannerChat } from "../components/banner-chat";

export const Notepad = () => {
    const [selectedFolder, setFolder] = useState<Folder | null>(null);
    const [createFolder, setCreateFolder] = useState(false);
    const user: UserProviderType = useUser();
    const [isOpenFolder, setOpenFolder] = useState(false);
    const navigate = useNavigate();

    const openFolder = (id: string) => {
        let folder = user.notepad?.folders.find((folder) => id == folder.id);
        if (folder) {
            setFolder(folder);
            setOpenFolder(true);
        }
    };

    if (!user.user) {
        navigate('/');
    } else {
        return (
            <>
                <section className='relative mb-20'>
                    <img className='w-full h-[400px] lg:h-[500px] object-cover' alt="Image that says be Creative" src={image} />
                    <div className="absolute backdrop-blur-[5px] h-full inset-0 bg-dark-900/60"></div>
                    <div className='container px-4 text-center flex flex-col items-center justify-center gap-4 absolute inset-0 mx-auto'>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-dark-200">
                            Notepad
                        </h1>
                        <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-dark-300 lg:w-[60%]">
                            Save your messages as notes, organize them in folders, and access everything anytime
                        </p>

                    </div>
                </section>

                {user.notepad?.folders && (
                    <section className=" container mx-auto w-fit grid gap-x-8 gap-y-16 grid-cols-2 justify-items-center sm:grid-cols-3 lg:grid-cols-6">
                        {user.notepad.folders.map((folder) => (
                            <FolderComponent onClick={(id) => { openFolder(id); }} id={folder.id} key={folder.id} title={folder.name} active={true} />

                            // <div className="relative group hidden lg:flex flex-col items-center justify-center w-full h-full" >
                            //         <div className="file relative w-60 h-40 cursor-pointer origin-bottom [perspective:1500px] z-50">
                            //             <div className="work-5 bg-[#fbbf24] w-full h-full origin-top rounded-2xl rounded-tl-none group-hover:shadow-[0_20px_40px_rgba(0,0,0,.2)] transition-all ease duration-300 relative after:absolute after:content-[''] after:bottom-[99%] after:left-0 after:w-20 after:h-4 after:bg-[#fbbf24] after:rounded-t-2xl before:absolute before:content-[''] before:-top-[15px] before:left-[75.5px] before:w-4 before:h-4 before:bg-[#fbbf24] before:[clip-path:polygon(0_35%,0%_100%,50%_100%);]"></div>
                            //             <div className="work-4 absolute inset-1 bg-dark-400 rounded-2xl transition-all ease duration-300 origin-bottom select-none group-hover:[transform:rotateX(-20deg)]"></div>
                            //             <div className="work-3 absolute inset-1 bg-dark-300 rounded-2xl transition-all ease duration-300 origin-bottom group-hover:[transform:rotateX(-30deg)]"></div>
                            //             <div className="work-2 absolute inset-1 bg-dark-200 rounded-2xl transition-all ease duration-300 origin-bottom group-hover:[transform:rotateX(-38deg)]"></div>
                            //             <div className="work-1 absolute bottom-0 bg-gradient-to-t from-[#f59e0b] to-[#fbbf24] w-full h-[156px] rounded-2xl rounded-tr-none after:absolute after:content-[''] after:bottom-[99%] after:right-0 after:w-[146px] after:h-[16px] after:bg-amber-400 after:rounded-t-2xl before:absolute before:content-[''] before:-top-[10px] before:right-[142px] before:size-3 before:bg-amber-400 before:[clip-path:polygon(100%_14%,50%_100%,100%_100%);] transition-all ease duration-300 origin-bottom flex items-end group-hover:shadow-[inset_0_20px_40px_#fbbf24,_inset_0_-20px_40px_#d97706] group-hover:[transform:rotateX(-46deg)_translateY(1px)]"></div>
                            //         </div>
                            //         <p className="text-3xl pt-4 opacity-20">{folder.name}</p>
                            //     </div>
                        ))}

                        <button onClick={() => { setCreateFolder(true); }} className={`p-4 w-fit bg-dark-600/60 rounded-2xl hover:cursor-pointer active:bg-dark-600/30 hover:shadow-xl hover:shadow-dark-600 hover:scale-105`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="48" height="48" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="fill-[#FFA000] stroke-dark-900">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
                            </svg>
                        </button>


                        {createFolder && (
                            <CreateFolder onClick={() => { setCreateFolder(false); }}></CreateFolder>
                        )}

                        {isOpenFolder && (
                            <div className="fixed backdrop-blur-sm w-full h-full inset-0">
                                <div className="bg-dark-900 shadow-2xl shadow-dark-400 opacity-[0.96] center-modal left-[50%] top-[50%] absolute w-[90%] sm:w-4/5 lg:w-[60%] h-[70%] rounded-xl p-8 flex flex-col gap-8 items-center">
                                    <button className="hover:cursor-pointer" onClick={() => { setOpenFolder(false) }}>
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
                                        {/* <div ref={notesEndRef} /> */}
                                    </div>
                                </div>
                            </div>
                        )}
                    </section >
                )}

                <section className="container space-y-8">
                    <div>
                        <h2 className="text-3xl font-serif font-bold text-center">
                            Your AI Notes, Secured and Sorted
                        </h2>
                    </div>
                    <div className="grid justify-items-center items-center grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                        <div className="space-y-2 p-6 border border-dark-200 h-full">
                            <h4 className="text-2xl font-bold text-brown-300">Save What Matters</h4>
                            <p className="text-lg font-medium">
                                Securely store your AI-generated messages, code snippets, and insights as notes you can revisit anytime.
                            </p>
                        </div>

                        <div className="space-y-2 p-6 border border-dark-200 h-full">
                            <h4 className="text-2xl font-bold text-brown-300">Organize with Folders</h4>
                            <p className="text-lg font-medium">
                                Group your notes into custom folders to keep your coding ideas, chat responses, and tutorials neatly sorted.
                            </p>
                        </div>

                        <div className="space-y-2 p-6 border border-dark-200 h-full">
                            <h4 className="text-2xl font-bold text-brown-300">Built on Blockchain</h4>
                            <p className="text-lg font-medium">
                                Your notes are saved on the Sui blockchain — tamper-proof, decentralized, and always accessible.
                            </p>
                        </div>
                    </div>
                </section>
            </>
        );
    };

}
