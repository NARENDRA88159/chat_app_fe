import React, { useEffect, useRef, useState } from 'react'
import Header from '../Components/Header'
import axiosWithHeaders from '../Helper/axiosWithHeaders'
import { apis } from '../api'
import Cookies from 'js-cookie'
import { decodeJwtToken } from '../Utils/decodeJwtToken'
import { TbSend2 } from 'react-icons/tb'
import {io} from "socket.io-client"

const Main = () => {
    const [data, setData] = useState([])
    const socket = io(import.meta.env.VITE_APP_LOCAL_API_URL)
    const messagesEndRef = useRef(null)

    useEffect(() => {
        const allMessages = async () => {
            try {
                const response = await axiosWithHeaders.post(`${apis?.GETALLMESSAGES}`);
                console.log(response.data, "sssssssss");
                setData(response?.data)
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };

        allMessages();
    }, [])

    useEffect(() => {
        socket.on("connect", () => {
         console.log("websocket connected")
        })
        socket.on("message", (message) => {
            console.log("ssssssssssssss", message)
            setData((pre)=>([...pre,message]))
        })

        socket.on("disconnect", () => {
            console.log("WebSocket disconnected");
        });

        return () => {
            socket.off("connect");
            socket.off("message");
            socket.off("disconnect");
        }
    }, [])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [data])

    const token = Cookies.get("token")
    const decodejwt = decodeJwtToken(token)
    console.log("dddddddddddddd", decodejwt)
    const [message, setMessage] = useState("")

    const handleSendMessage = async () => {
        const payload={"message":message,"sender_id":decodejwt?.user_id}
        const response = await axiosWithHeaders.post(`${apis?.CREATMESSAGE}`, payload)
        socket.emit("message",response?.data)
        setMessage("")
    }

    const textareaRef = useRef();
    const autoResize = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    };

    useEffect(() => {
        autoResize();
    }, [message]);

    return (
        <div className='w-full min-h-[100vh] bg-gray-100 bg-[url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")] bg-repeat'>
            <div className='sticky top-0 z-10'>
                <Header/>
            </div>
            <div className='px-4 pt-2 pb-16 max-h-[85vh] overflow-y-auto'>
                {data && data?.map((item) => {
                    const isOwnMessage = decodejwt?.user_id === item?.sender_id;
                    return (
                        <div key={item._id} className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} mb-4`}>
                            <div className={`max-w-[48vw] break-words p-3 rounded-lg shadow relative ${
                                isOwnMessage
                                    ? "bg-green-500 text-white rounded-br-none"
                                    : "bg-white text-gray-800 rounded-bl-none"
                            }`}>
                                <span>{item?.message}</span>
                                {/* Tail for chat bubble */}
                                {/* <div className={`absolute top-0 ${isOwnMessage ? "right-[-6px]" : "left-[-6px]"} w-3 h-3 ${
                                    isOwnMessage ? "border-r-8 border-r-green-500 border-b-8 border-b-transparent rotate-180"
                                                : "border-l-8 border-l-white border-b-8 border-b-transparent"
                                }`}></div> */}
                            </div>
                        </div>
                    )
                })}
                <div ref={messagesEndRef} />
            </div>

            <div className='fixed bottom-0 w-full bg-gray-100 p-3 flex items-center border-t border-gray-300'>
                <textarea
                    ref={textareaRef}
                    className="flex-1 scrollbar-hidden outline-none border border-gray-300 rounded-4xl resize-none text-gray-800 bg-white px-4 py-2 max-h-[10vh] overflow-y-auto"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message"
                    rows={1}
                />
                <button
                    className='ml-2 w-10 h-10 rounded-full flex justify-center items-center bg-green-500 text-white hover:bg-green-600'
                    onClick={handleSendMessage}
                >
                    <TbSend2 size={20} />
                </button>
            </div>
        </div>
    )
}

export default Main