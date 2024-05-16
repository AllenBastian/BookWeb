import React, { useState, useEffect, useRef } from "react";
import { FaPaperPlane, FaUser } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { auth } from "../firebase/Firebase";
import { db } from "../firebase/Firebase";
import { m, motion } from "framer-motion";
import { FaBookOpen, FaCheck, FaTimes } from "react-icons/fa";
import { MdCheck, MdClose } from "react-icons/md";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import CustomButton from "../components/CustomButton";
import Loader from "../components/Loader";
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
import { set } from "firebase/database";
import CustomPopup from "../components/CustomPopup";
import { getUserName } from "../utils/Search";
import { Deleter } from "../utils/Deleter";

const Chat = () => {
  const user = auth.currentUser;
  const [currentChat, setCurrentChat] = useState(null);
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toUsername, setToUsername] = useState(null);
  const [fromUsername, setFromUsername] = useState(null);
  const [messages, setMessages] = useState([]);
  const [transactionRejected, setTransactionRejected] = useState(false);
  const [transactionComplete, setTransactionComplete] = useState(false);
  const [popUp, setPopup] = useState(false);
  const flag = useRef(false);
  const [newMessage, setNewMessage] = useState("");
  const location = useLocation();
  const messagesEndRef = useRef(null);
  const nav = useNavigate();

  useEffect(() => {
    setCurrentChat(location.state);
    if (currentChat) {
      getUserName(currentChat.requestto).then((name) => {
        setToUsername(name);
      });
      getUserName(currentChat.requestfrom).then((name) => {
        setFromUsername(name);
      });
      const unsubscribe1 = onSnapshot(
        query(
          collection(db, "requests"),
          where("ruid", "==", currentChat.ruid)
        ),
        (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            if (
              change.doc.data().requestto === user.email ||
              change.doc.data().requestfrom === user.email
            ) {
              console.log("Current document: ", change.doc.data());
              setInfo(change.doc.data());
            }
            if (
              change.type === "removed" &&
              change.doc.data().requestfrom === user.email
            ) {
              if (change.doc.data().borrowed === false) {
                setTransactionRejected(true);
                flag.current = false;
                console.log("Removed document: ", change.doc.data());
              } else {
                setTransactionRejected(true);
                flag.current = true;
                console.log("Removed document: ", change.doc.data());
              }
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
          console.log("Current messages: ", messageList);
        },
        (error) => {
          console.error("Error fetching messages:", error);
        }
      );
      setLoading(false);
      return () => {
        unsubscribe();
        unsubscribe1();
      };
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

  console.log("Current chat: ", currentChat);

  const handleMarkBorrowed = async (flag) => {
    setPopup(false);
    setLoading(true);
    try {
      const q = query(
        collection(db, "books"),
        where("title", "==", info.booktitile)
      );
      const querySnapshot = await getDocs(q);

      const mydoc = querySnapshot.docs[0].ref;

      const r = query(
        collection(db, "requests"),
        where("ruid", "==", currentChat.ruid)
      );
      const querySnapshot2 = await getDocs(r);
      if (!querySnapshot2.empty) {
        const doc = querySnapshot2.docs[0].ref;
        if (flag) {
          await updateDoc(doc, { borrowed: true });
          await updateDoc(mydoc, { isBorrowed: true });
          toast.success("Transaction marked as borrowed!");
        } else {
          await deleteDoc(doc);
          await updateDoc(mydoc, { isBorrowed: false });
          toast.success("Transaction rejected!");
          nav("/dashboard");
        }
      }
    } catch (error) {
      console.error("Error marking as borrowed:", error);
    }
    setLoading(false);
  };

  const handleTransactionComplete = async () => {
    setLoading(true);
    setTransactionComplete(false);
    try {

      
      const q = query(
        collection(db, "books"),
        where("title", "==", info.booktitile)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        console.log("Document data:", querySnapshot.docs[0].data());
        const doc = querySnapshot.docs[0].ref;
        await updateDoc(doc, { isBorrowed: false });
      }

      const borrowerName = await getUserName(currentChat.requestfrom);
      const lenderName = await getUserName(currentChat.requestto);
      console.log("Borrower name: ", borrowerName);
      console.log("Lender name: ", lenderName);
    
      const ids = doc(collection(db, "transactions")).id;
      const t = await addDoc(collection(db, "transactions"), {
        booktitle: currentChat.booktitile,
        bookid: currentChat.bookuid,
        borrower: currentChat.requestfrom,
        lender: currentChat.requestto,
        borrowerName: borrowerName,
        lenderName: lenderName,
        timestamp: new Date(),
        reviewed: false,
        uid: ids
      });

      await Deleter("messages", "chatid", currentChat.ruid);
      await Deleter("requests", "ruid", currentChat.ruid);

      nav("/dashboard");
      toast.success("Transaction completed!");
    } catch (error) {
      console.error("Error completing transaction:", error);
    }
    setLoading(false);
  };

  console.log("hereeesknksjln");
  console.log(currentChat);

  if (loading) {
    return <Loader loading={loading} />;
  }
  if (info === null) return null;
  return (
    <>
      <div className="flex flex-col h-screen">
        <motion.div
          className="flex-none bg-gray-200 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col bg-white rounded-lg shadow-md p-4 space-y-4">
            <div className="flex items-center border-b pb-2">
              <FaBookOpen className="mt-1 mr-2" size={20} />
              <h1 className="text-lg font-semibold">
                {currentChat.booktitile}
              </h1>
            </div>
            <div className="flex items-center">
              <FaUser className="mt-1 mr-2" size={20} />
              {user.email===info.requestfrom ? (
                 <h1 className="text-lg font-semibold">{toUsername}</h1>
              ):(
                <h1 className="text-lg font-semibold">{fromUsername}</h1>
              )}
          
            </div>

            <motion.div
              className="flex justify-start sm:justify-start items-center mt-4 sm:mt-0 space-x-2 sm:space-x-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {info.requestto === user.email && (
                <>
                  {info.borrowed === true ? (
                    <>
                      <CustomButton
                        color="blue"
                        icon={<FaCheck />}
                        text="Complete Transaction"
                        onClick={() => setTransactionComplete(true)}
                      />
                    </>
                  ) : (
                    <>
                      <CustomButton
                        color="green"
                        icon={<FaCheck />}
                        text="Mark as borrowed"
                        onClick={() => {
                          setPopup(true);
                          flag.current = true;
                        }}
                      />
                      <CustomButton
                        color="red"
                        icon={<FaTimes />}
                        text="Reject"
                        onClick={() => {
                          setPopup(true);
                          flag.current = false;
                        }}
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
      {popUp && (
        <CustomPopup
          message={
            flag.current
              ? "Are you sure you want to mark this transaction as borrowed?"
              : "Are you sure you want to reject this transaction?"
          }
          button1={
            <CustomButton
              color={flag.current ? "green" : "red"}
              text={"yes"}
              icon={<FaTimes />}
              onClick={() => handleMarkBorrowed(flag.current)}
            />
          }
          button2={
            <CustomButton
              color={flag.current ? "red" : "green"}
              text={"no"}
              icon={<FaCheck />}
              onClick={() => setPopup(false)}
            />
          }
        />
      )}
      {transactionRejected && (
        <CustomPopup
          message={
            flag.current ? "Transaction Completed!" : "Transaction rejected!"
          }
          button1={
            <CustomButton
              color={flag.current ? "green" : "red"}
              text={"ok"}
              icon={<FaTimes />}
              onClick={() => nav("/dashboard")}
            />
          }
        />
      )}
      {transactionComplete && (
        <CustomPopup
          message="Complete Transaction?"
          subtext={"confirm that you have received the book "}
          button1={
            <CustomButton
              color="green"
              text={"confirm"}
              icon={<FaCheck />}
              onClick={() => handleTransactionComplete()}
            />
          }
          button2={
            <CustomButton
              color="red"
              text={"cancel"}
              icon={<FaTimes />}
              onClick={() => setTransactionComplete(false)}
            />
          }
        />
      )}
    </>
  );
};

export default Chat;
