import React, { useState } from 'react';
import { db } from "../Firebase/Firebase";
import { collection,addDoc } from "firebase/firestore";

const SignUpForm = () => {
  const [userInfo, setUserInfo] = useState({
    name: '',
    semester: '',
    department: '',
    batch: '',
    college: '',
    contact: ''
  });

  console.log(userInfo);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

   const handleSignUp = async () => {
    console.log("enetrerd the functtion")
    try {
      const userRef = await addDoc(collection(db, 'users'), userInfo);
    console.log('User signed up successfully! User ID:', userRef.id);

      setUserInfo({
        name: '',
        semester: '',
        department: '',
        batch: '',
        college: '',
        contact: ''
      });
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };

  return (
    <div className="relative flex justify-center items-center h-screen bg-gray-100">
  {/* Background image */}
  <img src="images/brownbooks.jpg" alt="Background" className="absolute inset-0 w-full h-full object-cover" />
  {/* Signup box */}
  <div className="absolute bg-offwhite p-7 rounded-md shadow-md" style={{ zIndex: 1 }}>
    <h2 className="text-2xl font-semibold mb-4">Welcome to BOOKWEB!</h2>
    <div className="mb-4">
      <input
        type="text"
        placeholder="Name"
        name="name"
        value={userInfo.name}
        onChange={handleInputChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
      />
    </div>
    <div className="mb-4">
      <input
        type="text"
        placeholder="Semester"
        name="semester"
        value={userInfo.semester}
        onChange={handleInputChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
      />
    </div>
    <div className="mb-4">
      <input
        type="text"
        placeholder="Department"
        name="department"
        value={userInfo.department}
        onChange={handleInputChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
      />
    </div>
    <div className="mb-4">
      <input
        type="text"
        placeholder="Batch"
        name="batch"
        value={userInfo.batch}
        onChange={handleInputChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
      />
    </div>
    <div className="mb-4">
      <input
        type="text"
        placeholder="College"
        name="college"
        value={userInfo.college}
        onChange={handleInputChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
      />
    </div>
    <div className="mb-4">
      <input
        type="text"
        placeholder="Contact"
        name="contact"
        value={userInfo.contact}
        onChange={handleInputChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
      />
    </div>
    <button onClick={()=>handleSignUp} className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-500">Sign Up</button>
     </div>
    </div>
  );
};

export default SignUpForm;
