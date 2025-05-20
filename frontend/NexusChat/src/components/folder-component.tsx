type FolderProps = {
    id: string;
    title?: string;
    active?: boolean;
    onClick?: (id: string) => void;
};

export const FolderComponent = ({ id, title, active, onClick }: FolderProps) => {

    return (
        <div className={` w-full bg-dark-600/60 rounded-2xl hover:cursor-pointer active:bg-dark-600/30 hover:shadow-xl hover:shadow-dark-600 hover:scale-105`}>
            <div className={`group relative `}>
                <span className={`${active ? "absolute -top-16 left-[50%] -translate-x-[50%] z-20 origin-left scale-0 px-3 rounded-lg border border-gray-300 bg-white py-2 text-sm font-bold hidden lg:block shadow-md transition-all duration-200 ease-in-out group-hover:scale-100" : "hidden"}`}>{title}</span>
                <button onClick={() => onClick?.(id)} className={`flex mx-auto flex-col justify-center items-center duration-200 ${active ? "m-4" : "m-2"}`}>
                    <svg xmlns="http://www.w3.org/2000/svg"
                        x="0px" y="0px" width={`${active ? "48" : "24"}`} height={`${active ? "48" : "24"}`} viewBox="0 0 48 48">
                        <path fill="#FFA000" d="M40,12H22l-4-4H8c-2.2,0-4,1.8-4,4v8h40v-4C44,13.8,42.2,12,40,12z"></path>
                        <path fill="#FFCA28" d="M40,12H8c-2.2,0-4,1.8-4,4v20c0,2.2,1.8,4,4,4h32c2.2,0,4-1.8,4-4V16C44,13.8,42.2,12,40,12z"></path>
                    </svg>
                    <span className="lg:hidden font-black text-xs text-center text-brown-400">{title}</span>
                </button>
            </div>

        </div>
    );
};
