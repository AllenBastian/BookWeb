import { auth } from "../firebase/Firebase";
import { IsSignedUpContext } from "../context/Context";
import { useContext, useEffect } from "react";
import {
  FaPlusCircle,
  FaChevronDown,
  FaChevronUp,
  FaTrashAlt,
} from "react-icons/fa";
import { useState } from "react";
import { db } from "../firebase/Firebase";
import { collection, addDoc, getDocs, where, query,deleteDoc } from "firebase/firestore";
import { Button } from "@material-tailwind/react";

const Dashboard = () => {
  const user = auth.currentUser;
  const [expandedBook, setExpandedBook] = useState(null);
  const [deletePop, setDeletePop] = useState(false);
  const [bookDetails, setBookDetails] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetched = [];
        const q = query(
          collection(db, "books"),
          where("owner", "==", user.email)
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          fetched.push({ id: doc.id, ...doc.data() });
        });
        setBookDetails(fetched);
      } catch (error) {
        console.error("Error fetching books: ", error);
      }
    };

    fetchData();
  }, []);

  const handleExpand = (bookId) => {
    setExpandedBook((prevExpandedBook) => {
      if (prevExpandedBook === bookId) {
        return null;
      }
      return bookId;
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
  const { isSignedUp } = useContext(IsSignedUpContext);

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
    setBookDetails((prev) => [...prev, newBookInfo]);
    console.log(newBookInfo);
    try {
      const docRef = await addDoc(collection(db, "books"), {
        ...newBookInfo,
        isBorrowed: false,
        owner: user.email,
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

  return (
    <div className="bg-gray-100 p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-center">
        <div>
          <div className="flex items-center justify-between p-4 border border-gray-300 rounded">
            <span className="text-lg">ADD BOOKS</span>
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
          <div className="p-4 border border-gray-300 rounded mt-2 h-screen overflow-auto">
            {bookDetails.map((book, index) => (
              <div key={index} className="mb-4">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => handleExpand(book.id)}
                >
                  <span>{book.title}</span>
                  {expandedBook === book.id ? (
                    <FaChevronUp />
                  ) : (
                    <FaChevronDown />
                  )}
                </div>

                {expandedBook === book.id && (
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
          <div className=" p-4 border border-gray-300 rounded">REQUESTS</div>
          <div className=" p-4 border border-gray-300 rounded mt-2 h-screen">
            content here
          </div>
        </div>
        <div>
          <div className=" p-4 border border-gray-300 rounded">STATUS </div>
          <div className=" p-4 border border-gray-300 rounded mt-2 h-screen">
            content here
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
