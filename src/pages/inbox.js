import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  onSnapshot,
  query,
  deleteDoc,
  doc,
  orderBy,
  getDocs,
  where,
} from "firebase/firestore";
import { getApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Alert } from "@material-tailwind/react";
import { motion, AnimatePresence } from 'framer-motion';
import CustomButton from "../components/CustomButton"
import moment from "moment/moment";
import { FaTimes, FaTrash } from "react-icons/fa";


const firestore = getFirestore(getApp());

const Inbox = () => {
  const [notifications, setNotifications] = useState([]);
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    const auth = getAuth(getApp());
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!userEmail) return; 
  
    const q = query(
      collection(firestore, "notifications"),
      orderBy("timestamp", "desc")
    );
  
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newNotifications = [];
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const notification = change.doc.data();
          const from = notification.notiffromname;
          const book = notification.title;
          const to = notification.notifto;
  
          if (to === userEmail) {
            let message = "";
            switch (notification.messagetype) {
              case "Book Request":
                message = `Book request from ${from} for book ${book}`;
                break;
              case "Book Request Accepted":
                message = `Book request for book ${book} has been accepted, you can now chat with the owner`;
                break;
              case "Book Request Declined":
                message = `Book request for book ${book} has been declined.`;
                break;
              case "Comment to Post":
                message = ` ${from} has commented on your post ${book}`;
                break;
              case "Review added":
                message = ` ${from} has reviewed your book ${book}`;
                break;
              case "Mark as borrowed":
                message = `The owner has marked ${book} as borrowed to you.`;
                break;
              case "Transaction Complete":
                message = `The owner has marked ${book} as returned from you.`;
                break;
              default:
                break;
            }
  
            if (message) {
              const timestampInMilliseconds = notification.timestamp.seconds * 1000;
              const formattedTime = moment(timestampInMilliseconds).fromNow();
              newNotifications.push({
                id: change.doc.id,
                message,
                time: formattedTime
              });
            }
          }
        }
      });
  
      setNotifications((prevNotifications) => [
        ...newNotifications,
        ...prevNotifications
       
      ]);
    });
  
    return () => unsubscribe();
  }, [userEmail]);
  

  console.log(notifications);

  const handleDelete = async (id) => {
    try {
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notification) => notification.id !== id)
      );
      await deleteDoc(doc(firestore, "notifications", id));
     
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const handleDeleteAllNotifications = async () => {
    try {
      const querySnapshot = await getDocs(
        query(
          collection(firestore, "notifications"),
          where("notifto", "==", userEmail)
        )
      );

  
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });

      setNotifications([]);
    } catch (error) {
      console.error("Error deleting all notifications:", error);
    }
  };
  if(notifications.length > 0){
return (
  <div className="flex w-full flex-col gap-4 px-6 py-4  rounded-lg ">
    <div className="flex justify-end mt-4">
        <CustomButton
          icon={<FaTrash />}
          className="mr-2"
          text="Clear Inbox"
          color="blue"
          onClick={handleDeleteAllNotifications}
        />
      </div>
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: -20 }}
            whileHover={{ scale: 1.01 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <Alert variant="outlined" className="relative bg-gray-200 shadow-sm rounded-lg p-4">
              <FaTimes
              size={20}
                onClick={() => handleDelete(notification.id)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"

              />
            
              <div className="flex flex-col">
                <span>{notification.message}</span>
                <span className="text-xs text-blue-700 font-medium mt-2">{notification.time}</span>
              </div>
            </Alert>
          </motion.div>
        ))}
      </AnimatePresence>
      
    </div>
  );
}
else
{
  return (
   <div className="text-4xl opacity-30 flex justify-center items-center h-screen ">
    No new notifications
   </div>
  );
}
};

export default Inbox;
