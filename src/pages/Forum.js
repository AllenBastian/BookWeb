import React, { useState, useEffect, useRef } from "react";
import { ClipLoader } from "react-spinners";
import { RiPencilLine } from "react-icons/ri";
import { FaThumbsUp, FaComment } from "react-icons/fa";
import { Select, Option } from "@material-tailwind/react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/Firebase";
import { motion } from "framer-motion";
import {
  addDoc,
  collection,
  query,
  getDocs,
  where,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase/Firebase";
import { useNavigate } from "react-router-dom";

const Forum = () => {
  const nav = useNavigate();
  const [loading, setLoading] = useState(true); // State to manage loading
  const [post, setPost] = useState(false);
  const [cat, setCat] = useState();
  const [user, setUser] = useState();
  const [name, setName] = useState();
  const allPosts = useRef([]);
  const [fetchedPosts, setFetchedPosts] = useState([]);
  const [clicked, setClicked] = useState(false);
  const [postDetails, setPostDetails] = useState({
    title: "",
    description: "",
    category: "",
  });

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
          const postsQuery = query(collection(db, "posts"));
          const unsubscribePosts = onSnapshot(postsQuery, (snapshot) => {
            const fetchedPosts = snapshot.docs.map((doc) => doc.data());

            const commentsQuery = query(collection(db, "comments"));
            const unsubscribeComments = onSnapshot(
              commentsQuery,
              (commentsSnapshot) => {
                const allComments = commentsSnapshot.docs.map((doc) =>
                  doc.data()
                );

                const commentsByPostId = {};
                allComments.forEach((comment) => {
                  const postId = comment.postid;
                  commentsByPostId[postId] = commentsByPostId[postId] || 0;
                  commentsByPostId[postId]++;
                });

                const updatedFetchedPosts = fetchedPosts.map((post) => {
                  const commentsCount = commentsByPostId[post.uid] || 0;
                  const totalLikesAndComments =
                    (post.likes ? post.likes.length : 0) + commentsCount;
                  return { ...post, commentsCount, totalLikesAndComments };
                });

                updatedFetchedPosts.sort(
                  (a, b) => b.totalLikesAndComments - a.totalLikesAndComments
                );

                allPosts.current = updatedFetchedPosts;
                setFetchedPosts(updatedFetchedPosts);
              }
            );

            return () => {
              unsubscribeComments();
            };
          });

          const userQuery = query(
            collection(db, "users"),
            where("email", "==", user.email)
          );
          const querySnapshot = await getDocs(userQuery);

          if (!querySnapshot.empty) {
            const username = querySnapshot.docs[0].data().name;
            setName(username);
          }

          setLoading(false);

          return () => {
            unsubscribePosts();
          };
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, [user]);

  const setInput = (event) => {
    const { name, value } = event.target;
    setPostDetails((prev) => ({ ...prev, [name]: value }));
  };

  const createPost = async () => {
    const date = new Date();
    const options = { month: "long", day: "numeric", year: "numeric" };
    const formattedDate = date.toLocaleDateString("en-US", options);
    setPost(false);
    try {
      let ids = doc(collection(db, "posts")).id;
      const userRef = await addDoc(collection(db, "posts"), {
        ...postDetails,
        category: cat,
        owner: user.email,
        username: name,
        uid: ids,
        time: formattedDate,
      });

      setPostDetails({
        title: "",
        description: "",
        category: "",
      });
      setClicked((prev) => !prev);
    } catch (error) {
      console.error("Error creating post: ", error);
    }
  };

  const catFilter = (selected) => {
    console.log(selected);
    setFetchedPosts(allPosts.current);
    if (selected === "all") return;

    const newFetch = allPosts.current.filter(
      (post) => post.category === selected
    );
    setFetchedPosts(newFetch);
    console.log(newFetch);
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color={"#123abc"} loading={loading} size={50} />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="hidden lg:flex flex-col w-1/4 bg-white border-r border-gray-300">
        <div className="p-4">
          <h1 className="text-lg font-semibold mb-4">Filters</h1>
          <Select
            onChange={catFilter}
            label="Select Category"
            className="w-full mb-4"
          >
            <Option value="all" className="py-2 px-4 block w-full text-left">
              All
            </Option>
            <Option
              value="fiction"
              className="py-2 px-4 block w-full text-left"
            >
              Fiction
            </Option>
            <Option
              value="non-fiction"
              className="py-2 px-4 block w-full text-left"
            >
              Non-fiction
            </Option>
            <Option
              value="engineering"
              className="py-2 px-4 block w-full text-left"
            >
              Engineering
            </Option>
          </Select>

          <div className="bg-white-200 rounded-lg p-4 mt-4">
            <h1 className="text-lg font-semibold mb-2">Trending Posts</h1>
            {fetchedPosts.length > 0 &&
              fetchedPosts.map((post, index) => {
                let likes = post.likes ? post.likes.length : 0;
                if (index < 5) {
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: -10 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.5 }}
                      className="relative text-sm mt-5 p-2 border border-gray-300 rounded-lg post-name hover:bg-gray-200 cursor-pointer transform transition-transform duration-300 hover:scale-105"
                      onClick={() => nav(`/forum/${post.uid}`, { state: post })}
                    >
                      <div className="absolute left-0 top-0 h-full bg-blue-500 text-white rounded-l-lg px-2  py-1">
                        #{index + 1}
                      </div>
                      <div className="ml-10">
                        <span className="font-bold">{post.title}</span>
                        <div className="flex mt-1">
                          <span>
                            <FaThumbsUp className="text-blue-500" /> {likes}
                          </span>
                          <span className="ml-2">
                            <FaComment className="text-gray-500" />{" "}
                            {post.commentsCount}{" "}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                }
              })}
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-grow overflow-y-auto">
        <div className="bg-white border-b border-gray-300 py-4 px-4 lg:hidden">
          <Select
            onChange={catFilter}
            label="Select Category"
            className="w-full mb-4"
          >
            <Option value="all" className="py-2 px-4 block w-full text-left">
              All
            </Option>
            <Option
              value="fiction"
              className="py-2 px-4 block w-full text-left"
            >
              Fiction
            </Option>
            <Option
              value="non-fiction"
              className="py-2 px-4 block w-full text-left"
            >
              Non-fiction
            </Option>
            <Option
              value="engineering"
              className="py-2 px-4 block w-full text-left"
            >
              Engineering
            </Option>
          </Select>
        </div>

        {fetchedPosts.map((post) => (
  <motion.div
    key={post.uid}
    className="p-2 z-0"
    initial={{ opacity: 0, y: -10 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.5 }}
  >
    <div
      onClick={() => nav(`/forum/${post.uid}`, { state: post })}
      className="bg-white shadow-sm rounded-lg p-4 mb-4 cursor-pointer transition-transform duration-300 ease-in-out transform hover:scale-90"
      style={{ zIndex: 1 }}
    >
      <h2 className="text-lg font-semibold mb-2">{post.title}</h2>
      <p className="text-gray-600 mb-2">{post.category}</p>
      <p className="text-sm text-gray-500 mb-4">
        Posted by {post.username} on {post.time}.
      </p>
      <div className="flex justify-end items-center">
        <span className="text-gray-500 flex items-center mr-4">
          <FaThumbsUp className="text-blue-500 mr-1" />
          {post.likes ? post.likes.length : 0}
        </span>
        <span className="text-gray-500 flex items-center">
          <FaComment className="text-gray-500 mr-1" />
          {post.commentsCount}
        </span>
      </div>
    </div>
  </motion.div>
))}
        <div className="fixed bottom-4 right-4">
          <div className="rounded-full bg-blue-500 p-2">
            <RiPencilLine
              onClick={() => setPost(true)}
              size={40}
              className="text-white cursor-pointer hover:text-black transition-colors duration-300"
            />
          </div>
        </div>

        {post === true && (
          <motion.div 
          initial={{ opacity: 0, y: -10 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.5 }}
          className="fixed top-0 left-0 flex items-center justify-center w-full h-screen bg-black bg-opacity-50">
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
                <Option value="non-fiction">non-fiction</Option>
                <Option value="engineering">Engineering</Option>
              </Select>

              <div className="flex justify-end mt-4">
                <button
                  onClick={createPost}
                  className={`bg-blue-500 text-white py-2 px-4 rounded mr-2 ${
                    !postDetails.title || !postDetails.description || !cat
                      ? "bg-blue-500 opacity-50 cursor-not-allowed"
                      : "hover:bg-blue-600"
                  }`}
                  disabled={
                    !postDetails.title || !postDetails.description || !cat
                  }
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
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Forum;
