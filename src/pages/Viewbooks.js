import { useState, useEffect } from "react";
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
} from "firebase/firestore";
import {
  FaRegComments,
  FaRegHandPaper,
} from "react-icons/fa";

const Viewbooks = () => {
  const [bookDetails, setBookDetails] = useState([]);
  const [user, setUser] = useState("");
  const [searchCat, setSearchCat] = useState("all");
  const [searchBook, setSearchBook] = useState("");
  const [clicked, setClicked] = useState(false);
  const [selectedBook, setSelectedBook] = useState("");
  const [initialBook, setInitialBook] = useState("");
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
          let q;

          q = query(
            collection(db, "books"),
            where("owner", "!=", user.email)
          );

          const querySnapshot = await getDocs(q);
          const fetched = querySnapshot.docs.map((doc) => doc.data());

          let r;
          r = query(
            collection(db, "requests"),
            where("requestfrom", "==", user.email)
          );
          const querySnapshot2 = await getDocs(r);
          const requestData = querySnapshot2.docs.map((doc) => doc.data());
          const requestUids = requestData.map((data) => data.bookuid);
          const updatedFetched = fetched.map((element) => ({
            ...element,
            requested: requestUids.includes(element.uid) ? true : false,
          }));

          setInitialBook(updatedFetched);
          setBookDetails(updatedFetched);
        }
      } catch (error) {
        console.error("Error fetching books: ", error);
      }
    };

    fetchData();
  }, [user, clicked]);

  const sendReq = async () => {
    try {
      let ids = doc(collection(db, "books")).id;
      await addDoc(collection(db, "requests"), {
        requestfrom: user.email,
        requestto: selectedBook.owner,
        booktitile: selectedBook.title,
        bookuid: selectedBook.uid,
        ruid: ids,
      });

      alert("Request sent successfully");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const dynamicSearch = async (searchString, category) => {
    await setSearchBook(searchString);
    if (searchString === "" && category === "all") {
      setBookDetails(initialBook);
    } else if (searchString === "") {
      const filteredSearch = initialBook.filter(
        (book) => book.category.toLowerCase().trim() === category.toLowerCase().trim()
      );
      setBookDetails(filteredSearch);
    } else {
      const filteredSearch = initialBook.filter((book) =>
        book.title.toLowerCase().trim().startsWith(searchString)
      );
      if (category !== "all") {
        const filteredSearch2 = filteredSearch.filter(
          (book) => book.category.toLowerCase() === category.toLowerCase()
        );
        setBookDetails(filteredSearch2);
      } else {
        setBookDetails(filteredSearch);
      }
    }
  };

  return (
    <div className="bg-gray-100 p-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-medium mb-4">Book Listings</h2>
          <div className="overflow-y-auto max-h-screen">
            {bookDetails.map((book) => (
              <div key={book.uid} className="mb-4">
                <div
                  className="flex justify-between items-center cursor-pointer rounded-lg p-2 hover:bg-gray-200"
                  onClick={() => setSelectedBook(book)}
                >
                  <div>
                    {book.title}
                    <span className="ml-5 text-gray-500">{book.author}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-medium mb-4">Search Category</h2>
          <div className="mb-4">
            <Select
              value={searchCat}
              onChange={(val) => {
                setSearchCat(val);
                dynamicSearch(searchBook.toLowerCase(), val);
              }}
              label="Search Category"
              className=""
            >
              <Option value="all">All</Option>
              <Option value="Fiction">Fiction</Option>
              <Option value="Non-Fiction">Non-Fiction</Option>
            </Select>
          </div>
          <div className="mb-4">
            <input
              type="text"
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              value={searchBook}
              onChange={(event) => setSearchBook(event.target.value)}
              placeholder="Search by title"
            />
          </div>
          <div>
            <h2>Book and User Info</h2>
            {selectedBook && (
              <>
                <p>Title: {selectedBook.title}</p>
                <p>Author: {selectedBook.author}</p>
                <p>Description: {selectedBook.description}</p>
                <div className="mb-2 mr-2">
                  {selectedBook.requested === false ? (
                    <button className="text-blue-300 mr-4 hover:text-blue-800 transition-colors duration-300 transform hover:scale-110">
                      <FaRegHandPaper onClick={() => { sendReq(); setClicked(prev => !prev); setSelectedBook(book => ({ ...book, requested: true })) }} /> Request
                    </button>
                  ) : (
                    <div>You have already requested.</div>
                  )}
                  <button className="text-green-300 mr-2 hover:text-green-800 transition-colors duration-300 transform hover:scale-110">
                    <FaRegComments /> Chat
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Viewbooks;