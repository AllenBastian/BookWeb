import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase/Firebase'; // Import the Firebase configuration
import { collection, query, where, onSnapshot, addDoc, doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Timestamp } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { toast } from "sonner";
const NotificationListener = () => {
    const [user, setUser] = useState(null);

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
                                          notifto: requestTo,
                                          messagetype: message,
                                          timestamp: new Date(),
                                          booktitle: bookname,
                                          notiffrom: reqfr,
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
                                        notifto: requestTo,
                                        messagetype: message,
                                        timestamp: new Date(),
                                        booktitle: bookname,
                                        notiffrom: reqfr,
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

    return null; // Since this component doesn't render anything
};

export default NotificationListener;
