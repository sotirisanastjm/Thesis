import { useRef, useState, useEffect } from "react";
import { Message } from '../Models/Message';
import { useUser } from '../Context/UserProvider';
import { signTransaction, executeTransaction } from '../services/TransactionService';
import { fetchChat, sendMessageToAPI, addMessageToBlockchain, fetchLastDialog } from '../services/ChatService';

export const ChatBot: React.FC = () => {
    const { user, token, messages, setChatID, getChatID, addMessage, setMessages, updateMessage } = useUser();
    const [errorMessage, setErrorMessage] = useState("");
    const [messageText, setMessageText] = useState("");
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const [allMessages, setAllMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessagesLoaded, setNewMessagesLoaded] = useState(false);

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
                    if(allMsgs.length > 0){
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
            const userMsgBlock = await signTransaction(userTxBytes.txBytes);
            await executeTransaction(userMsgBlock, token);
            await delay(2000);

            const botTxBytes = await addMessageToBlockchain(botMsg, getChatID(), token, user?.walletAddress);
            const botMsgBlock = await signTransaction(botTxBytes.txBytes);
            await executeTransaction(botMsgBlock, token);
            await delay(2000);

            const dialogResponse = await fetchLastDialog(getChatID(), token);
            updateMessage(dialogResponse.userMessage, userMsg.id);
            updateMessage(dialogResponse.botMessage, botMsg.id);

        } catch (error) {
            console.error("Transaction processing failed:", error);
        }
    };

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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
                    <div className="flex-1 w-full h-full justify-end flex flex-col space-y-8">
                        {loading && (<div className="w-10 h-10 border-4 border-t-dark-200 shadow-sm border-dark-500 rounded-full animate-spin self-center"></div>
                        )}
                        {((allMessages.length - messages.length > 0) && messages.length > 0 && !loading) && (<button onClick={() => loadMore()} className="bg-dark-900 !text-xs self-center text-dark-200 ring-1 ring-dark-600 hover:ring-2 hover:ring-dark-300 duration-300 rounded-xl px-4 py-2 hover:shadow-[0px_0px_20px_5px_rgba(128,128,128,1)] shadow-md active:shadow-2xl active:shadow-dark-400 w-full md:w-fit">Load more</button>)}
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`py-4 px-6 rounded-lg max-w-[70%] ${message.sender === 0
                                    ? "bg-dark-600 self-start"
                                    : "bg-brown-700 self-end"
                                    }`}
                            >
                                {message.message}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                </div>
            </section>
        </>
    );
};
