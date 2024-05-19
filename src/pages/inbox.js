import React, { useState, useEffect } from 'react';
import { getFirestore, collection, onSnapshot, query, deleteDoc, doc, orderBy} from 'firebase/firestore';
import { getApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Alert } from '@material-tailwind/react';

// Assuming Firebase is already initialized elsewhere in your project
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
    if (!userEmail) return; // Don't proceed if userEmail is not set

    const q = query(collection(firestore, 'notifications'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newNotifications = [];
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const notification = change.doc.data();
          const from = notification.notiffrom;
          const book = notification.title;
          const to = notification.notifto;
          
          // Only add notifications meant for the current user
          if (to === userEmail && change.doc.data().messagetype === "Book Request") {
            newNotifications.push({ id: change.doc.id, message: `Book request from ${from} for book: ${book}` });
            
          }
          else if (notification.messagetype === "Book Request Accepted" && to === userEmail) {
            newNotifications.push({ id: change.doc.id, message: `Book request for book ${book} has been accepted.` });
        }
        else if (notification.messagetype === "Book Request Declined" && to === userEmail) {
          newNotifications.push({ id: change.doc.id, message: `Book request for book ${book} has been declined.` });
      }
        else if (notification.messagetype === "Comment to Post" && to === userEmail ){
          newNotifications.push({id: change.doc.id, message: `User ${from}  has commented on your post ${book}` });
        }
        else if (notification.messagetype === "Review added" && to === userEmail ){
          newNotifications.push({id: change.doc.id, message: `User ${from}  has reviewed your book ${book}` });
        }
        }

      });
      setNotifications((prevNotifications) => [...prevNotifications, ...newNotifications]);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [userEmail]);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(firestore, 'notifications', id));
      setNotifications((prevNotifications) => prevNotifications.filter(notification => notification.id !== id));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  return (
    <div className="flex w-full flex-col gap-2 px-4">
      {notifications.map((notification) => (
        <Alert key={notification.id} variant="outlined" className="relative">
          <button
            onClick={() => handleDelete(notification.id)}
            className="absolute top-0 right-0 m-2 text-gray-500 hover:text-gray-800"
            aria-label="Close"
          >
            &times;
          </button>
          <span>{notification.message}</span>
        </Alert>
      ))}
     
    </div>
  );
};

export default Inbox;
