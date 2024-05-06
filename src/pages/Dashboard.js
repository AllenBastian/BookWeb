import { auth } from "../firebase/Firebase";
import { IsSignedUpContext } from "../context/Context";
import { useContext, useEffect } from "react";
import { Select, Option } from "@material-tailwind/react";
import Loader from "../components/Loader";
import {
  FaPlusCircle,
  FaChevronDown,
  FaChevronUp,
  FaTrashAlt,
  FaTimes,
  FaCommentAlt,
  FaPaperPlane,
  FaBookOpen,
  FaUser,
  FaBan,
  FaInfoCircle,
  FaCheck,
  FaClone,
  FaBook,
  FaPlus,
  FaLanguage,
} from "react-icons/fa";
import { useState } from "react";
import { ClipLoader } from "react-spinners";
import { motion } from "framer-motion";
import { db } from "../firebase/Firebase";

import {
  collection,
  addDoc,
  getDocs,
  doc,
  where,
  query,
  deleteDoc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { FaListCheck } from "react-icons/fa6";

const Dashboard = () => {

  
  const user = auth.currentUser;
  const nav = useNavigate();
  const { isSignedUp } = useContext(IsSignedUpContext);
  const [expandedReq, setExpandedReq] = useState(null);
  const [expandedBook, setExpandedBook] = useState(null);
  const [deletePop, setDeletePop] = useState(false);
  const [bookDetails, setBookDetails] = useState([]);
  const [reqDetails, setReqDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [temp, setTemp] = useState([]);
  const [temp2, setTemp2] = useState([]);
 
  useEffect(() => {

    const fetchData = async () => {
      try {
        const q = query(
          collection(db, "books"),
          where("owner", "==", user.email)
        );

        const r = query(collection(db, "requests"));

        const unsubscribeBooks = onSnapshot(
          
          q,
          (snapshot) => {
            const fetched = snapshot.docs.map((doc) => doc.data());
           
            setBookDetails(fetched);
          },
          (error) => {
            console.error("Error fetching books: ", error);
          }
        );

        const unsubscribeRequests = onSnapshot(
          r,
          (snapshot) => {
            const reqfetched = snapshot.docs.map((doc) => doc.data());
            const filtered = reqfetched.filter(
              (req) => req.requestto === user.email
            );
            const filtered2 = reqfetched.filter(
              (req) =>
                (req.requestto === user.email ||
                  req.requestfrom === user.email) &&
                req.accepted === true
            );
            setTemp(filtered);
            setReqDetails(reqfetched);
            setTemp2(filtered2);
          },
          (error) => {
            console.error("Error fetching requests: ", error);
          }
        );

        return () => {
          unsubscribeBooks();
          unsubscribeRequests();
        };
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  console.log(reqDetails);

  const handleExpand = (id) => {
    setExpandedBook((prevExpandedBook) => {
      if (prevExpandedBook === id) {
        return null;
      }
      return id;
    });

    setExpandedReq((prevExpandedReq) => {
      if (prevExpandedReq === id) {
        return null;
      }
      return id;
    });
  };

  const handleDelete = async (name) => {
    setDeletePop(false);
    setBookDetails(bookDetails.filter((book) => book.title !== name));
    setReqDetails(reqDetails.filter((req) => req.booktitile !== name));

    try {
      const q = query(collection(db, "books"), where("title", "==", name));
      const r = query(
        collection(db, "requests"),
        where("booktitile", "==", name)
      );

      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        await deleteDoc(doc.ref);
      }

      const querySnapshot2 = await getDocs(r);
      if (!querySnapshot2.empty) {
        const doc = querySnapshot2.docs[0];
        await deleteDoc(doc.ref);
      }
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  const handleDecline = async (id) => {
    setReqDetails(reqDetails.filter((req) => req.ruid !== id));
    try {
      const q = query(collection(db, "requests"), where("ruid", "==", id));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        await deleteDoc(doc.ref);
      }
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  console.log(bookDetails);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newBookInfo, setNewBookInfo] = useState({
    title: "",
    author: "",
    description: "",
    language: "",
    category: "",
    borrowPeriod: "",
  });
  console.log(newBookInfo);

  const handleChange2 = (event) => {
    console.log(event);
    setNewBookInfo((prevInfo) => ({
      ...prevInfo,
      category: event,
    }));
  };

  const handleAccept = async (id) => {
    try {
      const requestsRef = collection(db, "requests");
      const querySnapshot = await getDocs(
        query(requestsRef, where("ruid", "==", id))
      );

      const doc = querySnapshot.docs[0];
      console.log(doc);
      await updateDoc(doc.ref, {
        accepted: true,
      });
      console.log("Document updated successfully");
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  const handleDisable = async (name) => {
    try {
      const q = query(collection(db, "books"), where("title", "==", name));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        await updateDoc(doc.ref, {
          disabled: !doc.data().disabled,
        });
      }
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewBookInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };
  const handleSubmit = async (event) => {
    setIsDialogOpen(false);
    setExpandedBook(null);
    setBookDetails((prev) => [...prev, newBookInfo]);
    console.log(newBookInfo);
    try {
      const nameRef = collection(db, "users");
      const querySnapshot = await getDocs(
        query(nameRef, where("email", "==", user.email))
      );
      console.log(user.email);
      const docu = querySnapshot.docs[0].data();
      console.log(querySnapshot.docs[0].data());
      let ids = doc(collection(db, "books")).id;
      const docRef = await addDoc(collection(db, "books"), {
        ...newBookInfo,
        isBorrowed: false,
        disabled: false,
        owner: user.email,
        uid: ids,
        name: docu.name,
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }

    setNewBookInfo({
      title: "",
      author: "",
      description: "",
      borrowPeriod: "",
      language: "",
      category: "",
    });
  };

  if (loading)
    return (
      <Loader loading={loading}/>
    );


    if(isSignedUp===false)
      console.log("user not signed upsjbdjwbdkjwd");


  return (
    <>
      <div className="bg-gray-100 p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-20 lg:gap-4 text-center">
          <div>
            <div className="flex items-center justify-between p-4 bg-black rounded-t-lg shadow-md">
              <div className="flex justify-start">
                <FaBook className="text-2xl mr-2 text-white" />
                <div className="text-white">MY BOOKS</div>
              </div>
              <FaPlusCircle
                size={20}
                onClick={() => {
                  setIsDialogOpen(true);
                }}
                className="text-blue-500 cursor-pointer hover:text-green-500 transition-colors duration-300"
              />
            </div>
            <div className="p-4 bg-white rounded-lg shadow-md mt-2 md:h-screen lg:h-screen overflow-auto">
              {bookDetails.length === 0 ? (
                <div className="text-center text-2xl  text-gray-500">
                  No books added yet
                </div>
              ) : (
                bookDetails.map((book, index) => (
                  <div key={index} className="mb-4">
                    <div
                      className="flex justify-between items-center cursor-pointer hover:bg-gray-200 p-2 rounded-lg transition-colors duration-300"
                      onClick={() => handleExpand(book.title)}
                    >
                      <span>{book.title}</span>
                      {expandedBook === book.title ? (
                        <FaChevronUp />
                      ) : (
                        <FaChevronDown />
                      )}
                    </div>

                    {expandedBook === book.title && (
                      <>
                        <motion.div
                          className="bg-gray-100 p-4 rounded-lg shadow-md mb-8"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="border-b-2  border-gray-500 mb-2 pb-2">
                            <p className="text-md flex font-semibold mb-2 mt-2">
                              <FaBookOpen className="mr-2 mt-1 text-black" />
                              Title
                            </p>
                            <p className="text-md text-left italic">
                              {book.title}
                            </p>
                          </div>
                          <div className="mb-2 border-b-2  border-gray-500 pb-2">
                            <p className="text-md font-bold flex mt-2 mb-2 ">
                              <FaUser className="mr-2 text-black mt-1" />
                              Author
                            </p>
                            <p className="text-md text-left italic">
                              {book.author}
                            </p>
                          </div>
                          <div className="mb-2 border-b-2 border-gray-500 pb-2">
                            <p className="text-md font-bold  flex mt-2 mb-2">
                              <FaInfoCircle className="mr-2 text-black mt-1" />
                              Description
                            </p>
                            <p className="text-md text-left italic">
                              {book.description}
                            </p>
                          </div>
                          <div className="mb-2 border-b-2 border-gray-500 pb-2">
                            <p className="text-md font-bold  flex mt-2 mb-2">
                              <FaLanguage className="mr-2" size={30} />
                              Language
                            </p>
                            <p className="text-md text-left italic">
                              {book.language}
                            </p>
                          </div>
                          <div className="mb-2 border-b-2 border-gray-500 pb-2">
                            <p className="text-md font-bold  flex mt-2 mb-2">
                              <FaClone className="mr-2" size={20} />
                              Category
                            </p>
                            <p className="text-md text-left italic">
                              {book.category}
                            </p>
                          </div>

                          <div className="flex justify-end">
                            <motion.button
                              onClick={() => handleDisable(book.title)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className={`flex items-center px-3 py-1 ${
                                !book.disabled ? "bg-gray-500" : "bg-green-500"
                              } text-white rounded-md mr-2 mt-2 hover:bg-gray-600 transition-colors duration-300 focus:outline-none`}
                            >
                              {book.disabled ? (
                                <>
                                  <span className="mr-1">Enable</span>
                                  <FaCheck className="text-xl" />
                                </>
                              ) : (
                                <>
                                  <span className="mr-1">Disable</span>
                                  <FaBan className="text-xl" />
                                </>
                              )}
                            </motion.button>
                            <motion.button
                              onClick={() => setDeletePop(true)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="flex items-center px-3 py-1 bg-red-500 text-white rounded-md mt-2 hover:bg-red-600 transition-colors duration-300 focus:outline-none"
                            >
                              <span className="mr-1">Delete</span>
                              <FaTrashAlt className="text-xl" />
                            </motion.button>
                          </div>
                        </motion.div>

                        {deletePop === true && (
                          <>
                            <motion.div
                              className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                            >
                              <motion.div
                                className="bg-white p-4 border border-gray-300 rounded"
                                initial={{ scale: 0.5 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                              >
                                <h2 className="text-lg font-semibold mb-2">
                                  Are you Sure you want to delete?
                                </h2>
                                <div className="flex justify-center">
                                  <button
                                    onClick={() => {
                                      handleDelete(book.title);
                                    }}
                                    className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors duration-300 mr-2"
                                  >
                                    Yes
                                  </button>
                                  <button
                                    onClick={() => {
                                      setDeletePop(false);
                                    }}
                                    className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors duration-300"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </motion.div>
                            </motion.div>
                          </>
                        )}
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between p-4 bg-black rounded-t-lg shadow-md">
            <div className="flex justify-start">
                <FaPaperPlane className="text-2xl mr-2 text-white" />
                <div className="text-white">REQUESTS</div>
              </div>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-md mt-2 md:h-screen lg:h-screen overflow-auto">
              {temp.length === 0 ? (
                <div className=" text-2xl  text-gray-500">No requests</div>
              ) : (
                reqDetails.map(
                  (req) =>
                    req.requestto === user.email &&
                    req.accepted === false && (
                      <div key={req.ruid} className="mb-4">
                        <div
                          className="flex justify-between items-center cursor-pointer hover:bg-gray-200 p-2 rounded-lg transition-colors duration-300"
                          onClick={() => handleExpand(req.ruid)}
                        >
                          <span>{req.requsername}</span>
                          <span className="ml-5">{req.booktitile}</span>
                          {expandedReq === req.ruid ? (
                            <FaChevronUp />
                          ) : (
                            <FaChevronDown />
                          )}
                        </div>

                        {expandedReq === req.ruid && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="mt-2 flex  sm:flex-row justify-end gap-6 items-center"
                          >
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDecline(req.ruid)}
                              className="flex items-center bg-red-500 text-white rounded-md px-3 py-1 cursor-pointer"
                            >
                              <FaTimes className="text-white mr-2" />
                              <span>Decline</span>
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleAccept(req.ruid)}
                              className="flex items-center bg-green-500 text-white rounded-md px-3 py-1 cursor-pointer"
                            >
                              <FaCheck className="text-white mr-2" />
                              <span>Accept</span>
                            </motion.button>
                          </motion.div>
                        )}
                      </div>
                    )
                )
              )}
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between p-4 bg-black rounded-t-lg shadow-md">
            <div className="flex justify-start">
                <FaListCheck className="text-2xl mr-2 text-white" />
                <div className="text-white">STATUS</div>
              </div>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-md mt-2 md:h-screen lg:h-screen overflow-auto">
              {temp2.length === 0 ? (
                <div className="text-center text-gray-500">
                  No accepted requests
                </div>
              ) : (
                reqDetails.map(
                  (req) =>
                    req.accepted === true &&
                    (req.requestto === user.email ||
                      req.requestfrom === user.email) && (
                      <motion.div
                        key={req.ruid}
                        className="flex justify-between items-center cursor-pointer hover:bg-gray-200 p-2 rounded-lg transition-colors duration-300"
                      >
                        <span className="font-medieum text-black">
                          {req.booktitile}
                        </span>
                        <motion.div className="flex items-center justify-center w-8 h-8 bg-blue-400 rounded-full cursor-pointer hover:bg-blue-800 transition-colors">
                          <FaCommentAlt
                            className="w-4 h-4 text-white"
                            onClick={() => nav("/chat", { state: req })}
                          />
                        </motion.div>
                      </motion.div>
                    )
                )
              )}
            </div>
          </div>
        </div>
      </div>
      {isDialogOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50"
        >
          <div className="bg-white p-8 max-w-md mx-auto rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Add New Book</h2>
            <input
              type="text"
              name="title"
              value={newBookInfo.title}
              onChange={handleChange}
              placeholder="Title"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 mb-2 transition-colors duration-300 ease-in-out hover:border-blue-500"
            />
            <input
              type="text"
              name="author"
              value={newBookInfo.author}
              onChange={handleChange}
              placeholder="Author"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 mb-2 transition-colors duration-300 ease-in-out hover:border-blue-500"
            />
            <textarea
              type="text"
              name="description"
              value={newBookInfo.description}
              onChange={handleChange}
              placeholder="Description"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 mb-2 transition-colors duration-300 ease-in-out hover:border-blue-500"
            />
            <input
              type="text"
              name="language"
              value={newBookInfo.language}
              onChange={handleChange}
              placeholder="Language"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 mb-2 transition-colors duration-300 ease-in-out hover:border-blue-500"
            />

            <input
              type="text"
              name="borrowPeriod"
              value={newBookInfo.borrowPeriod}
              onChange={handleChange}
              placeholder="Borrow Period"
              className="w-full border  border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 mb-4 transition-colors duration-300 ease-in-out hover:border-blue-500"
            />

            <Select
              name="category"
              onChange={(selected) => {
                handleChange2(selected);
              }}
              label="Select category"
            >
              <Option value="">Select category</Option>
              <Option value="Fiction">Fiction</Option>
              <Option value="Non-Fiction">Non-Fiction</Option>
            </Select>

            <div className="flex mt-4 justify-end gap-4">
              <motion.button
                onClick={handleSubmit}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 flex items-center space-x-2"
              >
                <FaPlus />
                <span>Add Book</span>
              </motion.button>
              <motion.button
                onClick={() => setIsDialogOpen(false)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 flex items-center space-x-2"
              >
                <FaTimes />
                <span>Cancel</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default Dashboard;
