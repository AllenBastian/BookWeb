import { db } from "../firebase/Firebase";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
export const Deleter = async (dbname, attributeName, id) => {
  try {
    const collectionRef = collection(db, dbname);
    const q = query(collectionRef, where(attributeName, "==", id));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
      console.log(`Document with ID ${doc.id} successfully deleted`);
    });

    console.log("All documents deleted successfully");
  } catch (error) {
    console.error("Error deleting documents:", error);
  }
};

export const MultiDeleter = async (
  dbname,
  attributeName1,
  attributeName2,
  id1,
  id2,
) => {
  try {
    const collectionRef = collection(db, dbname);
    const q = query(
      collectionRef,
      where(attributeName1, "==", id1),
      where(attributeName2, "!=", id2),
    );

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
      console.log(`Document with ID ${doc.id} successfully deleted`);
    });

    console.log("All documents deleted successfully");
  } catch (error) {
    console.error("Error deleting documents:", error);
  }
};
