import React, { useState, useEffect, useRef } from "react";
import { db } from "../firebase/Firebase";
import {
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
  updateDoc,
  addDoc,
  onSnapshot,
} from "firebase/firestore";

import { getAuth, signOut } from "firebase/auth";
import { motion } from "framer-motion";
import {
  FaUserCog,
  FaClock,
  FaUser,
  FaEnvelope,
  FaArrowLeft,
  FaPhoneAlt,
  FaUniversity,
  FaBuilding,
  FaCalendar,
  FaEdit,
  FaTrash,
  FaCheck,
  FaTimes,
  FaHistory,
  FaBook,
  FaArrowRight,
} from "react-icons/fa";
import CustomButton from "../components/CustomButton";
import { isEditable } from "@testing-library/user-event/dist/utils";
import { toast } from "sonner";
import { set } from "firebase/database";
import Loader from "../components/Loader";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import { useNavigate } from "react-router-dom";

import CustomPopup from "../components/CustomPopup";
import { Deleter } from "../utils/Deleter";
import { getUserByEmail, getUserName } from "../utils/Search";
import { reviewer } from "../utils/Reviewer";

const UserProfilePage = () => {
  const previous = useRef();
  const [disableButton,setDisableButton] = useState(false);
  const [username, setUsername] = useState(); 
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({});
  const [editing, setEditing] = useState(false);
  const [star, setStar] = useState(0);
  const [reviewMessage, setReviewMessage] = useState("");
  const [selectedReview, setSelectedReview] = useState();
  const [deleting, setDeleting] = useState(false);
  const [reviewBox, setReviewBox] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const nav = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser;
        const name = await getUserName(currentUser.email);
        setUsername(name);

        if (currentUser) {
          const transactionCollectionRef = collection(db, "transactions");
          const q1 = query(transactionCollectionRef);

  

          const unsubscribe = onSnapshot(q1, (snapshot) => {
            const transactionData = [];
            snapshot.forEach((doc) => {
              if(doc.data().lender === currentUser.email || doc.data().borrower === currentUser.email)
                 transactionData.push(doc.data());
            });
            console.log("Transactions:", transactionData);
            setTransactions(transactionData);
          });
          const user = await getUserByEmail(currentUser.email);
          if (user) {
            setUserData(user);
            setFormData(user);
            previous.current = user;
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
    if(name !== "contact" && name !== "semester" && name !== "batch"){
      const isValidName = /^[a-zA-Z\s]*$/.test(value);
      if(!isValidName){
        return;
      }
    }

    if(name === "contact" || name === "semester"){
      const isValidPhoneNumber = /^\+?\d*$/.test(value);
      if(!isValidPhoneNumber){
        return;
      }
    }
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
        await Deleter("transactions", "lender", currentUser.email);
        await Deleter("transactions", "borrower", currentUser.email);

        toast.warning("User deleted successfully" , {
          duration: 1500, 
        });
        signOut(auth)
          .then(() => {
            localStorage.setItem("isSignedUp", JSON.stringify(false));
            nav("/");
          })
          .catch((error) => {
            console.error("Sign out error:", error);
          });
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  console.log(transactions);

  const handleSaveClick = async () => {
    if (Object.values(formData).some((item) => item.trim() === "")||formData.contact.length !== 10) 
      {

        setDisableButton(true);
        toast.error("Please fill all the fields" , {
          duration: 1500, 
        });
        return;
      }
      setDisableButton(false);
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
          toast.success("User data updated successfully" , {
            duration: 1500, // Duration in milliseconds
          });
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

  const handleReview = async () => {
    if (reviewMessage.trim() === ""||star===0) {
      toast.error("Please enter a review" , {
        duration: 1500, 
      });
      return;
    }
    setReviewBox(false);
    console.log(selectedReview);
    console.log(username)
    console.log(star);


    try {

    
      await addDoc(collection(db, "reviews"), {
        bookid: selectedReview.bookid,
        reviewer: username,
        comment: reviewMessage,
        rating: star,
        bookname: selectedReview.booktitle,
      });
     

      const r = query(
        collection(db, "transactions"),
        where("uid", "==", selectedReview.uid)
      );

      const querySnapshot = await getDocs(r);

      const mydoc = querySnapshot.docs[0].ref;
      await updateDoc(mydoc, { reviewed: true,stars:star});
      await reviewer(selectedReview.bookid, star);

      toast.success("Review added successfully" , {
        duration: 1500, // Duration in milliseconds
      });
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };

  const handleStarChange = (event, newValue) => {
    setStar(newValue);
  };

  if (loading) {
    return <Loader loading={loading} />;
  }
  return (
    <>
    <div className=" ">
      <div className="grid grid-cols-2 gap-4 md:p-9 p-4  lg:h-[300px]">
        <motion.div
          className="col-span-2 md:col-span-1 p-4 bg-gray-200 rounded-lg  shadow-md"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.95 }}
        >
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center ">
              <FaUserCog className="mr-2 text-black" /> Profile Settings
            </h2>
            <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
              <div className="bg-white rounded-lg  border-2 p-2  shadow-lg">
                <p className="text-sm flex font-semibold mb-2 mt-2">
                  <FaUser className="mr-2 mt-1 text-black" />
                  Name
                </p>
                <p className="text-md ">{formData.name}</p>
              </div>
              <div className="bg-white rounded-lg  border-2 p-2  shadow-lg">
                <p className="text-sm flex font-semibold mb-2 mt-2">
                  <FaEnvelope className="mr-2 mt-1 text-black" />
                  Email
                </p>
                <p className="text-md ">{formData.email}</p>
              </div>
              <div className="bg-white rounded-lg  border-2 p-2  shadow-lg">
                <p className="text-sm flex font-semibold mb-2 mt-2">
                  <FaPhoneAlt className="mr-2 mt-1 text-black" />
                  Contact
                </p>
                <p className="text-md ">{formData.contact}</p>
              </div>
              <div className="bg-white rounded-lg  border-2 p-2  shadow-lg">
                <p className="text-sm flex font-semibold mb-2 mt-2">
                  <FaUniversity className="mr-2 mt-1 text-black" />
                  College
                </p>
                <p className="text-md ">{formData.college}</p>
              </div>
              <div className="bg-white rounded-lg  border-2 p-2  shadow-lg">
                <p className="text-sm flex font-semibold mb-2 mt-2">
                  <FaBuilding className="mr-2 mt-1 text-black" />
                  Department
                </p>
                <p className="text-md ">{formData.department}</p>
              </div>
              <div className="bg-white rounded-lg  border-2 p-2  shadow-lg">
                <p className="text-sm flex font-semibold mb-2 mt-2">
                  <FaCalendar className="mr-2 mt-1 text-black" />
                  Semester
                </p>
                <p className="text-md ">{formData.semester}</p>
              </div>
            </div>
            <div className="flex justify-end mt-5">
              <CustomButton
                icon={<FaEdit />}
                color={"blue"}
                text={"Edit"}
                onClick={() => setEditing(true)}
              />
              <CustomButton
                icon={<FaTrash />}
                color={"red"}
                text={"Delete"}
                onClick={() => setDeleting(true)}
              />
            </div>
          </div>
        </motion.div>
        <motion.div
          className="col-span-2 md:col-span-1 p-4 bg-gray-200 rounded-lg shadow-md "
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.95 }}
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FaHistory className="mr-2 text-black" /> History
          </h2>
          <div className="flex flex-col space-y-4 lg:h-[300px] overflow-auto ">
            {transactions.length > 0 ? (
              transactions.map((transaction, index) => {
                return (
                  (transaction.lender === formData.email ||
                    transaction.borrower === formData.email) && (
                    <div
                      key={index}
                      className="bg-white rounded-lg shadow-md p-4 mb-4 relative"
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr",
                        gridTemplateRows: "auto auto",
                      }}
                    >
                  
                      <div className="flex justify-start">
                        <FaBook className="text-2xl mr-2 text-gray-800" />
                        <h2 className="text-lg text-gray-800">
                          {transaction.booktitle}
                        </h2>
                      </div>

                      <div className="flex justify-between items-center mt-3">
                        <div>
                          {transaction.lender === formData.email ? (
                            <div className="flex items-center">
                              <FaArrowRight className="text-lg mr-2 text-gray-800" />
                              <h1 className="text-gray-800">
                                {transaction.borrowerName}
                              </h1>
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <FaArrowLeft className="text-lg mr-2 text-gray-800" />
                              <h1 className="text-gray-800">
                                {transaction.lenderName}
                              </h1>
                            </div>
                          )}
                        </div>
                        <div
                          className={`font-semibold py-1 px-3 rounded-full ${
                            transaction.lender === formData.email
                              ? "bg-green-200 text-green-900"
                              : "bg-blue-200 text-blue-900"
                          }`}
                        >
                          {transaction.lender === formData.email
                            ? "Lended"
                            : "Borrowed"}
                        </div>
                      </div>

                      <div className="flex absolute top-0 right-0 mt-2 mr-2 text-sm text-gray-500   items-center">
                        <FaClock className="text-gray-800" size={20} />
                        <div className="text-sm text-gray-600">
                          {transaction.timestamp.toDate().toLocaleDateString()}
                        </div>
                      </div>

                      {transaction.reviewed===false && transaction.borrower=== formData.email? (
                      <div className="flex justify-between items-center mt-3">
                        <CustomButton
                          color={"blue"}
                          text={"Review"}
                          onClick={() => {
                            setReviewBox(true);
                            setSelectedReview(transaction);
                          }}
                        />
                      </div>
                      ) : (
                        <div className="flex justify-between items-center mt-3">
                          <Stack spacing={1}>
                            <Rating
                              name="size-large"
                              readOnly
                              defaultValue={transaction.stars}
                              size="large"
                            />
                            </Stack>
                        </div>
                      )}
                    </div>
                  )
                );
              })
            ) : (
              <div className="flex flex-col justify-center items-center h-full">
              <p>No transactions found.</p>
            </div>
            )}
          </div>
         
        </motion.div>
        </div>
       

        {editing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50"
          >
            <div className="bg-white p-4 md:p-8 w-full lg:w-1/2 mx-auto rounded-lg shadow-md">
              <div className="border-gray-500 border-b mb-4 md:mb-2">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <FaUserCog className="mr-2 mt-1 text-black" />
                  Edit Profile
                </h2>
              </div>
              <div className="mb-4">
                <p className="text-sm font-semibold mb-2 flex items-center">
                  <FaUser className="mr-2 mt-1 text-black" />
                  Name
                </p>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors duration-300 ease-in-out hover:border-blue-500"
                />
              </div>
              <div className="mb-4">
                <p className="text-sm font-semibold mb-2 flex items-center">
                  <FaPhoneAlt className="mr-2 mt-1 text-black" />
                  Contact
                </p>
                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors duration-300 ease-in-out hover:border-blue-500"
                />
              </div>
              <div className="mb-4">
                <p className="text-sm font-semibold mb-2 flex items-center">
                  <FaUniversity className="mr-2 mt-1 text-black" />
                  College
                </p>
                <input
                  type="text"
                  name="college"
                  value={formData.college}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors duration-300 ease-in-out hover:border-blue-500"
                />
              </div>
              <div className="mb-4">
                <p className="text-sm font-semibold mb-2 flex items-center">
                  <FaBuilding className="mr-2 mt-1 text-black" />
                  Department
                </p>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors duration-300 ease-in-out hover:border-blue-500"
                />
              </div>
              <div className="mb-4">
                <p className="text-sm font-semibold mb-2 flex items-center">
                  <FaCalendar className="mr-2 mt-1 text-black" />
                  Semester
                </p>
                <input
                  type="text"
                  name="semester"
                  value={formData.semester}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors duration-300 ease-in-out hover:border-blue-500"
                />
              </div>
              {disableButton && <p className="text-red-500 text-sm mt-2">Please Enter a valid number</p>}
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
                  onClick={() => {setEditing(false); setFormData(previous.current)}}
                />
              </div>
            </div>
          </motion.div>
        )}
      </div>
      {deleting && (
        <CustomPopup
          message={"Are you sure you want to delete your account?"}
          subtext={"This action cannot be redone, all data will be lost."}
          button1={
            <CustomButton
              text={"yes"}
              color={"red"}
              onClick={() => handleDelete()}
              icon={<FaTrash />}
            />
          }
          button2={
            <CustomButton
              text={"no"}
              color={"green"}
              onClick={() => setDeleting(false)}
              icon={<FaTimes />}
            />
          }
        />
      )}

      {reviewBox && (
        <div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50"
          >
            <div className="bg-white p-4 md:p-8 w-full lg:w-1/2 mx-auto rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-semibold">Give your review</h1>

                <button
                  onClick={() => setReviewBox(false)}
                  className="text-gray-600 hover:text-gray-800 focus:outline-none"
                >
                  <FaTimes />
                </button>
              </div>
              <div className="flex flex-col justify-center items-center gap-4">
                <Stack spacing={1}>
                  <Rating
                    name="size-large"
                    defaultValue={star}
                    onChange={handleStarChange}
                    size="large"
                  />
                </Stack>
                <textarea
                  className="border-2 border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:border-blue-500 transition-colors duration-300 ease-in-out hover:border-blue-500"
                  placeholder="Write your review here"
                  onChange={(e) => setReviewMessage(e.target.value)}
                />
              </div>
              <CustomButton
                color={"green"}
                icon={<FaCheck />}
                text={"Submit"}
                className="mt-5"
                onClick={() => handleReview()}
              />
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default UserProfilePage;
