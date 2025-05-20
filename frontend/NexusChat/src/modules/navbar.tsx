import { useEffect, useState } from "react";
import ai from "../assets/images/ai.png";
import { Link } from "react-router-dom";
import Login from "../components/login";
import { BannerChat } from "../components/banner-chat";
import BannerFolder from "../components/banner-folder";
import { UserProviderType } from "../Models/UserProvider";
import { useUser } from "../Context/UserProvider";

export const NavBar = () => {

    const user: UserProviderType = useUser();
    const [isOpen, setOpen] = useState(false);
    const [bannerOpen, setBannerOpen] = useState(false);

    useEffect(() => {
        if (isOpen) {
            document.body.classList.add('overflow-y-hidden');
            setTimeout(() => {
                setBannerOpen(true);
            }, 200);
        } else {
            setBannerOpen(false);
            document.body.classList.remove('overflow-y-hidden');
        }

        return () => {
            document.body.classList.remove('overflow-y-hidden');
        };
    }, [isOpen]);

    const [isMobile, setIsMobile] = useState(false);


    const checkWindowSize = () => {
        setIsMobile(window.innerWidth < 1024);
    };

    useEffect(() => {
        checkWindowSize();
        window.addEventListener('resize', checkWindowSize);
        return () => {
            window.removeEventListener('resize', checkWindowSize);
        };
    }, []);

    return (
        <nav className="relative">
            <div className={`fixed z-[999] lg:left-0 bg-dark-800 w-full lg:h-full ${isOpen ? 'lg:w-[50%] lg:shadow-xl lg:shadow-dark-300 lg:border-dark-300' : 'lg:w-[5%]'} flex flex-row-reverse justify-between lg:justify-between lg:flex-col border border-y-0 border-dark-600 transition-all duration-500 ease-in-out`}>
                <Link to="/">
                    <button onMouseLeave={() => setOpen(false)} onMouseEnter={() => isOpen ? setOpen(true) : setOpen(false)} className="p-2 h-full lg:rounded-br-3xl flex justify-center items-center hover:bg-dark-100 duration-300 bg-dark-300 lg:w-full">
                        <img src={ai} className="" />
                    </button>
                </Link>
                <div onMouseEnter={() => !isMobile && setOpen(true)} onMouseLeave={() => !isMobile && setOpen(false)} className="w-full h-auto lg:h-full">
                    <div className="w-full h-fit lg:grid grid-rows-4 lg:py-8 gap-8">

                        <div className={`row-start-1 flex h-full lg:h-fit justify-end px-6 lg:px-0 lg:justify-center items-center`}><Login active={isOpen} onPopUpChange={() => { setOpen(false) }} /></div>



                        {(isOpen && bannerOpen) && (
                            <div className="hidden row-start-3 lg:block"><BannerChat></BannerChat></div>
                        )}
                        {(isOpen && bannerOpen && user.user) && (
                            <div className="hidden row-start-4 lg:block">
                                <div className="p-4 rounded-2xl h-fit mx-auto w-[80%] bg-brown-800 flex flex-col gap-4 items-center text-center justify-center">
                                    <div>
                                        <h2 className="text-lg lg:text-xl font-bold mb-1">Unlock the Power of Organized Knowledge</h2>
                                        <h3>Easily save your messages as notes, keep them organized in folders, and access them whenever you need.</h3>
                                    </div>
                                    <Link to="/notepad">
                                        <button className="bg-dark-900 text-sm text-dark-200 ring-1 ring-dark-600 hover:ring-2 hover:ring-dark-300 duration-300 rounded-xl px-5 py-2 hover:shadow-[0px_0px_20px_5px_rgba(128,128,128,1)] shadow-md active:shadow-2xl active:shadow-dark-400 w-full md:w-fit">Notepad</button>
                                    </Link>
                                </div>
                            </div>
                        )}

                        <BannerFolder active={isOpen} onPopUpChange={() => { setOpen(false) }} />
                    </div>
                </div >

                <button onClick={() => setOpen(!isOpen)} className="lg:hidden h-auto p-2 block">
                    <span className={`block w-8 h-1 bg-dark-200 ${isOpen ? 'rotate-45 origin-bottom-left ease-linear duration-200' : 'origin-top-left ease-linear duration-100'}`}></span>
                    <span className={`mt-2 block w-8 h-1 bg-dark-200 ${isOpen ? 'opacity-0 duration-100' : 'opacity-1 duration-100'}`}></span>
                    <span className={`mt-2 block w-8 h-1 bg-dark-200 ${isOpen ? '-rotate-45 origin-top-left ease-linear duration-200' : 'origin-bottom-left ease-linear duration-100'}`}></span>
                </button>

            </div>
            <div className={`fixed flex flex-col justify-center z-[998] block lg:hidden left-0 bg-dark-800 h-full ${isOpen ? 'w-[80%] shadow-xl shadow-dark-300 border-dark-300' : 'w-[0%]'} border border-y-0 border-dark-600 transition-all duration-500 ease-in-out`}>
                {(isOpen && bannerOpen) && (<div className="lg:hidden block"><BannerChat></BannerChat></div>)}
            </div>
        </nav>
    );
};
