import { RiPencilLine } from "react-icons/ri";
import { Select, Option } from "@material-tailwind/react";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/Firebase";
import { addDoc, collection, doc, query, getDocs,where } from "firebase/firestore";
import { db } from "../firebase/Firebase";
import { useNavigate } from 'react-router-dom';

const Forum = () => {
  const nav = useNavigate();
  const [post, setPost] = useState(false);
  const [cat, setCat] = useState();
  const [user, setUser] = useState();
  const [name,setName] = useState();
  const [fetchedPosts,setFetchedPosts] = useState([])
  const [clicked,setClicked] = useState(false)

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

          q = query(collection(db, "posts"));
          const querySnapshot = await getDocs(q);
          const fetched = querySnapshot.docs.map((doc) => doc.data());
          console.log("hello");
          setFetchedPosts(fetched)

          let r = query(collection(db,"users"),where("email","==",user.email))
          const querySnapshot2 = await getDocs(r);
          const username = querySnapshot2.docs[0].data().name;
          setName(username)

        }
      } catch (error) {
        console.error("Error fetching posts: ", error);
      }
    };

    fetchData();
  }, [user,clicked]);
  console.log("hello");
  const [postDetails, setPostDetails] = useState({
    title: "",
    description: "",
    category: "",
  });

  console.log(fetchedPosts)

  const setInput = (event) => {
    const { name, value } = event.target;
    setPostDetails((prev) => ({ ...prev, [name]: value }));
  };

  const createPost = async () => {
    const date = new Date();
    const options = { month: "long", day: "numeric", year: "numeric" };
    const formattedDate = date.toLocaleDateString("en-US", options);
    console.log(formattedDate);
    setPost(false);
    try {
      let ids = doc(collection(db, "posts")).id;
      const userRef = await addDoc(collection(db, "posts"), {
        ...postDetails,
        category: cat,
        owner: user.email,
        username: name,
        uid: ids,
        time: formattedDate
      });
      console.log("User signed up successfully! User ID:", userRef.id);
      setPostDetails({
        title: "",
        description: "",
        category: "",
      });
    } catch {
      console.log("error");
    }
  };
  console.log(clicked);
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="hidden lg:flex flex-col w-1/4 bg-white border-r border-gray-300">
        <div className="p-4">
          <h1 className="text-lg font-semibold mb-4">Filters</h1>
          <Select label="Select Version">
            <Option value="fiction">fiction</Option>
            <Option>Material Tailwind React</Option>
            <Option>Material Tailwind Vue</Option>
            <Option>Material Tailwind Angular</Option>
            <Option>Material Tailwind Svelte</Option>
          </Select>
          <h1 className="text-lg font-semibold mt-5">Trending</h1>
        </div>
      </div>

      <div className="flex flex-col flex-grow overflow-y-auto">
        <div className="bg-white border-b border-gray-300 py-4 px-4 lg:hidden">
          <select className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500">
            <option value="latest">Lastest</option>
            <option value="top">Top</option>
            <option value="trending">Trending</option>
          </select>
        </div>

        <div className="fixed bottom-4 right-4 ">
          <div className="rounded-full bg-blue-500 p-2">
            <RiPencilLine
              onClick={() => setPost(true)}
              size={40}
              className="text-white cursor-pointer hover:text-black transition-colors duration-300"
            />
          </div>
        </div>
        {post === true && (
          <div className="fixed top-0 left-0 flex items-center justify-center w-full h-screen bg-black bg-opacity-50">
            <div className="bg-white p-8 border border-gray-300 rounded-lg w-3/4">
              <h2 className="text-lg font-semibold mb-4">NEW POST</h2>
              <input
                type="text"
                name="title"
                value={postDetails.title}
                onChange={setInput}
                placeholder="Title"
                className="w-full border border-gray-300 rounded p-2 mb-4"
              />
              <textarea
                name="description"
                value={postDetails.description}
                onChange={setInput}
                placeholder="What's on your mind?"
                rows="4"
                className="w-full border border-gray-300 rounded p-2 mb-4 resize-none"
              ></textarea>

              <Select
                name="category"
                label="Choose category"
                onChange={(selectedOption) => setCat(selectedOption)}
              >
                <Option value="fiction">fiction</Option>
              </Select>

              <div className="flex justify-end mt-4">
                <button
                  onClick={() => {createPost(); setClicked(prev=>!prev);}}
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mr-2"
                >
                  POST
                </button>
                <button
                  onClick={() => setPost(false)}
                  className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

{fetchedPosts.map((element)=>(
        <div key={element.uid} className="p-2">
          <div onClick={()=>{nav(`/forum/${element.uid}`,{state:element})}} className="bg-white shadow rounded-lg p-4 mb-1 cursor-pointer hover:bg-gray-200">
            <h2 className="text-lg font-semibold mb-2">{element.title}</h2>
            <p className="text-gray-600 mb-2">
              {element.category}
            </p>
            <p className="text-sm text-gray-500">
             Posted by {element.username} on {element.time}.
            </p>
          </div>
        </div>
))}
      </div>
    </div>
  );
};

export default Forum;