import React, { useEffect, useRef, useState } from 'react'
import Header from '../Components/Header'
import axiosWithHeaders from '../Helper/axiosWithHeaders'
import { apis } from '../api'
import Cookies from 'js-cookie'
import { decodeJwtToken } from '../Utils/decodeJwtToken'
import { TbSend2 } from 'react-icons/tb'
import {io} from "socket.io-client"
import { RiArrowDownSLine } from 'react-icons/ri'
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MessageUpdateModal from '../Components/Modals/Message_Update_Modal'
import VoiceRecorder from '../Components/VoiceRecorder'
import { FiPaperclip } from 'react-icons/fi'
import UploadModal from '../Components/Modals/Upload_image_Modal'

const Main = () => {
    const [data, setData] = useState([])
    console.log("dddddddddddd",data)
    const socket = io(import.meta.env.VITE_APP_LOCAL_API_URL)
    const messagesEndRef = useRef(null)
    const dataRef = useRef([]);
    const [page, setPage] = useState(1);
const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const messagesContainerRef = useRef(null); // Add this ref

const fetchMessages = async (pageNum = 1) => {
    let prevScrollHeight, prevScrollTop;
    if (messagesContainerRef.current && pageNum !== 1) {
        prevScrollHeight = messagesContainerRef.current.scrollHeight;
        prevScrollTop = messagesContainerRef.current.scrollTop;
    }
    setLoading(true);
    try {
        const response = await axiosWithHeaders.post(`${apis?.GETALLMESSAGES}?limit=20&page=${pageNum}`);
        const newMessages = response?.data || [];
        if (pageNum === 1) {
            setData(newMessages);
        } else {
            setData(prev => [...newMessages, ...prev]);
        }
        if (newMessages.length < 20) setHasMore(false);
    } catch (error) {
        setHasMore(false);
    }
    setLoading(false);

    // Restore scroll position after loading older messages
    if (messagesContainerRef.current && pageNum !== 1 && prevScrollHeight !== undefined) {
        setTimeout(() => {
            const newScrollHeight = messagesContainerRef.current.scrollHeight;
            messagesContainerRef.current.scrollTop = newScrollHeight - prevScrollHeight + prevScrollTop;
        }, 1);
    }
};
    // Initial load
    useEffect(() => {
        fetchMessages(1);
    }, []);

    // Infinite scroll handler
    const handleScroll = (e) => {
        if (e.target.scrollTop === 0 && hasMore && !loading) {
            fetchMessages(page + 1);
            setPage(prev => prev + 1);
        }
    };

useEffect(() => {
    dataRef.current = data;
}, [data]);

    // useEffect(() => {
    //     const allMessages = async () => {
    //         try {
    //             const response = await axiosWithHeaders.post(`${apis?.GETALLMESSAGES}`);
    //             console.log(response.data, "sssssssss");
    //             setData(response?.data)
    //         } catch (error) {
    //             console.error("Error fetching messages:", error);
    //         }
    //     };

    //     allMessages();
    // }, [])

    useEffect(() => {
        socket.on("connect", () => {
         console.log("websocket connected")
        })
        socket.on("message", (message) => {
            console.log("ssssssssssssss", message)
            setData((pre)=>([...pre,message]))
        })

        socket.on("UploadImage", (message) => {

            setData((pre)=>([...pre,message]))
        })

        socket.on("SendAudioMessage", (message) => {
            console.log("SendAudioMessageSendAudioMessage",message)

            setData((pre)=>([...pre,message]))
        })

        socket.on("UpdateMessage", (message) => {
            console.log("messagemessagemessagemessage",message)
            console.log("datadata",data)
            console.log("datadata", dataRef.current);

        const index = dataRef.current.findIndex((item) => item?._id === message?._id);
        if (index !== -1) {
            const updatedData = [...dataRef.current];
            updatedData.splice(index, 1, message);
            setData(updatedData); // updates state and ref will sync on next render
        }

        })

        socket.on("DeleteMessage", (message) => {
            console.log("DeleteMessageDeleteMessageDeleteMessageDeleteMessage",message)

        const index = dataRef.current.findIndex((item) => item?.message_id === message?.message_id);
        if (index !== -1) {
            const updatedData = [...dataRef.current];
            updatedData.splice(index, 1,message);
            setData(updatedData); // updates state and ref will sync on next render
        }

        })



        socket.on("disconnect", () => {
            console.log("WebSocket disconnected");
        });

        return () => {
            socket.off("connect");
            socket.off("message");
            socket.off("disconnect");
            socket.off("SendAudioMessage")
            socket.off("UploadImage")
        }
    }, [])
    const [prevDataLength, setPrevDataLength] = useState(0);
    // useEffect(() => {
    //     // Only scroll if a new message is added at the end (not when loading older messages)
    //     if (data.length > prevDataLength) {
    //         messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    //     }
    //     setPrevDataLength(data.length);
    // }, [data]);

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
    const [selectedMessageId, setSelectedMessageId] = useState(null);
    useEffect(() => {
        autoResize();
    }, [message]);
    const [hoverId, setHoverId] = useState(null)
    const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event, messageId) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);  // sets position
    setSelectedMessageId(messageId);   // sets which message the menu is for
  };

