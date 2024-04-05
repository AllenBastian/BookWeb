import React, { useState, useEffect } from "react";
import { db } from "../firebase/Firebase";
import { doc, updateDoc,getDoc } from "firebase/firestore";
import { collection, getDocs, query, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const UserProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({});
  const [editing, setEditing] = useState(false);
  const auth = getAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser;

        if (currentUser) {
          const userCollectionRef = collection(db, 'users');
          const q = query(userCollectionRef, where('email', '==', currentUser.email));
          const querySnapshot = await getDocs(q);
          console.log(querySnapshot)

          if (!querySnapshot.empty) {
            const userDataFromSignup = querySnapshot.docs[0].data();
            setUserData(userDataFromSignup);
            setFormData(userDataFromSignup);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [auth]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditClick = () => {
    setEditing(true);
  };

  const handleSaveClick = async () => {
    setEditing(false);
    try {
      console.log("Save button clicked"); 
  

      const updatedUserData = {
        ...userData, 
        name: formData.name,
        semester: formData.semester,
        department: formData.department,
        batch: formData.batch,
        college: formData.college,
        contact: formData.contact
      };
  

      const currentUser = auth.currentUser;
      if (currentUser) {
        const userCollectionRef = collection(db, 'users');
        const q = query(userCollectionRef, where('email', '==', currentUser.email));
        const querySnapshot = await getDocs(q);
  
        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const userRef = doc(db, 'users', userDoc.id);
          await updateDoc(userRef, updatedUserData);
  
          console.log("Updated user data in Firestore:", updatedUserData);
  
          setUserData(updatedUserData);
         
        } else {
          console.error('User document not found');
        }
      } else {
        console.error('Current user not found');
      }
  
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };
  
  
  

  const closeModal = () => {
    setEditing(false);
  };

  return (
    <div className="container mx-auto mt-8 flex">
      <div className="w-1/2 mr-4">
        <h1 className="text-3xl font-bold mb-4">User Profile</h1>
        {userData && (
          <div className="bg-white shadow-md rounded-lg p-4 mb-4">
            <h2 className="text-xl font-semibold">{userData.name}</h2>
            <p className="text-gray-500">Email: {userData.email}</p>
            <p className="text-gray-500">Semester: {userData.semester}</p>
            <p className="text-gray-500">Department: {userData.department}</p>
            <p className="text-gray-500">Batch: {userData.batch}</p>
            <p className="text-gray-500">College: {userData.college}</p>
            <p className="text-gray-500">Contact: {userData.contact}</p>
            <button onClick={handleEditClick} className="bg-blue-500 text-white py-2 px-4 rounded">Edit</button>
          </div>
        )}
      </div>
      <div className="w-1/2 ml-4">
        <h1 className="text-3xl font-bold mb-4">History</h1>
        {/* Place your history content here */}
      </div>
      {editing && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white p-8 rounded-lg max-w-lg w-full">
            <h2 className="text-2xl font-semibold mb-4">Edit Profile</h2>
            <form>
              <input type="text" name="name" value={formData.name || ''} onChange={handleInputChange} className="mb-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" />
              <input type="text" name="semester" value={formData.semester || ''} onChange={handleInputChange} className="mb-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" />
              <input type="text" name="department" value={formData.department || ''} onChange={handleInputChange} className="mb-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" />
              <input type="text" name="batch" value={formData.batch || ''} onChange={handleInputChange} className="mb-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" />
              <input type="text" name="college" value={formData.college || ''} onChange={handleInputChange} className="mb-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" />
              <input type="text" name="contact" value={formData.contact || ''} onChange={handleInputChange} className="mb-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" />
              <button type="button" onClick={()=>handleSaveClick()} className="bg-blue-500 text-white py-2 px-4 rounded">Save</button>
              <button type="button" onClick={()=>closeModal()} className="bg-red-500 text-white py-2 px-4 rounded ml-2">Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfilePage;