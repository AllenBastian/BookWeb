import React, { useState, useEffect,useRef} from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import { auth } from "../firebase/Firebase";
import { db } from '../firebase/Firebase';
import { collection, onSnapshot, addDoc, query, where, orderBy } from 'firebase/firestore';

const Chat = () => {
    const user = auth.currentUser;
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const location = useLocation();
    const messagesEndRef = useRef(null);
    useEffect(() => {
        setCurrentChat(location.state);
        if (currentChat) {
            const unsubscribe = onSnapshot(
                query(
                    collection(db, 'messages'),
                    where('sender', 'in', [currentChat.requestfrom, currentChat.requestto]),
                    where('receiver', 'in', [currentChat.requestfrom, currentChat.requestto]),
                    where('chatid', '==', currentChat.ruid),
                    orderBy('timestamp')
                ),
                (snapshot) => {
                    const messageList = [];
                    snapshot.forEach((doc) => {
                        messageList.push(doc.data());
                    });
                    setMessages(messageList);
                },
                (error) => {
                    console.error('Error fetching messages:', error);
                }
            );

            return () => unsubscribe();
        }
    }, [location.state,currentChat]);

    console.log(currentChat)
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    const sendMessage = async () => {
        setNewMessage('');
        try {
            await addDoc(collection(db, 'messages'), {
                sender: user.email,
                receiver: currentChat.requestto,
                content: newMessage,
                timestamp: new Date(),
                chatid: currentChat.ruid,
            });
           
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && newMessage.trim() !== "") {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <>
            <div className="flex flex-col h-screen">
                <div className="flex-none bg-gray-200 p-4">
                    <h1 className="text-lg font-semibold">Chat</h1>
                </div>
                <div className="flex-auto overflow-y-auto p-4">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`flex mb-2 ${message.sender === user.email ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`flex-1 rounded-lg p-2 max-w-xs ${message.sender === user.email ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
                            >
                                <p className="mb-1">{message.content}</p>
                                <p className="text-xs text-right">
                                    {message.timestamp.toDate().toLocaleString()}
                                </p>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                <div className="flex-none bg-gray-200 p-4">
                    <div className="flex items-center">
                        <input
                            type="text"
                            placeholder="Type a message..."
                            className="flex-1 mr-2 px-3 py-2 rounded-full border border-gray-300 focus:outline-none"
                            value={newMessage}
                            onChange={e => setNewMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
<button className={`flex-none bg-blue-500 text-white rounded-full p-2 ${newMessage === "" ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={()=>sendMessage} disabled={newMessage === ""}>
    <FaPaperPlane className="w-4 h-4" />
</button>
                    </div>
                </div>
            </div>
        </>
    );
}
export default Chat;