const handleClose = () => {
    setAnchorEl(null);
    setSelectedMessageId(null);
  };

    console.log("anchorEl", anchorEl)

    const [MessageUpadate, setMessaUpdate] = useState(false)
    const [selectMessageData,setSelectMessageData]=useState(null)
    const [updateMessageValue, setUpdateMessageValue] = useState("")

    const onUpdate = async(value) => {
        try {
            const payload={message_id:value.message_id,message:updateMessageValue}
            const response = await axiosWithHeaders.patch(`${apis.UPDATEMESSAGE}`, payload)
            console.log("response",response)
            setMessaUpdate(false)
            socket.emit("UpdateMessage",response?.data?.data)
        } catch (error) {

       }

    }
    const handleUpdate = (value) => {
        setUpdateMessageValue(value?.message)
        setSelectMessageData(value)
        setMessaUpdate(true)
    }
    const handledelete =async (value) => {
        try {

            const payload = { "message_id": value?.message_id }
            console.log("payload",payload)
            const response = await axiosWithHeaders.delete(`${apis.DELETEMESSAGE}` ,{
                data: payload
              })
            console.log("response",response)

            socket.emit("DeleteMessage",response?.data?.data)
        } catch (error) {

        }
    }

    const [messages, setMessages] = useState([]);

    const handleSendAudio = async(audioBlob, audioUrl) => {

      const formData = new FormData();
      formData.append('audio', audioBlob, 'voice-message.webm');
      formData.append('sender_id', decodejwt?.user_id);
      formData.append('sender_email', decodejwt?.email);

        const response = await axiosWithHeaders.post(`${apis?.AUDIOMESSAGE}`, formData);
        console.log("responseresponseresponseresponseresponse",response)

        socket.emit("SendAudioMessage",response?.data?.message)


    };
    const [openImageUpload, setOpenmageUpload] = useState(false);

    const handleUploadImage = async (file) => {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('sender_id',decodejwt?.user_id );
      formData.append('sender_email', decodejwt?.email);

      try {
        const res = await axiosWithHeaders.post(`${apis?.IMAGEMESSAGE}`, formData);
          console.log('Uploaded:', res.data);

          socket.emit("UploadImage",res?.data?.message)
      } catch (err) {
        console.error('Upload error:', err);
      }
    };

const [selectImage,setSelectImage]=useState(null)
    const handlefileupload = async () => {

        setOpenmageUpload(true)


    }


    return (
        <div className='w-full min-h-[100vh] bg-gray-100 bg-[url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")] bg-repeat'>
            <div className='sticky top-0 z-10'>
                <Header/>
            </div>
            <div className='px-4 pt-2 pb-16 max-h-[85vh] overflow-y-auto'  onScroll={handleScroll}
        ref={messagesContainerRef}
        >
            {data && data.map((item,idx) => {
    const isOwnMessage = decodejwt?.user_id === item?.sender_id;
    const isHovered = hoverId === item._id;
    const isSelected = selectedMessageId === item._id;

                return (


                        <div key={item._id} className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} mb-4`}>
                        {item?.audio != null ? <audio key={idx} controls src={item?.audio} className="w-[48vw]" /> :
                            item?.image != null ?
                                <div className='w-[48vw] h-[30vh] '>
                            <img className='w-full h-full object-cover'  key={idx} src={item?.image} alt="uploaded image" />
                            </div>:

            <div className='flex items-center relative'
                onMouseEnter={() => setHoverId(item._id)}
                onMouseLeave={() => setHoverId(null)}
            >
                {isOwnMessage && isHovered && item?.message!=null && !item?.delete_for_everyone &&(
                    <div
                        onClick={(event) => handleClick(event, item._id)}
                        className="absolute cursor-pointer top-0 right-0 z-50"
                    >
                        <RiArrowDownSLine size={23} />
                    </div>
                )}

                <div
                    className={`max-w-[48vw] break-words p-3 rounded-lg shadow relative
                        ${
                        item?.message == null && item?.delete_for_everyone && isOwnMessage
                        ? "bg-green-200 text-gray-800"
                        :item?.message == null && item?.delete_for_everyone && !isOwnMessage
                    ?"bg-gray-300 text white":
                        isOwnMessage
                        ? "bg-green-500 text-white rounded-br-none"
                        : "bg-white text-gray-800 rounded-bl-none"
                    }`}
                >
                    <span>{item?.message==null && item?.delete_for_everyone && isOwnMessage ? "You deleted this message" : item?.message==null && item?.delete_for_everyone && !isOwnMessage ? "This message was deleted" : item?.message}</span>
                </div>

                {isSelected && (
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                        sx={{mt:"20px"}}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                    >
                        <MenuItem    sx={{
                                        '&:hover': {
                                            backgroundColor: '#f87171', // red-400
                                            color: '#fff',
                                        }
                                        }}  onClick={()=>handledelete(item)}>Delete</MenuItem>
                        <MenuItem sx={{
                                '&:hover': {
                                    backgroundColor: '#60a5fa', // blue-400
                                    color: '#fff',
                                }
                                }} onClick={()=>handleUpdate(item)}>Update</MenuItem>

                    </Menu>
                )}
            </div>}
        </div>
    );
            })}


                {/* <div ref={messagesEndRef} /> */}


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
                <VoiceRecorder onSendAudio={handleSendAudio} />
                <label htmlFor="file-upload">
  <div className='w-10 h-10 rounded-full flex justify-center items-center bg-[#FFD9C0] mx-2 cursor-pointer' onClick={handlefileupload}>
    <FiPaperclip size={20} />
  </div>
</label>


                <button
                    className='ml-2 w-10 h-10 rounded-full flex justify-center items-center bg-green-500 text-white hover:bg-green-600'
                    onClick={handleSendMessage}
                >
                    <TbSend2 size={20} />
                </button>
            </div>
            <MessageUpdateModal
                open={MessageUpadate}
                onClose={() => setMessaUpdate(false)}
                onUpdate={onUpdate}
                value={updateMessageValue}
                setValue={setUpdateMessageValue}
                selectMessageData={selectMessageData}

            />
            <UploadModal
                open={openImageUpload}
                onClose={() => setOpenmageUpload(false)}
                onUpload={handleUploadImage} />
        </div>
    )
}

export default Main