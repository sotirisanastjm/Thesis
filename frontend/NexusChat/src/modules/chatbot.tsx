import { useRef, useState, useEffect } from "react";
import { Message } from '../Models/Message';
import { useUser } from '../Context/UserProvider';
import { executeTransaction } from '../services/TransactionService';
import { fetchChat, sendMessageToAPI, addMessageToBlockchain, fetchLastDialog } from '../services/ChatService';
import { useSignTransaction } from "@mysten/dapp-kit";
import { SelectFolder } from "../components/select-folder";

export const ChatBot: React.FC = () => {
    const { user, token, messages, setChatID, getChatID, addMessage, setMessages, updateMessage } = useUser();
    const [errorMessage, setErrorMessage] = useState("");
    const [messageText, setMessageText] = useState("");
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const [allMessages, setAllMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessagesLoaded, setNewMessagesLoaded] = useState(false);
    const { mutateAsync: signTransaction } = useSignTransaction();
    const [copied, setCopied] = useState("");
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

    useEffect(() => {
        if (!newMessagesLoaded) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
            setNewMessagesLoaded(false);
        }
    }, [messages]);

    useEffect(() => {
        const fetchData = async () => {
            if (messages.length <= 0 && user) {
                try {
                    setLoading(true);
                    var allMsgs = await fetchChat(user.walletAddress, setChatID);
                    if (allMsgs.length > 0) {
                        setAllMessages(allMsgs);
                        if (allMsgs.length > 20) {
                            setMessages(allMsgs.slice(allMsgs.length - 20, allMsgs.length));
                        } else {
                            setMessages(allMsgs);
                        }
                    }
                    setLoading(false);
                    setNewMessagesLoaded(false);
                } catch (error) {
                    console.error("Error fetching chat:", error);
                }
            }
        };
        fetchData();
    }, [user, messages]);

    const loadMore = () => {
        if (loading || (messages.length == allMessages.length)) return;
        setLoading(true);
        if (allMessages.length - messages.length > 10) {
            const prevMessages = allMessages.slice(allMessages.length - messages.length - 10, allMessages.length - messages.length);
            setMessages([...prevMessages, ...messages]);

        } else {
            const prevMessages = allMessages.slice(0, allMessages.length - messages.length)
            setMessages([...prevMessages, ...messages]);
        }
        setLoading(false);
        setNewMessagesLoaded(true);

    };


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setMessageText(e.target.value);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && messageText !== "") {
            e.preventDefault();
            sendMessage(messageText);
        }
    };

    const sendMessage = async (message: string) => {
        try {
            if (message) {
                const userMsg: Message = { id: "temp-id-user", date: new Date(), message, sender: 1 };
                addMessage(userMsg);
                setMessageText("");

                const request = { msgRequest: userMsg, chatObjectId: getChatID() };
                const response = await sendMessageToAPI(request, token);

                if (response.ok) {
                    const data = await response.json();
                    if (data.bot) {
                        data.bot.id = "temp-id-ai";
                        addMessage(data.bot);

                        await handleTransaction(userMsg, data.bot);
                    } else if (data.error) {
                        setErrorMessage(data.error);
                    }
                } else {
                    console.error("Error sending message:", response.statusText);
                }
            }
        } catch (error) {
            console.error("Request failed:", error);
        }
    };

    const handleTransaction = async (userMsg: Message, botMsg: Message) => {
        try {
            const userTxBytes = await addMessageToBlockchain(userMsg, getChatID(), token, user?.walletAddress);

            if (userTxBytes) {
                let { signature } = await signTransaction({
                    transaction: userTxBytes.txBytes,
                    chain: 'sui:devnet',
                });

                await executeTransaction({ bytes: userTxBytes.txBytes, signature: signature }, token);
                await delay(2000);
            }

            const botTxBytes = await addMessageToBlockchain(botMsg, getChatID(), token, user?.walletAddress);

            if (botTxBytes) {
                let { signature } = await signTransaction({
                    transaction: botTxBytes.txBytes,
                    chain: 'sui:devnet',
                });
                await executeTransaction({ bytes: botTxBytes.txBytes, signature: signature }, token);
                await delay(2000);
            }

            const dialogResponse = await fetchLastDialog(getChatID(), token);
            updateMessage(dialogResponse.userMessage, userMsg.id);
            updateMessage(dialogResponse.botMessage, botMsg.id);

        } catch (error) {
            console.error("Transaction processing failed:", error);
        }
    };

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const handleCopy = async (message: Message) => {
        try {
            await navigator.clipboard.writeText(message.message);
            setCopied(message.id);
            setTimeout(() => setCopied(""), 2000);
        } catch (err) {
            console.error("Failed to copy!", err);
        }
    };

    const saveMessage = (message: Message) => {
        setSelectedMessage(message);
    };

    return (
        <>
            <div className="container fixed inset-x-0 !bottom-0 bg-dark-900 pt-4 pb-8 z-10">
                <div className="text-sm py-2 text-brown-500 font-bold text-center">{errorMessage}</div>
                <form
                    onSubmit={(e) => e.preventDefault()}
                    className="flex justify-center items-center"
                >
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
                            onClick={() => sendMessage(messageText)}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="absolute right-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-dark-200 hover:stroke-brown-500"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                                />
                            </svg>
                        </button>
                    </div>
                </form>
            </div>

            <section className="container inset-0 absolute h-fit">
                <div className="overflow-y-auto pb-32 pt-14">
                    <div className="flex-1 w-full h-full justify-end flex flex-col space-y-16">
                        {loading && (<div className="w-10 h-10 border-4 border-t-dark-200 shadow-sm border-dark-500 rounded-full animate-spin self-center"></div>
                        )}
                        {((allMessages.length - messages.length > 0) && messages.length > 0 && !loading) && (<button onClick={() => loadMore()} className="bg-dark-900 !text-xs self-center text-dark-200 ring-1 ring-dark-600 hover:ring-2 hover:ring-dark-300 duration-300 rounded-xl px-4 py-2 hover:shadow-[0px_0px_20px_5px_rgba(128,128,128,1)] shadow-md active:shadow-2xl active:shadow-dark-400 w-full md:w-fit">Load more</button>)}
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`py-4 relative px-6 rounded-lg max-w-[70%] ${message.sender === 0
                                    ? "bg-dark-600 self-start"
                                    : "bg-brown-700 self-end"
                                    }`}
                            >
                                {message.message}
                                <div className={`flex flex-col gap-1 absolute ${message.sender === 0 ? "left-0 -bottom-12 ml-2" : "right-0 -bottom-12 mr-2"}`}>
                                    <span className="text-[12px] text-brown-600 w-full text-nowrap font-bold">{message.date.toString()}</span>
                                    <div className={`flex flex-row gap-2 ${message.sender === 0 ? "" : "justify-end"}`}>
                                        {message.sender == 1 && (<span className="text-sm text-brown-400 self-center font-bold">{copied != "" && message.id == copied ? "Copied!" : ""}</span>)}
                                        <button onClick={() => { saveMessage(message) }} className="hover:cursor-pointer">
                                            <svg className="w-[24px] h-[24px] hover:stroke-brown-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
                                            </svg>

                                        </button>
                                        <button onClick={() => { handleCopy(message) }} className="hover:cursor-pointer ">
                                            <svg className="active:scale-125 w-[24px] h-[24px] hover:stroke-brown-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                                            </svg>
                                        </button>
                                        {message.sender == 0 && (<span className="text-sm text-brown-400 self-center font-bold">{copied != "" && message.id == copied ? "Copied!" : ""}</span>)}

                                    </div>

                                </div>

                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                </div>
            </section >

            {selectedMessage != null && (<SelectFolder message={selectedMessage} onClick={() => { setSelectedMessage(null) }}></SelectFolder>)}
        </>
    );
};
