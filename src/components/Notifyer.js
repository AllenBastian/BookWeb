import { toast } from "sonner";
import { db } from "../firebase/Firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  Timestamp,
  onSnapshot,
} from "firebase/firestore";
import { useEffect, useState ,useContext} from "react";
import { auth } from "../firebase/Firebase";
import { serverTimestamp } from "firebase/firestore";
import { NotificationCountContext } from "../context/Context";

const Notifyer = () => {
  const [email, setEmail] = useState(null);
  const { notificationCount, setNotificationCount } = useContext(NotificationCountContext);


 

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setEmail(user.email);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
  if(email === null) return;
    
    const q = query(collection(db,"comments"), where("timestamp", ">=", Timestamp.fromMillis(Date.now())));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        querySnapshot.docChanges().forEach((change) => {
            console.log(change.doc.data());
            console.log(change.type);
            console.log(change.doc.data().postowner);
            console.log(email);
          if (
            change.type === "added" &&
            change.doc.data().postowner === email
          ) {
            toast.success("You have a new comment on your post");
            setNotificationCount((prev) => prev + 1);
          }
        });
      });
    return () => {
      unsubscribe();
    };
  }, [email]);


};

export default Notifyer;
