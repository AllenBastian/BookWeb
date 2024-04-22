import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../Firebase/Firebase';

export const getUserByEmail = async (email) => {
    try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('email', '==', email));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            return querySnapshot.docs[0].data();
        } else {
            
            return null;
        }
    } catch (error) {
        console.error('Error fetching user by email:', error);
        
        return null;
    }
};

