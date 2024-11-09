import { v4 as uuidv4 } from 'uuid';
import React, { useRef, useState, useEffect } from "react";

type Message = {
    id?: string;
    date?: Date;
    message: string;
    sender: 0 | 1;
};

export const ChatBot: React.FC = () => {
    const sendMessage = async (message: Message) => {
        try {
            const response = await fetch("https://localhost:7261/api/Chat/sendMessage",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        accept: "*/*",
                    },
                    body: JSON.stringify(message),
                }
            );

            if (response.ok) {
                const data = await response.json();
                if(data.bot){
                    setMessages((prevMessages) => [ ...prevMessages, data.bot, ]);
                }else if(!data.bot && data.error){
                    setErrorMessage(data.error);
                }
            } else {
                console.error("Error:", response.statusText);
            }
        } catch (error) {
            console.error("Request failed", error);
        }
    };

    const [messages, setMessages] = useState<Message[]>([]);
    const [errorMessage, setErrorMessage] = useState("");

    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const [messageText, setMessageText] = useState("");

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessageText(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && messageText != "") {
            e.preventDefault();
            addMessage(messageText);
        }
    };

    const addMessage = (message: string) => {
        if (messageText != "") {
            var userMsg: Message = {
                id:  uuidv4(),
                date: new Date(),
                message: message,
                sender: 1
            }
            setMessages((prevMessages) => [ ...prevMessages, userMsg, ]);
            sendMessage(userMsg);
            setMessageText("");
        }
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
                            onClick={() => addMessage(messageText)}
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
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`py-4 px-6 rounded-lg max-w-[70%] ${
                                    message.sender === 0
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
