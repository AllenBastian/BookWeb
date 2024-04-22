

import { auth } from "../Firebase/Firebase";
import { IsSignedUpContext } from "../context/Context";
import { useContext, useEffect } from "react";
import {
  FaPlusCircle,
  FaChevronDown,
  FaChevronUp,
  FaTrashAlt,
} from "react-icons/fa";
import { useState } from "react";
import { css } from "@emotion/react";
import { ClipLoader } from "react-spinners";

import { db } from "../Firebase/Firebase";
import { collection, addDoc, getDocs,doc, where, query,deleteDoc } from "firebase/firestore";
import { Button } from "@material-tailwind/react";


const Dashboard = () => {
  const user = auth.currentUser;
  const { isSignedUp } = useContext(IsSignedUpContext);
  const [expandedReq,setExpandedReq] = useState(null)
  const [expandedBook, setExpandedBook] = useState(null);
  const [deletePop, setDeletePop] = useState(false);
  const [bookDetails, setBookDetails] = useState([]);
  const [reqDetails,setReqDetails] = useState([]);
  const [loading,setLoading] = useState(true)
  useEffect(() => {
    const fetchData = async () => {
      try {
        
        const q = query(
          collection(db, "books"),
          where("owner", "==", user.email)
        );

        const r = query(
          collection(db,"requests"),where("requestto","==",user.email)
        );
        const querySnapshot = await getDocs(q);
        const querySnapshot2 = await getDocs(r);
        const fetched = querySnapshot.docs.map((doc) => doc.data())
        const reqfetched = querySnapshot2.docs.map((doc) => doc.data())
        setBookDetails(fetched);
        setReqDetails(reqfetched);
      } catch (error) {
        console.error("Error fetching books: ", error);
      }
      finally{
        setLoading(false)
      }
    };
    fetchData();
   
  }, []);

  console.log(bookDetails)

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

    setDeletePop(false)
    setBookDetails(bookDetails.filter(book=>book.title!==name))
    try {
      const q = query(
        collection(db, "books"),
        where("title", "==", name)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        await deleteDoc(doc.ref);
      } else {
        
      }
    } catch (error) {
      console.error('Error deleting document: ', error);
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


  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewBookInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    setIsDialogOpen(false);
    setExpandedBook(null)
    setBookDetails((prev) => [...prev, newBookInfo]);
    console.log(newBookInfo);
    try {
      let ids = doc(collection(db, "books")).id;
      const docRef = await addDoc(collection(db, "books"), {
        ...newBookInfo,
        isBorrowed: false,
        owner: user.email,
        uid:ids
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
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color={"#123abc"} loading={loading} size={50} />
      </div>
    );

  return (
    <div className="bg-gray-100 p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-center">
        <div>
          <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
          <span className="text-lg">MY BOOKS</span>
            

            <FaPlusCircle
              size={20}
              onClick={() => {
                setIsDialogOpen(true);
              }}
              className="text-blue-500 cursor-pointer hover:text-green-500 transition-colors duration-300"
            />

            {isDialogOpen && (
              <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
                <div className="bg-white p-4 border border-gray-300 rounded">
                  <h2 className="text-lg font-semibold mb-2">Add New Book</h2>
                  <input
                    type="text"
                    name="title"
                    value={newBookInfo.title}
                    onChange={handleChange}
                    placeholder="Title"
                    className="w-full border border-gray-300 rounded p-2 mb-2"
                  />
                  <input
                    type="text"
                    name="author"
                    value={newBookInfo.author}
                    onChange={handleChange}
                    placeholder="Author"
                    className="w-full border border-gray-300 rounded p-2 mb-4"
                  />
                  <input
                    type="text"
                    name="description"
                    value={newBookInfo.description}
                    onChange={handleChange}
                    placeholder="description"
                    className="w-full border border-gray-300 rounded p-2 mb-4"
                  />
                  <input
                    type="text"
                    name="language"
                    value={newBookInfo.language}
                    onChange={handleChange}
                    placeholder="language"
                    className="w-full border border-gray-300 rounded p-2 mb-4"
                  />

                  <input
                    type="text"
                    name="borrowPeriod"
                    value={newBookInfo.borrowPeriod}
                    onChange={handleChange}
                    placeholder="borrow period"
                    className="w-full border border-gray-300 rounded p-2 mb-4"
                  />

                  <select
                    name="category"
                    value={newBookInfo.category}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded p-2 mb-4"
                  >
                    <option value="">Select category</option>
                    <option value="Fiction">Fiction</option>
                    <option value="Non-Fiction">Non-Fiction</option>
                  </select>

                  <button
                    onClick={handleSubmit}
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                  >
                    Add Book
                  </button>
                  <button
                    onClick={()=>setIsDialogOpen(false)}
                    className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 ml-2"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="p-4 bg-white rounded-lg shadow-md mt-2 h-screen overflow-auto">
            {bookDetails.map((book,index) => (
              <div key={index} className="mb-4">
                <div
                  className="flex justify-between items-center cursor-pointer"
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
                    <div className="border-t border-gray-300 pt-2">
                      <p>Author: {book.author}</p>
                      <p>Description: {book.description}</p>
                      <FaTrashAlt
                        onClick={() => setDeletePop(true)}
                        className="text-red-300 hover:text-red-500 transition-colors duration-300 transform hover:scale-110"
                      />
                    </div>

                    {deletePop === true && (
                      <>
                        <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
                          <div className="bg-white p-4 border border-gray-300 rounded">
                            <h2 className="text-lg font-semibold mb-2">
                              Are you Sure you want to delete?
                            </h2>
                            <div className="flex justify-center">
                              <button onClick={()=>{handleDelete(book.title)}}className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors duration-300 mr-2">
                                Yes
                              </button>
                              <button onClick={()=>{setDeletePop(false)}} className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors duration-300">
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
        <div>
        <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
            <span className="text-lg">REQUESTS</span>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-md mt-2 h-screen overflow-auto">
             {reqDetails.map((req)=>
             <div key={req.ruid} className="mb-4">
                 <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => handleExpand(req.ruid)}
                >
                  <span>{req.requestfrom}</span>
                  <span className="ml-5">{req.booktitile}</span>
                  {expandedReq === req.ruid? (
                    <FaChevronUp />
                  ) : (
                    <FaChevronDown />
                  )}
                </div>
             </div>)}
          </div>
        </div>
        <div>
          <div className=" p-4 bg-white rounded-lg shadow-md">STATUS </div>
          <div className=" p-4 bg-white rounded-lg shadow-md mt-2 h-screen">
            content here
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
