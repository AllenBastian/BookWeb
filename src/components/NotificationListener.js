import React, { useEffect, useState,useContext } from 'react';
import { db, auth } from '../firebase/Firebase'; 
import { collection, query, where, onSnapshot, addDoc, doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Timestamp } from 'firebase/firestore';
import { NotificationCountContext } from '../context/Context';
import { v4 as uuidv4 } from 'uuid';
import { toast } from "sonner";
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
                            booktitle: bookname,
                            notiffrom: reqfr,
                            isRead : false,
                        });
                        console.log('Notification added with ID: ', docRef.id);
                        toast.info("Book Requested");
                    } catch (error) {
                        console.error('Error adding notification: ', error);
                    }
                  }
                  if (change.type === 'modified' && change.doc.data().requestfrom === user.email && change.doc.data().accepted === true) {
                                 
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
                                          booktitle: bookname,
                                          notiffrom: requestTo,
                                          isRead : false,
                                      });
                                      console.log('Notification added with ID: ', docRef.id);
                                      toast.info("Book Accepted");
                                  } catch (error) {
                                      console.error('Error adding notification: ', error);
                                  }
                              }
                  else if (change.type === 'modified' && change.doc.data().requestfrom === user.email && change.doc.data().rejected === true) {
                    console.log("Entered reject mode")
                    console.log("Change:",change.doc.data())
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
                                        booktitle: bookname,
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
        

        return () => {
            requestUnsubscribe();
            
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
