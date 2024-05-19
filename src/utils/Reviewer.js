import { get } from "firebase/database";
import { db } from "../firebase/Firebase"
import { collection,getDocs, query,where,updateDoc} from "firebase/firestore"

export const reviewer = async(bookid)=>{

    try{

    console.log(bookid);
    const querySnapshot = await getDocs(query(collection(db,"reviews"),where("bookid","==",bookid)));
    const data = querySnapshot.docs.map(doc => doc.data());
    const rating = data.reduce((acc,curr)=>acc+curr.rating,0)/data.length;

    console.log(data);
    console.log(rating);
    const bookRef =  query(collection(db,"books"),where("uid","==",bookid));
    const querySnapshot1 = await getDocs(bookRef);
      const mydoc = querySnapshot1.docs[0].ref;
      console.log(mydoc);
      await updateDoc(mydoc, { rating: rating});
    }
    catch(error){
        console.error('Error getting documents:', error);
    }

}

