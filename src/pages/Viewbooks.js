import React, { useState, useEffect, useRef } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../firebase/Firebase";
import { Select, Option } from "@material-tailwind/react";
import {
  collection,
  where,
  query,
  getDocs,
  doc,
  addDoc,
  onSnapshot,
} from "firebase/firestore";
import {
  FaRegHandPaper,
  FaBookOpen,
  FaBook,
  FaUser,
  FaUserCircle,
  FaInfoCircle,
  FaList,
} from "react-icons/fa";
import { FiFilter } from "react-icons/fi";
import { ClipLoader } from "react-spinners";
import { motion } from "framer-motion";
const Viewbooks = () => {
  const scrollTo = useRef(null);
  const [loading, setLoading] = useState(true);
  const [bookDetails, setBookDetails] = useState([]);
  const [user, setUser] = useState("");
  const [searchCat, setSearchCat] = useState("all");
  const [searchBook, setSearchBook] = useState("");
  const [clicked, setClicked] = useState(false);
  const [selectedBook, setSelectedBook] = useState("");
  const initialBook = useRef([]);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user) {
          const unsubscribeBooks = onSnapshot(
            query(
              collection(db, "books"),
              where("owner", "!=", user.email),
              where("isBorrowed", "==", false),
              where("disabled", "==", false)
            ),
            (snapshot) => {
              const fetched = snapshot.docs.map((doc) => doc.data());
              const requestData = initialBook.current.map((data) => data.uid);
              const updatedFetched = fetched.map((element) => ({
                ...element,
                requested: requestData.includes(element.uid) ? true : false,
              }));
              initialBook.current = updatedFetched;
              setBookDetails(updatedFetched);
              setLoading(false);
            },
            (error) => {
              console.error("Error fetching books: ", error);
            }
          );

          const unsubscribeRequests = onSnapshot(
            query(
              collection(db, "requests"),
              where("requestfrom", "==", user.email)
            ),
            (snapshot) => {
              const requestData = snapshot.docs.map(
                (doc) => doc.data().bookuid
              );
              const updatedBookDetails = initialBook.current.map((element) => ({
                ...element,
                requested: requestData.includes(element.uid),
              }));
              setBookDetails(updatedBookDetails);
            },
            (error) => {
              console.error("Error fetching requests: ", error);
            }
          );

          return () => {
            unsubscribeBooks();
            unsubscribeRequests();
          };
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, [user, initialBook]);
  console.log(initialBook.current);

  useEffect(() => {
    scrollTo.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedBook]);

  const sendReq = async () => {
    try {
      let ids = doc(collection(db, "books")).id;
      await addDoc(collection(db, "requests"), {
        requestfrom: user.email,
        requsername: selectedBook.name,
        requestto: selectedBook.owner,
        booktitile: selectedBook.title,
        bookuid: selectedBook.uid,
        ruid: ids,
        accepted: false,
      });

      alert("Request sent successfully");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const dynamicSearch = async (searchString, category) => {
    await setSearchBook(searchString);
    console.log(searchString);
    if (searchString === "" && category === "all")
      setBookDetails(initialBook.current);
    else if (searchString === "") {
      console.log("in here yeah");
      const filteredSearch = initialBook.current.filter(
        (book) =>
          book.category.toLowerCase().trim() === category.toLowerCase().trim()
      );
      console.log(filteredSearch);
      setBookDetails(filteredSearch);
    } else {
      const filteredSearch = initialBook.current.filter((book) =>
        book.title.toLowerCase().trim().startsWith(searchString)
      );
      if (category !== "all") {
        const filteredSearch2 = filteredSearch.filter(
          (book) => book.category.toLowerCase() === category.toLowerCase()
        );
        setBookDetails(filteredSearch2);
      } else setBookDetails(filteredSearch);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color={"#123abc"} loading={loading} size={50} />
      </div>
    );
  }
  console.log(bookDetails);
  return (
    <div className="bg-gray-100 p-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-2xl border-b-2 border-black font-medium mb-4">
            <FaList className="mr-4 inline-block text-black" />
            Book Listings
          </h2>
          <div className="overflow-y-auto lg:h-screen">
            {bookDetails &&
              bookDetails.map((book) => (
                <div key={book.uid} className="mb-4">
                  <div
                    className="flex justify-between items-center cursor-pointer rounded-lg p-2 hover:bg-gray-100 transform transition-transform duration-300 hover:scale-90"
                    onClick={() => {
                      setSelectedBook(book);
                    }}
                  >
                    <div className="flex items-center">
                      <div className="mr-4">{book.title}</div>
                      <div className="text-gray-500">{book.author}</div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div ref={scrollTo} className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center  mb-4">
            <FiFilter className="text-lg mr-2 text-black" size={20} />
            <span className="text-xl font-medieum ">Filters</span>
          </div>
          <div className="lg:flex lg:items-center mb-4">
            <div className="flex mb-4 lg:mb-0 lg:mr-4 lg:w-1/2">
              <Select
                value={searchCat}
                onChange={(val) => {
                  setSearchCat(val);
                  dynamicSearch(searchBook.toLowerCase(), val);
                }}
                label="Search Category"
                className="w-full"
              >
                <Option value="all">All</Option>
                <Option value="Fiction">Fiction</Option>
                <Option value="Non-Fiction">Non-Fiction</Option>
              </Select>
            </div>
            <div className="flex lg:w-1/2">
              <input
                type="text"
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 w-full"
                value={searchBook}
                onChange={(event) =>
                  dynamicSearch(event.target.value.toLowerCase(), searchCat)
                }
                placeholder="Search by title"
              />
            </div>
          </div>
          <div className="mb-4"></div>
          <div>
            <div className="flex  text-black text-xl font-medium mt-5 mb-2">
              <FaBook className="mr-2 mt-1 text-black" size={20} />
              Book Info
            </div>

            <div>
              <motion.div
                key={selectedBook.title}
                className="bg-gray-100 p-4 rounded-lg shadow-md mb-8"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {selectedBook ? (
                  <>
                    <div className="border-b-2 border-gray-500 mb-4 pb-2">
                      <p className="text-lg flex font-semibold mb-2 mt-2">
                        <FaBookOpen className="mr-2 mt-1 text-black" />
                        Title
                      </p>
                      <p className="text-md italic">{selectedBook.title}</p>
                    </div>
                    <div className="mb-4 border-b-2  border-gray-500 pb-2">
                      <p className="text-lg font-bold flex mt-2 mb-2 ">
                        <FaUser className="mr-2 text-black mt-1" />
                        Author
                      </p>
                      <p className="text-md italic">{selectedBook.author}</p>
                    </div>
                    <div className="mb-4 border-b-2 border-gray-500 pb-2">
                      <p className="text-lg font-bold  flex mt-2 mb-2">
                        <FaInfoCircle className="mr-2 text-black mt-1" />
                        Description
                      </p>
                      <p className="text-md italic">
                        {selectedBook.description}
                      </p>
                    </div>
                    <div className="mb-4 border-b-2 border-gray-500 pb-2">
                      <p className="text-lg font-bold flex mb-2 mt-2">
                        <FaUserCircle className="mr-2 text-black mt-1" />
                        Owner
                      </p>
                      <p className="text-md italic">{selectedBook.name}</p>
                    </div>

                    <div className="flex justify-between mt-4">
                      {!selectedBook.requested ? (
                        <button
                          onClick={() => {
                            sendReq();
                            setClicked((prev) => !prev);
                            setSelectedBook((book) => ({
                              ...book,
                              requested: true,
                            }));
                          }}
                          className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700 transition-colors duration-300 focus:outline-none"
                        >
                          <FaRegHandPaper className="mr-1" /> Request
                        </button>
                      ) : (
                        <div className="text-lg text-gray-500">
                          You have already requested.
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="flex text-xl text-gray-400 font-medium justify-center items-center lg:h-96">
                    Select a book to display info
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Viewbooks;
