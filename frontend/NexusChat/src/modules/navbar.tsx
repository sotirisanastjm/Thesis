import { useEffect, useState } from "react";
import ai from "../assets/images/ai.png";
import { Link } from "react-router-dom";
import { Folder } from "../components/folder";

export const NavBar = () => {

    const [isOpen, setOpen] = useState(false);
    const folders : any[] = [
        {
            title: "Title1"
        },
        {
            title: "Title2"
        },
        {
            title: "Title3"
        },
        {
            title: "Title4"
        },
        {
            title: "Title5"
        },
        {
            title: "Title6"
        },
        {
            title: "Title6"
        }
    ];
    useEffect(() => {
        if (isOpen) {
          document.body.classList.add('overflow-y-hidden');
        } else {
          document.body.classList.remove('overflow-y-hidden');
        }
    
        // Cleanup: Remove class on component unmount or when isOpen changes
        return () => {
          document.body.classList.remove('overflow-y-hidden');
        };
      }, [isOpen]);

    return (
        <nav className="relative">
            <div className={`fixed z-[999] lg:left-0 bg-dark-800 w-full lg:h-full ${isOpen ? 'lg:w-[50%] lg:shadow-xl lg:shadow-dark-300 lg:border-dark-300' : 'lg:w-[5%]'} flex flex-row-reverse justify-between lg:justify-normal lg:flex-col border border-y-0 border-dark-600 transition-all duration-500 ease-in-out`}>
                <Link to="/">
                    <button onMouseLeave={() => setOpen(false)} onMouseEnter={() => isOpen ? setOpen(true) : setOpen(false)}   className="p-2 lg:rounded-br-3xl flex justify-center items-center hover:bg-dark-100 duration-300 bg-dark-300 lg:w-full">
                        <img src={ai} className="" />
                    </button>
                </Link>
                <div onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)} className="w-full h-full">
                    <div className="hidden lg:flex justify-center items-center h-full">
                        <div className={`transition-all duration-700 grid ${isOpen ? ' grid-cols-2 gap-4 lg:grid-cols-3' : 'grid-cols-1 gap-2'}`}>
                            {/* {folders.map((folder) => (<Folder title={folder.title} active={isOpen}/>))} */}
                            {folders.slice(0, folders.length > 6 ? 5 : folders.length).map((folder) => (
                                <Folder key={folder.id} title={folder.title} active={isOpen} />
                                ))}
                            {folders.length > 6 && (
                                <Folder active={isOpen} moreFolders={true} />
                            )}
                        </div>
                    </div>
                </div>
                <button onClick={() => setOpen(!isOpen)} className="lg:hidden h-fit p-2 block">
                    <span className={`block w-8 h-1 bg-dark-200 ${isOpen ? 'rotate-45 origin-bottom-left ease-linear duration-200' : 'origin-top-left ease-linear duration-100'}`}></span>
                    <span className={`mt-2 block w-8 h-1 bg-dark-200 ${isOpen ? 'opacity-0 duration-100' : 'opacity-1 duration-100'}`}></span>
                    <span className={`mt-2 block w-8 h-1 bg-dark-200 ${isOpen ? '-rotate-45 origin-top-left ease-linear duration-200' : 'origin-bottom-left ease-linear duration-100'}`}></span>
                </button>
            </div>
            <div className={`fixed z-[998] block lg:hidden left-0 bg-dark-800 h-full ${isOpen ? 'w-[80%] shadow-xl shadow-dark-300 border-dark-300' : 'w-[0%]'} border border-y-0 border-dark-600 transition-all duration-1000 ease-in-out`}>
            
            </div>
        </nav>
    );
};
