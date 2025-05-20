import { Link } from "react-router-dom";
import { UserProviderType } from "../Models/UserProvider";
import { useUser } from "../Context/UserProvider";

export const BannerChat = () => {

    const userProvider: UserProviderType = useUser();

    return (
        <>
            <div className="p-4 rounded-2xl h-fit mx-auto w-[80%] bg-brown-800 flex flex-col gap-4 items-center text-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>

                {userProvider.user ? (
                    <>
                        <div>
                            <h2 className="text-lg lg:text-xl font-bold mb-1">Your AI Guide to Blockchain</h2>
                            <h3>Get real-time support, coding help, and personalized insights to build your next DApp – powered by NexusChat.</h3>
                        </div>
                        <Link to="/chat">
                            <button className="bg-dark-900 text-sm text-dark-200 ring-1 ring-dark-600 hover:ring-2 hover:ring-dark-300 duration-300 rounded-xl px-5 py-2 hover:shadow-[0px_0px_20px_5px_rgba(128,128,128,1)] shadow-md active:shadow-2xl active:shadow-dark-400 w-full md:w-fit">let's Chat Together</button>
                        </Link>
                    </>
                ) : (
                    <div>
                        <h2 className="text-xl lg:text-2xl font-bold mb-1">Your AI Guide to Blockchain</h2>
                        <h3>Get real-time support, coding help, and personalized insights to build your next DApp – powered by NexusChat.</h3>
                        <h4 className="mt-6 px-6 mx-auto w-fit bg-[rgba(128,128,128,1)] rounded-xl shadow-[0px_0px_20px_5px_rgba(128,128,128,0.4)] text-lg text-dark-200 font-bold">
                            To get started, please log in with your wallet.
                        </h4>
                    </div>

                )}
            </div>
        </>
    );
};
