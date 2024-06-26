import React, { useEffect, useState, useContext } from "react";
import { db, auth } from "../firebase/Firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Timestamp } from "firebase/firestore";
import { NotificationCountContext } from "../context/Context";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { duration } from "@mui/material";

const NotificationListener = () => {
  const [user, setUser] = useState(null);
  const { notificationCount, setNotificationCount } = useContext(
    NotificationCountContext
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return; 

    const requestQ = query(
      collection(db, "requests"),
      where("timestamp", ">=", Timestamp.fromMillis(Date.now()))
    );
    const requestUnsubscribe = onSnapshot(requestQ, async (snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        console.log("changeherehejejjh:", change.doc.data());
        if (
          change.type === "added" &&
          change.doc.data().requestto === user.email
        ) {
          const request = change.doc.data();
          const notificationId = uuidv4();
          const requestTo = request.requestto;
          const message = "Book Request";
          const bookname = request.booktitile;
          const reqfr = request.requestfrom;
          const reqfrname = request.reqfromusername;

          try {
            // Add new notification to the "notifications" collection
            const docRef = await addDoc(collection(db, "notifications"), {
              notifid: notificationId,
              notifto: requestTo,
              messagetype: message,
              timestamp: new Date(),
              title: bookname,
              notiffrom: reqfr,
              notiffromname: reqfrname,
              isRead: false,
            });
            console.log("Notification added with ID: ", docRef.id);
            toast.info(`you have a new request for the book ${bookname}`, {
              duration: 4000,
            });
          } catch (error) {
            console.error("Error adding notification: ", error);
          }
        }
        //if the owner accepts the requests-correct verified for initial reject and transaction reject
        else if (
          change.type === "modified" &&
          change.doc.data().requestfrom === user.email &&
          change.doc.data().accepted === true &&
          change.doc.data().rejected === false
          && change.doc.data().borrowed === false
        ) {
          const request = change.doc.data();
          const notificationId = uuidv4();
          const requestTo = request.requestto;
          const message = "Book Request Accepted";
          const bookname = request.booktitile;
          const reqfr = request.requestfrom;
          const reqfrname = request.reqfromusername;

          try {
            const docRef = await addDoc(collection(db, "notifications"), {
              notifid: notificationId,
              notifto: reqfr,
              messagetype: message,
              timestamp: new Date(),
              title: bookname,
              notiffrom: requestTo,
                notiffromname: reqfrname,
              isRead: false,
            });
            console.log("Notification added with ID: ", docRef.id);
            toast.info(
              `Your request for book  ${bookname} has been accepted. you can now chat with the owner`
            );
          } catch (error) {
            console.error("Error adding notification: ", error);
          }
        }
        //if the owner rejects the requests-correct verified
        else if (
          change.type === "modified" &&
          change.doc.data().requestfrom === user.email &&
          change.doc.data().rejected === true
        ) {
          console.log("Entered reject mode");
          console.log("Change:", change.doc.data());
          const request = change.doc.data();
          const notificationId = uuidv4();
          const requestTo = request.requestto;
          const message = "Book Request Declined";
          const bookname = request.booktitile;
          const reqfr = request.requestfrom;
          const reqfrname = request.reqfromusername;

          try {
            // Add new notification to the "notifications" collection
            const docRef = await addDoc(collection(db, "notifications"), {
              notifid: notificationId,
              notifto: reqfr,
              messagetype: message,
              timestamp: new Date(),
              title: bookname,
              notiffrom: requestTo,
                notiffromname: reqfrname,
              isRead: false,
            });
            console.log("Notification added with ID: ", docRef.id);
            toast.warning(
              `your request for book ${bookname} has been declined`,
              { duration: 4000 }
            );
          } catch (error) {
            console.error("Error adding notification: ", error);
          }
          //maark as borrowed - correct verified
        } else if (
          change.type === "modified" &&
          change.doc.data().requestfrom === user.email &&
          change.doc.data().borrowed === true
        ) {
          const request = change.doc.data();
          const notificationId = uuidv4();
          const requestTo = request.requestto;
          const message = "Mark as borrowed";
          const bookname = request.booktitile;
          const reqfr = request.requestfrom;
          const reqfrname = request.reqfromusername;

          try {
            const docRef = await addDoc(collection(db, "notifications"), {
              notifid: notificationId,
              notifto: reqfr,
              messagetype: message,
              timestamp: new Date(),
              title: bookname,
              notiffrom: requestTo,
                notiffromname: reqfrname,
              isRead: false,
            });
            console.log("Notification added with ID: ", docRef.id);
            toast.info(`The owner has marked ${bookname} borrowed to you`, {
              duration: 4000,
            });
          } catch (error) {
            console.error("Error adding notification: ", error);
          }
        }
        else if (change.type = "removed" && change.doc.data().requestfrom === user.email && change.doc.data().borrowed === true) {
            const request = change.doc.data();
            const notificationId = uuidv4();
            const requestTo = request.requestto;
            const message = "Transaction Complete";
            const bookname = request.booktitile;
            const reqfr = request.requestfrom;
            const reqfrname = request.reqfromusername;
    
            try {
                const docRef = await addDoc(collection(db, "notifications"), {
                notifid: notificationId,
                notifto: reqfr,
                messagetype: message,
                timestamp: new Date(),
                title: bookname,
                notiffrom: requestTo,
                notiffromname: reqfrname,
                isRead: false,
                });
                console.log("Notification added with ID: ", docRef.id);
                toast.info(`The owner has marked ${bookname} returned from you`, {
                duration: 4000,
                });
            } catch (error) {
                console.error("Error adding notification: ", error);
            }
        }
      });
    });

    const commentQ = query(
      collection(db, "comments"),
      where("timestamp", ">=", Timestamp.fromMillis(Date.now()))
    );
    const commentUnsubscribe = onSnapshot(commentQ, async (snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        console.log("change:", change.doc.data());
        console.log("working isnide snaphsot comment");
        if (
          change.type === "added" &&
          change.doc.data().postowner === user.email &&
          change.doc.data().email !== change.doc.data().postowner
        ) {
          console.log("change:", change.doc.data());
          const comment = change.doc.data();
          const notificationId = uuidv4();
          const owner = comment.postowner;
          const message = "Comment to Post";
          const commenter = comment.email;
          const post = comment.postname;
          const commenterName = comment.commenter;

          try {
            // Add new notification to the "notifications" collection
            const docRef = await addDoc(collection(db, "notifications"), {
              notifid: notificationId,
              notifto: owner,
              messagetype: message,
              timestamp: new Date(),
              title: post,
              notiffrom: commenter,
                notiffromname: commenterName,
            });
            console.log("Notification added with ID: ", docRef.id);
          } catch (error) {
            console.error("Error adding notification: ", error);
          }

          toast.info(`${commenterName} has commented on your post ${post}`);
        }
        
      });
    });
    const reviewQ = query(
      collection(db, "reviews"),
      where("timestamp", ">=", Timestamp.fromMillis(Date.now()))
    );
    const reviewUnsubscribe = onSnapshot(reviewQ, async (snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        console.log("change:", change.doc.data());
        console.log("working isnide snapshot review");
        if (
          change.type === "added" &&
          change.doc.data().bookowner === user.email
        ) {
          console.log("Review change:", change.doc.data());
          const review = change.doc.data();
          const notificationId = uuidv4();
          const owner = review.bookowner;
          const message = "Review added";
          const reviewer = review.remail;
          const reviewerName = review.reviewer;
          const book = review.bookname;

          try {
            
            const docRef = await addDoc(collection(db, "notifications"), {
              notifid: notificationId,
              notifto: owner,
              messagetype: message,
              timestamp: new Date(),
              title: book,
              notiffrom: reviewer,
                notiffromname: reviewerName,
            });
            console.log("Notification added with ID: ", docRef.id);
            toast.info(`${reviewerName} has reviewed your book ${book}`);
          } catch (error) {
            console.error("Error adding notification: ", error);
          }
        }
      
      });
    });

    return () => {
      requestUnsubscribe();
      commentUnsubscribe();
      reviewUnsubscribe();
    };
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "notifications"),
      where("notifto", "==", user.email)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setNotificationCount(snapshot.docs.length);
    });
  }, [user]);

  return null;
};

export default NotificationListener;
