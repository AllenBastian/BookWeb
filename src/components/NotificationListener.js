import React, { useEffect, useState,useContext } from 'react';
import { db, auth } from '../firebase/Firebase'; 
import { collection, query, where, onSnapshot, addDoc, doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Timestamp } from 'firebase/firestore';
import { NotificationCountContext } from '../context/Context';
import { v4 as uuidv4 } from 'uuid';
import { toast } from "sonner";
import { duration } from '@mui/material';

const NotificationListener = () => {
    const [user, setUser] = useState(null);
    const {notificationCount, setNotificationCount} = useContext(NotificationCountContext);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!user) return; // Don't proceed if user is not set

        const requestQ = query(collection(db, "requests"), where("timestamp", ">=", Timestamp.fromMillis(Date.now())));
        const requestUnsubscribe = onSnapshot(requestQ, async (snapshot) => {
            snapshot.docChanges().forEach(async (change) => {
                if (change.type === 'added' && change.doc.data().requestto === user.email) {
                    const request = change.doc.data();
                    const notificationId = uuidv4();
                    const requestTo = request.requestto;
                    const message = 'Book Request';
                    const bookname = request.booktitile;
                    const reqfr = request.requestfrom;

                    try {
                        // Add new notification to the "notifications" collection
                        const docRef = await addDoc(collection(db, 'notifications'), {
                            notifid: notificationId,
                            notifto: requestTo,
                            messagetype: message,
                            timestamp: new Date(),
                            title: bookname,
                            notiffrom: reqfr,
                            isRead : false,
                        });
                        console.log('Notification added with ID: ', docRef.id);
                        toast.info("Book Requested", {duration:1500});
                    } catch (error) {
                        console.error('Error adding notification: ', error);
                    }
                  }
                  if (change.type === 'modified' && change.doc.data().requestfrom === user.email && change.doc.data().borrowed === true) {
                                 
                                  const request = change.doc.data();
                                  const notificationId = uuidv4();
                                  const requestTo = request.requestto;
                                  const message = 'Book Request Accepted';
                                  const bookname = request.booktitile;
                                  const reqfr = request.requestfrom;
                                
              
                                  try {
                                    
                                      // Add new notification to the "notifications" collection
                                      const docRef = await addDoc(collection(db, 'notifications'), {
                                          notifid: notificationId,
                                          notifto: reqfr,
                                          messagetype: message,
                                          timestamp: new Date(),
                                          title: bookname,
                                          notiffrom: requestTo,
                                          isRead : false,
                                      });
                                      console.log('Notification added with ID: ', docRef.id);
                                      toast.info("Book has been borrowed");
                                  } catch (error) {
                                      console.error('Error adding notification: ', error);
                                  }
                              }
                  else if (change.type === 'modified' && change.doc.data().requestfrom === user.email && change.doc.data().rejected === true) {
                    console.log("Entered reject mode")
                    console.log("Change:", change.doc.data())
                                const request = change.doc.data();
                                const notificationId = uuidv4();
                                const requestTo = request.requestto;
                                const message = 'Book Request Declined';
                                const bookname = request.booktitile;
                                const reqfr = request.requestfrom;
            
                                try {
                                    // Add new notification to the "notifications" collection
                                    const docRef = await addDoc(collection(db, 'notifications'), {
                                        notifid: notificationId,
                                        notifto: reqfr,
                                        messagetype: message,
                                        timestamp: new Date(),
                                        title: bookname,
                                        notiffrom: requestTo,
                                        isRead : false,
                                    });
                                    console.log('Notification added with ID: ', docRef.id);
                                    toast.info("Book request rejected");
                                } catch (error) {
                                    console.error('Error adding notification: ', error);
                                }
                            }            
            });
        });
        const commentQ = query(collection(db, "comments"), where("timestamp", ">=", Timestamp.fromMillis(Date.now())));
        const commentUnsubscribe = onSnapshot(commentQ, async (snapshot) => {
            snapshot.docChanges().forEach(async (change) => {
              console.log("working isnide snaphsot comment")
              if(change.type === 'added' && change.doc.data().email === user.email && change.doc.data().postowner !== user.email){
                console.log("change:", change.doc.data())
                const comment = change.doc.data();
                const notificationId = uuidv4();
                const owner = comment.postowner;
                const message = 'Comment to Post';
                const commenter = comment.email;
                const post = comment.postname;

                try {
                    // Add new notification to the "notifications" collection
                    const docRef = await addDoc(collection(db, 'notifications'), {
                        notifid: notificationId,
                        notifto: owner,
                        messagetype: message,
                        timestamp: new Date(),
                        title: post,
                        notiffrom: commenter,
                    });
                    console.log('Notification added with ID: ', docRef.id);
                    
                } catch (error) {
                    console.error('Error adding notification: ', error);
                }
              }
              if (change.doc.data().postowner=== user.email ){
                toast.info("Someone commented on your post");
              }
            });
        });
        const reviewQ = query(collection(db, "reviews"), where("timestamp", ">=", Timestamp.fromMillis(Date.now())));
        const reviewUnsubscribe = onSnapshot(reviewQ, async (snapshot) => {
            snapshot.docChanges().forEach(async (change) => {
              console.log("working isnide snapshot review")
              if(change.type === 'added' && change.doc.data().remail === user.email){
                console.log("Review change:", change.doc.data())
                const review = change.doc.data();
                const notificationId = uuidv4();
                const owner = review.bookowner;
                const message = 'Review added';
                const reviewer = review.remail;
                const book = review.bookname;

                try {
                    // Add new notification to the "notifications" collection
                    const docRef = await addDoc(collection(db, 'notifications'), {
                        notifid: notificationId,
                        notifto: owner,
                        messagetype: message,
                        timestamp: new Date(),
                        title: book,
                        notiffrom: reviewer,
                    });
                    console.log('Notification added with ID: ', docRef.id);
                    
                } catch (error) {
                    console.error('Error adding notification: ', error);
                }
              }
              if (change.doc.data().bookowner=== user.email )
                {
                  toast.info("Review added to your book");
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
        const q = query(collection(db, 'notifications'), where('notifto', '==', user.email));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setNotificationCount(snapshot.docs.length);
        });

    }, [user]);

    return null; 
};

export default NotificationListener;
