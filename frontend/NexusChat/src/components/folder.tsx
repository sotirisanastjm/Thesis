export const Folder = (props: { title?: string; active?: boolean, moreFolders?: boolean }) => {
    // const title = props.title;
    const active = props.active;
    const moreFolders = props.moreFolders;

    return (
        <div className={` w-fit bg-dark-600/60 rounded-2xl hover:cursor-pointer active:bg-dark-600/30 ${moreFolders && '!w-full'} hover:shadow-xl hover:shadow-dark-600 hover:scale-105 ${active && !moreFolders ? "p-4" : "p-2"}`}>
            {moreFolders && (
                <div className={`${active ? "text-4xl" : "text-lg"} w-full h-full content-end text-center`}>...</div>
            )}
            {!moreFolders && (    
                <svg xmlns="http://www.w3.org/2000/svg"
                    x="0px" y="0px" width={`${active ? "48" : "24"}`} height={`${active ? "48" : "24"}`} viewBox="0 0 48 48">
                    <path fill="#FFA000" d="M40,12H22l-4-4H8c-2.2,0-4,1.8-4,4v8h40v-4C44,13.8,42.2,12,40,12z"></path>
                    <path fill="#FFCA28" d="M40,12H8c-2.2,0-4,1.8-4,4v20c0,2.2,1.8,4,4,4h32c2.2,0,4-1.8,4-4V16C44,13.8,42.2,12,40,12z"></path>
                </svg>
            )}
        </div>
    );
};
