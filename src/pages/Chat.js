import React, { useState, useEffect, useRef } from "react";
import { FaPaperPlane, FaUser } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { auth } from "../firebase/Firebase";
import { db } from "../firebase/Firebase";
import { motion } from "framer-motion";
import { FaBookOpen, FaCheck, FaTimes } from "react-icons/fa";
import { MdCheck, MdClose } from "react-icons/md";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import CustomButton from "../components/CustomButton";
import {
  collection,
  onSnapshot,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
} from "firebase/firestore";

const Chat = () => {
  const user = auth.currentUser;
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const location = useLocation();
  const messagesEndRef = useRef(null);
  const nav = useNavigate();

  useEffect(() => {
    setCurrentChat(location.state);
    if (currentChat) {
      const unsubscribe1 = onSnapshot(
        query(
          collection(db, "requests"),
          where("ruid", "==", currentChat.ruid)
        ),
        (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            if (change.type === "removed" && change.doc.data().requestfrom === user.email) {
              nav("/dashboard");
              toast.error("Transaction rejected by the other party!");
              console.log("Removed document: ", change.doc.data());
            }
          });
        }
      );
      const unsubscribe = onSnapshot(
        query(
          collection(db, "messages"),
          where("sender", "in", [
            currentChat.requestfrom,
            currentChat.requestto,
          ]),
          where("receiver", "in", [
            currentChat.requestfrom,
            currentChat.requestto,
          ]),
          where("chatid", "==", currentChat.ruid),
          orderBy("timestamp")
        ),
        (snapshot) => {
          const messageList = [];
          snapshot.forEach((doc) => {
            messageList.push(doc.data());
          });
          setMessages(messageList);
        },
        (error) => {
          console.error("Error fetching messages:", error);
        }
      );

      return () => {unsubscribe();
      unsubscribe1();
      }
    }
  }, [location.state, currentChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async () => {
    setNewMessage("");
    try {
      await addDoc(collection(db, "messages"), {
        sender: user.email,
        receiver: currentChat.requestto,
        content: newMessage,
        timestamp: new Date(),
        chatid: currentChat.ruid,
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && newMessage.trim() !== "") {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleSendButtonClick = () => {
    if (newMessage.trim() !== "") {
      sendMessage();
    }
  };

  const handleMarkBorrowed = async (flag) => {
    try {
      const r = query(
        collection(db, "requests"),
        where("ruid", "==", currentChat.ruid)
      );
      const querySnapshot2 = await getDocs(r);
      if (!querySnapshot2.empty) {
        const doc = querySnapshot2.docs[0].ref; 
        if (flag) {
          await updateDoc(doc, { borrowed: true });
          toast.success("Transaction marked as borrowed!");
        } else {
          await deleteDoc(doc);
          toast.success("Transaction rejected!");
          nav("/dashboard");
        }
      }
    } catch (error) {
      console.error("Error marking as borrowed:", error);
    }
  };
  
  if (currentChat === null) return null;
  return (
    <>
      <div className="flex flex-col h-screen">
        <motion.div
          className="flex-none bg-gray-200 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex  flex-col lg:justify-between sm:flex-row items-center">
            <div className="flex items-center">
              <FaBookOpen className="mt-2 mr-2" size={20} />
              <h1 className="text-lg mt-1 font-semibold">
                {currentChat.booktitile}
              </h1>
            </div>

            <motion.div
              className="flex justify-end sm:justify-start items-center mt-4 sm:mt-0 space-x-2 sm:space-x-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {currentChat.requestto===user.email && (
                <>
              {currentChat.borrowed ? (
                <>
                  <CustomButton
                    color="blue"
                    icon={<FaCheck />}
                    text="Complete Transaction"
                  />
                  <CustomButton color="red" icon={<FaTimes />} text="Stop" />
                </>
              ) : (
                <>
                  <CustomButton
                    color="green"
                    icon={<FaCheck />}
                    text="Mark as borrowed"
                    onClick={() => handleMarkBorrowed(true)}
                  />
                  <CustomButton
                    color="red"
                    icon={<FaTimes />}
                    text="Reject"
                    onClick={() => handleMarkBorrowed(false)}
                  />
                </>
              )}
              </>
            )}
            </motion.div>
          </div>
        </motion.div>
        <div className="flex-auto overflow-y-auto p-4">
          {messages.map((message, index) => (
            <motion.div
              key={index}
              className={`flex mb-2 ${
                message.sender === user.email ? "justify-end" : "justify-start"
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div
                className={`flex-1 rounded-lg p-2 max-w-sm whitespace-normal break-words overflow-hidden ${
                  message.sender === user.email
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                <p className="mb-1">{message.content}</p>
                <p className="text-xs text-right">
                  {message.timestamp.toDate().toLocaleString()}
                </p>
              </div>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <motion.div
          className="flex-none bg-gray-200 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 mr-2 px-4 py-3 rounded-full border border-gray-300 focus:outline-none transition-colors duration-300 ease-in-out hover:border-blue-500 hover:bg-gray-100"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <motion.button
              className={`flex-none bg-blue-500 text-white rounded-full p-3 ${
                newMessage === "" ? "opacity-50 cursor-not-allowed" : ""
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSendButtonClick}
            >
              <FaPaperPlane className="w-6 h-6" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Chat;
