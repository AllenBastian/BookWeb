import React, { useState, useEffect } from "react";
import { db } from "../firebase/Firebase";
import {
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

import { getAuth,signOut } from "firebase/auth";
import { motion } from "framer-motion";
import { FaUserCog, FaUser, FaEnvelope, FaPhoneAlt, FaUniversity, FaBuilding, FaCalendar, FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import CustomButton from "../components/CustomButton";
import { isEditable } from "@testing-library/user-event/dist/utils";
import { toast } from "sonner";
import { set } from "firebase/database";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";
import { GiEvilWings } from "react-icons/gi";
import CustomPopup from "../components/CustomPopup";
import { Deleter } from "../utils/Deleter";

const UserProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({});
  const [editing, setEditing] = useState(false);
  const [userPosts, setUserPosts] = useState([]);
  const [deleting,setDeleting] = useState(false);
  const nav = useNavigate();
  const auth = getAuth();

  useEffect(() => {

    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser;

        if (currentUser) {
          const userCollectionRef = collection(db, "users");
          const q = query(
            userCollectionRef,
            where("email", "==", currentUser.email)
          );
          const querySnapshot = await getDocs(q);
          console.log(querySnapshot);

          if (!querySnapshot.empty) {
            const userDataFromSignup = querySnapshot.docs[0].data();
            setUserData(userDataFromSignup);
            setFormData(userDataFromSignup);
          }
    
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
      setLoading(false);
    };

    fetchUserData();
  }, [auth]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

const handleDelete = async () => {
  setLoading(true);
  try {
    const currentUser = auth.currentUser;
    if (currentUser) {
      await Deleter("users", "email", currentUser.email);
      await Deleter("books", "owner", currentUser.email);
      await Deleter("requests", "requestto", currentUser.email);
      await Deleter("messages", "sender", currentUser.email);
      await Deleter("messages", "receiver", currentUser.email);
      // await Deleter("messages", "", currentUser.email);
      // await Deleter("comments", "owner", currentUser.email);
        toast.warning("User deleted successfully");
        signOut(auth).then(() => {
          localStorage.setItem("isSignedUp", JSON.stringify(false));
          nav("/");
        }).catch((error) => {
          console.error("Sign out error:", error);
        })
      
    }
  } catch (error) {
    console.error("Error deleting user:", error);
  }
};

  const handleSaveClick = async () => {
    setEditing(false);
    try {
      const updatedUserData = {
        ...userData,
        name: formData.name,
        semester: formData.semester,
        department: formData.department,
        batch: formData.batch,
        college: formData.college,
        contact: formData.contact,
      };

      const currentUser = auth.currentUser;
      if (currentUser) {
        const userCollectionRef = collection(db, "users");
        const q = query(
          userCollectionRef,
          where("email", "==", currentUser.email)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const userRef = doc(db, "users", userDoc.id);
          await updateDoc(userRef, updatedUserData);

          console.log("Updated user data in Firestore:", updatedUserData);
          setUserData(updatedUserData);
          toast.success("User data updated successfully");
        } else {
          console.error("User document not found");
        }
      } else {
        console.error("Current user not found");
      }
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  };

  if (loading) {
    return (

     <Loader loading={loading}/>
    );
  }
  return (
    <>
    <div className="grid grid-cols-2 gap-4 md:p-9 p-4 ">
      <motion.div
        className="col-span-2 md:col-span-1 p-4 bg-gray-200 rounded-lg shadow-md"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.95 }}
      >
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FaUserCog className="mr-2 text-black" /> Profile Settings
          </h2>
          <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
            <div className="border-gray-300 border-2 p-2 rounded-sm">
              <p className="text-sm flex font-semibold mb-2 mt-2">
                <FaUser className="mr-2 mt-1 text-black" />
                Name
              </p>
              <p className="text-md ">{formData.name}</p>
            </div>
            <div className="border-gray-300 border-2 p-2 rounded-sm">
              <p className="text-sm flex font-semibold mb-2 mt-2">
                <FaEnvelope className="mr-2 mt-1 text-black" />
                Email
              </p>
              <p className="text-md ">{formData.email}</p>
            </div>
            <div className="border-gray-300 border-2 p-2 rounded-sm">
              <p className="text-sm flex font-semibold mb-2 mt-2">
                <FaPhoneAlt className="mr-2 mt-1 text-black" />
                Contact
              </p>
              <p className="text-md ">{formData.contact}</p>
            </div>
            <div className="border-gray-300 border-2 p-2 rounded-sm">
              <p className="text-sm flex font-semibold mb-2 mt-2">
                <FaUniversity className="mr-2 mt-1 text-black" />
                College
              </p>
              <p className="text-md ">{formData.college}</p>
            </div>
            <div className="border-gray-300 border-2 p-2 rounded-sm">
              <p className="text-sm flex font-semibold mb-2 mt-2">
                <FaBuilding className="mr-2 mt-1 text-black" />
                Department
              </p>
              <p className="text-md ">{formData.department}</p>
            </div>
            <div className="border-gray-300 border-2 p-2 rounded-sm">
              <p className="text-sm flex font-semibold mb-2 mt-2">
                <FaCalendar className="mr-2 mt-1 text-black" />
                Semester
              </p>
              <p className="text-md ">{formData.semester}</p>
            </div>
          </div>
          <div className="flex justify-end mt-5">
            <CustomButton
              icon={<FaEdit/>}
              color={"blue"}
              text={"Edit"}
              onClick={() => setEditing(true)}
            />
            <CustomButton
              icon={<FaTrash/>}
              color={"red"}
              text={"Delete"}
              onClick={() => setDeleting(true)}
            />
          </div>
        </div>
      </motion.div>
      <motion.div
        className="col-span-2 md:col-span-1 p-4 bg-gray-200 rounded-lg shadow-md"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.95 }}
      >
        Second Column
      </motion.div>
      <motion.div
        className="col-span-2 bg-gray-200 rounded-md  flex items-center justify-center text-lg  font-semibold"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.95 }}
      >
        Special Section
      </motion.div>
     
      {editing && (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50"
  >
    <div className="bg-white p-8 w-1/2 mx-auto rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">
        <FaUserCog className="mr-2 text-black" /> Edit Profile
      </h2>
      <div className="mb-4">
        <p className="text-sm flex font-semibold mb-2">
          <FaUser className="mr-2 mt-1 text-black" />
          Name
        </p>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 mb-2 transition-colors duration-300 ease-in-out hover:border-blue-500"
        />
      </div>
      <div className="mb-4">
        <p className="text-sm flex font-semibold mb-2">
          <FaPhoneAlt className="mr-2 mt-1 text-black" />
          Contact
        </p>
        <input
          type="text"
          name="contact"
          value={formData.contact}
          onChange={handleInputChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 mb-2 transition-colors duration-300 ease-in-out hover:border-blue-500"
        />
      </div>
      <div className="mb-4">
        <p className="text-sm flex font-semibold mb-2">
          <FaUniversity className="mr-2 mt-1 text-black" />
          College
        </p>
        <input
          type="text"
          name="college"
          value={formData.college}
          onChange={handleInputChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 mb-2 transition-colors duration-300 ease-in-out hover:border-blue-500"
        />
      </div>
      <div className="mb-4">
        <p className="text-sm flex font-semibold mb-2">
          <FaBuilding className="mr-2 mt-1 text-black" />
          Department
        </p>
        <input
          type="text"
          name="department"
          value={formData.department}
          onChange={handleInputChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 mb-2 transition-colors duration-300 ease-in-out hover:border-blue-500"
        />
      </div>
      <div className="mb-4">
        <p className="text-sm flex font-semibold mb-2">
          <FaCalendar className="mr-2 mt-1 text-black" />
          Semester
        </p>
        <input
          type="text"
          name="semester"
          value={formData.semester}
          onChange={handleInputChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 mb-2 transition-colors duration-300 ease-in-out hover:border-blue-500"
        />
      </div>
      <div className="flex mt-4 justify-end">
        <CustomButton
          text={"Save"}
          color={"blue"}
          icon={<FaCheck className="mr-2" />}
          onClick={handleSaveClick}
        />
        <CustomButton
          text={"Cancel"}
          color={"red"}
          icon={<FaTimes className="mr-2" />}
          onClick={() => setEditing(false)}
        />
      </div>
    </div>
  </motion.div>
  
)}

    </div>
    {deleting && (
    <CustomPopup message={"Are you sure you want to delete your account?"} 
    subtext={"This action cannot be redone, all data will be lost."}
    button1={<CustomButton text={"yes"} color={"red"} onClick={()=>handleDelete()} icon={<FaTrash/>}/>}
    button2={<CustomButton text={"no"} color={"green"} onClick={()=>setDeleting(false)} icon={<FaTimes/>}/>}
    />
  )}
    </>
  );

}

export default UserProfilePage;
