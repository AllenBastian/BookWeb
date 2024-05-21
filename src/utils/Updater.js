import { doc, where, query, collection, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../firebase/Firebase";

export const Updater = async (dbname, attribute, val, upattribute, uval) => {
  try {
    const userCollectionRef = query(collection(db, dbname), where(attribute, '==', val));
    const userCollection = await getDocs(userCollectionRef);
    
    if (!userCollection.empty) {
      console.log("Matching documents found:");
      console.log(userCollection.docs);

      const updatePromises = userCollection.docs.map(document => 
        updateDoc(document.ref, { [upattribute]: uval }).then(() => {
          console.log(`Document with ID ${document.id} updated.`);
        })
      );

      await Promise.all(updatePromises);
    } else {
      console.log("No matching documents found.");
    }
  } catch (error) {
    console.error("Error updating documents: ", error);
  }
};
