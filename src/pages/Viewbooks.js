import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { FaSearch } from "react-icons/fa";
import { db } from "../firebase/Firebase";
import { Select, Option } from "@material-tailwind/react";
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
  const [searchCat, setSearchCat] = useState("all");
  const [searchUser, setSearchUser] = useState("");
  const [clicked, setClicked] = useState(false);

  const auth = getAuth();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      }
    });
  }, []);

  useEffect(() => {

    const fetchData = async () => {
      try {
        const fetched = [];
        if (user) {
          let q;
          if ((searchUser === "")) {
            console.log("incat")
            if (searchCat === "all") {
              q = query(
                collection(db, "books"),
                where("owner", "!=", user.email)
              );
            } else {
              q = query(
                collection(db, "books"),
                where("owner", "!=", user.email),
                where("category", "==", searchCat)
              );
            }
          }
          else
          {
            console.log("inuser")
            if (searchCat === "all") {
                q = query(
                  collection(db, "books"),
                  where("owner", "!=", user.email),
                  where("owner", "==", searchUser)
                );
              } else {
                q = query(
                  collection(db, "books"),
                  where("owner", "!=", user.email),
                  where("category", "==", searchCat),
                  where("owner", "==", searchUser)
                );
              }
          }
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

    console.log("in here");

    fetchData();
  }, [user, searchCat, clicked]);

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
    <div className="bg-gray-100 p-4">
      <div class="grid md:grid-rows-7 grid-rows-1 md:grid-flow-col gap-4 ">
        <div
          class="md:row-span-7 md:col-span-3 bg-white rounded-lg shadow-md p-4 h-screen mt-5  overflow-y-auto"
          style={window.innerWidth >= 1024 ? { width: "900px" } : {}}
        >
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
            <div className="mb-2 md:mb-0 mr-2">
              <Select
                value={searchCat}
                onChange={(val) => {
                  setSearchCat(val);
                }}
                label="Search Category"
                className=""
              >
                <Option value="all">all</Option>
                <Option value="Fiction">fiction</Option>
                <Option value="Non-Fiction">non-fiction</Option>
              </Select>
            </div>
            <div className="mb-2 md:mb-0">
              <input
                type="text"
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                value={searchUser}
                onChange={(event) => setSearchUser(event.target.value)}
                placeholder="search by username"
              />
            </div>
            <button
              onClick={() => {
                setClicked((prevClicked) => !prevClicked)
              }}
              className="ml-2 bg-blue-500 text-white rounded-lg px-4 py-2 focus:outline-none hover:bg-blue-600"
            >
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
