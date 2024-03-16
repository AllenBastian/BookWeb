import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { FaSearch } from "react-icons/fa";
import { db } from "../firebase/Firebase";
import { collection, where, query, getDocs } from "firebase/firestore";
import {
  FaChevronDown,
  FaChevronUp,
  FaRegComments,
  FaRegHandPaper,
} from "react-icons/fa";

const Viewbooks = () => {
  const [bookDetails, setBookDetails] = useState([]);
  const [user, setUser] = useState("");
  const [expandedBook, setExpandedBook] = useState(null);
  const [searchCat, setSearchCat] = useState("");
  const [searchUser, setSearchUser] = useState("");

  console.log(window.innerWidth)

  const auth = getAuth();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
      }
    });

    const fetchData = async () => {
      try {
        const fetched = [];
        if (user) {
          const q = query(
            collection(db, "books"),
            where("owner", "!=", user.email)
          );
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            fetched.push({ id: doc.id, ...doc.data() });
          });
        }
        setBookDetails(fetched);
      } catch (error) {
        console.error("Error fetching books: ", error);
      }
    };

    fetchData();
  }, [user]);

  console.log(bookDetails);

  const handleExpand = (bookid) => {
    setExpandedBook((prevExpandedBook) => {
      if (prevExpandedBook === bookid) {
        return null;
      }
      return bookid;
    });
  };

  return (
    // <div className="bg-gray-100 p-4">
    //   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    //     <div className=" md:block bg-white rounded-lg shadow-md p-4 h-screen overflow-y-auto">
    //       <h2 className="text-xl font-medium mb-4 underline underline-offset-5">
    //         Book Listings
    //       </h2>
    //       {bookDetails.map((book, index) => (
    //         <div key={index} className="mb-4">
    //           <div
    //             className="flex justify-between items-center cursor-pointer"
    //             onClick={() => handleExpand(book.id)}
    //           >
    //             <span>{book.title}</span>
    //             {expandedBook === book.id ? <FaChevronUp /> : <FaChevronDown />}
    //           </div>

    //           {expandedBook === book.id && (
    //             <div className="border-t border-gray-300 pt-2">
    //               <p>Author: {book.author}</p>
    //               <p>Description: {book.description}</p>
    //               <div className="flex items-center justify-end mr-2 mt-2">
    //                 <button className="text-blue-300 mr-4 hover:text-blue-800 transition-colors duration-300 transform hover:scale-110">
    //                   <FaRegHandPaper /> Request
    //                 </button>
    //                 <button className="text-green-300 mr-2 hover:text-green-800 transition-colors duration-300 transform hover:scale-110">
    //                   <FaRegComments /> Chat
    //                 </button>
    //               </div>
    //             </div>
    //           )}
    //         </div>
    //       ))}
    //     </div>

    //     <div className="bg-white rounded-lg shadow-md p-4">
    //       <div className="flex items-center">
    //         <select
    //           value={searchCat}
    //           onChange={(event) => {
    //             setSearchCat(event.target.value);
    //           }}
    //           name="Category"
    //           className="border border-gray-300 rounded-lg px-4 py-2 mr-2 focus:outline-none focus:border-blue-500"
    //         >
    //           <option value="">Select category</option>
    //           <option value="fiction">fiction</option>
    //           <option value="non-fiction">non-fiction</option>
    //         </select>
    //         <input
    //           type="text"
    //           className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
    //           placeholder="search by username"
    //         />
    //         <button className="ml-2 bg-blue-500 text-white rounded-lg px-4 py-2 focus:outline-none hover:bg-blue-600">
    //           <FaSearch />
    //         </button>
    //       </div>
    //     </div>
    //   </div>

    //   <div className="flex flex-col bg-white rounded-lg shadow-md p-4">
    //     dsd
    //   </div>
    // </div>
    <div className="bg-gray-100 p-4">
      <div class="grid md:grid-rows-7 grid-rows-1 md:grid-flow-col gap-4 " >
        <div class="md:row-span-7 md:col-span-3 bg-white rounded-lg shadow-md p-4 h-screen mt-5  overflow-y-auto" style={window.innerWidth >= 1024 ? { width: '900px' } : {}}>
          <h2 className="text-xl font-medium mb-4">Book Listings</h2>
          {bookDetails.map((book, index) => (
            <div key={index} className="mb-4">
              <div
                className="flex justify-between items-center cursor-pointer rounded-lg p-2 hover:bg-gray-200 "
                onClick={() => handleExpand(book.id)}
              >
                 <div>
        {book.title} 
        <span className="ml-5 text-gray-500">{book.author}</span>
      </div>
               
              </div>

          
            </div>
          ))}
        </div>
        <div class="md:col-span-2 bg-white rounded-lg shadow-md p-4  mt-5">
            
        <div className="flex flex-col md:flex-row items-center">
  <div className="mb-2 md:mb-0">
    <select
      value={searchCat}
      onChange={(event) => {
        setSearchCat(event.target.value);
      }}
      name="Category"
      className="border border-gray-300 rounded-lg px-4 py-2 mr-2 focus:outline-none focus:border-blue-500"
    >
      <option value="">Select category</option>
      <option value="fiction">fiction</option>
      <option value="non-fiction">non-fiction</option>
    </select>
  </div>
  <div className="mb-2 md:mb-0">
    <input
      type="text"
      className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
      placeholder="search by username"
    />
  </div>
  <button className="ml-2 bg-blue-500 text-white rounded-lg px-4 py-2 focus:outline-none hover:bg-blue-600">
    <FaSearch />
  </button>
</div>

        </div>
     
        <div class="md:col-span-2 md:row-span-6 bg-white rounded-lg shadow-md p-4 relative">
  <h2>Book and user Info</h2>
  <div className="absolute bottom-0 right-0 mb-2 mr-2 info">
    <button className="text-blue-300 mr-4 hover:text-blue-800 transition-colors duration-300 transform hover:scale-110">
      <FaRegHandPaper /> Request
    </button>
    <button className="text-green-300 mr-2 hover:text-green-800 transition-colors duration-300 transform hover:scale-110">
      <FaRegComments /> Chat
    </button>
  </div>
</div>
    </div>
    </div>
  );
};

export default Viewbooks;
