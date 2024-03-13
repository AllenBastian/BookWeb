import { auth } from "../firebase/firebase";
import { IsSignedUpContext } from "../context/Context";
import { useContext, useEffect } from "react";
import { FaPlusCircle, FaChevronDown, FaChevronUp, FaTrashAlt } from "react-icons/fa";
import { useState } from "react";
import { db } from "../firebase/firebase";
import { collection, addDoc,getDocs } from "firebase/firestore";


const Dashboard = () => {

  const [expandedBook, setExpandedBook] = useState(null);
  const [bookDetails, setBookDetails] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetched = [];
        const querySnapshot = await getDocs(collection(db, "books"));
        querySnapshot.forEach((doc) => {
          fetched.push({ id:doc.id,...doc.data() });
        });
        setBookDetails(fetched);
      } catch (error) {
        console.error('Error fetching books: ', error);
      }
    };
  
    fetchData(); 
  }, [bookDetails]); 

  const handleExpand = (bookId) => {
    setExpandedBook((prevExpandedBook) => {
      if (prevExpandedBook === bookId) {
        return null;
      }
      return bookId;
    });
  };
  const handleDelete = (bookId) => {

    console.log(`Delete book with ID: ${bookId}`);
  };
  console.log(bookDetails)
  const { isSignedUp } = useContext(IsSignedUpContext);
  const user = auth.currentUser;
  if (user) {
    console.log(user.email + "is signed in");
  } else {
  }

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newBookInfo, setNewBookInfo] = useState({
    title: "",
    author: "",
    description: "",
    language: "",
    category: "",
    isBorrowed: false,
    owner: user.email,
  });
  console.log(newBookInfo);
  const openBox = () => {
    setIsDialogOpen(true);
  };

  const closeBox = () => {
    setIsDialogOpen(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewBookInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    setIsDialogOpen(false)
    setNewBookInfo({
      title: '',
      author: '',
      description: '',
      language: '',
      category: '',
    });
    try {
      const docRef = await addDoc(collection(db, "books"), {
        ...newBookInfo,
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
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
                openBox();
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
                    onClick={closeBox}
                    className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 ml-2"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="p-4 border border-gray-300 rounded mt-2 h-screen overflow-auto">
      {bookDetails.map((book) => (
        <div key={book.id} className="mb-4">
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
            <div className="border-t border-gray-300 pt-2">
              <p>Author: {book.author}</p>
              <p>Description: {book.description}</p>
              <FaTrashAlt onClick={() => handleDelete(book.id)} className="text-red-600" />
            </div>
          )}
        </div>
      ))}
    </div>
        </div>
        <div>
          <div className=" p-4 border border-gray-300 rounded">
            BORROWED BOOKS
          </div>
          <div className=" p-4 border border-gray-300 rounded mt-2 h-screen">
            content here
          </div>
        </div>
        <div>
          <div className=" p-4 border border-gray-300 rounded">HISTORY </div>
          <div className=" p-4 border border-gray-300 rounded mt-2 h-screen">
            content here
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
