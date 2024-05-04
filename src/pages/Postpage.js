import { useEffect, useState,useRef } from "react";
import { useLocation } from "react-router-dom";
import { db } from "../firebase/Firebase";
import { getUserByEmail } from "../utils/Search";
import { FaThumbsUp, FaComment } from "react-icons/fa"; // Import icons
import { FiSend } from 'react-icons/fi'
import { ClipLoader } from "react-spinners";
import {
  addDoc,
  collection,
  doc,
  query,
  getDocs,
  where,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
import { auth } from "../firebase/Firebase";
import { motion } from "framer-motion";
import { set } from "firebase/database";
import Loader from "../components/Loader";
const Postpage = () => {
  const scrollTo = useRef(null);
  const [loading, setLoading] = useState(true);
  const [currentPost, setCurrentPost] = useState(null);
  const location = useLocation();
  const [currentReply, setCurrentReply] = useState("");
  const [currentComment, setCurrentComment] = useState("");
  const [fetchedComments, setFetchedComments] = useState([]);
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [clicked, setClicked] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(null);
  const [showReplies, setShowReplies] = useState(null);
  const [liked, setLiked] = useState(false);
  const [noOfLikes, setNoOfLikes] = useState(0);

  useEffect(() => {
    setUser(auth.currentUser);
    setCurrentPost(location.state);

    const fetchData = async () => {
      try {
        console.log("hello");
        setLoading(true);
        if (user && currentPost) {
          const cuser = await getUserByEmail(user.email);
          setCurrentUser(cuser);
          let q = query(
            collection(db, "comments"),
            where("postid", "==", currentPost.uid)
          );
          const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const fetched = querySnapshot.docs.map((doc) => doc.data()).sort((a, b) => { 
              return new Date(b.date) - new Date(a.date);
            });
            setFetchedComments(fetched);
            
          });
          return unsubscribe;
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [location.state, user]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (currentUser) {
          const querySnapshot2 = await getDocs(
            query(collection(db, "posts"), where("uid", "==", currentPost.uid))
          );
          const refData = querySnapshot2.docs[0].data();
          const likes = refData.likes || [];
          const hasLiked = likes.some(
            (element) => element === currentUser.name
          );
          setLiked(hasLiked);
          setNoOfLikes(likes.length);
        }
      } catch (error) {
        console.error("Error fetching likes:", error);
      }
    };

    fetchData();
  }, [currentUser, currentPost]);

  const postComment = async () => {
    setCurrentComment("");
    const date = new Date();
    const options = { month: "long", day: "numeric", year: "numeric" };
    const formattedDate = date.toLocaleDateString("en-US", options);
    try {
      let ids = doc(collection(db, "comments")).id;
      const userRef = await addDoc(collection(db, "comments"), {
        comment: currentComment,
        postid: currentPost.uid,
        commenter: currentUser.name,
        email: user.email,
        uid: ids,
        date: formattedDate,
      });

    } catch (error) {
      console.log(error);
    }
  };

  const commentReply = async (uid) => {
    setCurrentReply("");
    const date = new Date();
    const options = { month: "long", day: "numeric", year: "numeric" };
    const formattedDate = date.toLocaleDateString("en-US", options);
    try {
      const querySnapshot = await getDocs(
        query(collection(db, "comments"), where("uid", "==", uid))
      );
      const refId = querySnapshot.docs[0].id;
      const refData = querySnapshot.docs[0].data();
      const newReply = {
        name: currentUser.name,
        comment: currentReply,
        date: formattedDate,
      };
      const updatedReplies = [...(refData.replies || []), newReply];
      const commentRef = doc(db, "comments", refId);
      await updateDoc(commentRef, { replies: updatedReplies });
    } catch {
      console.log("erroreeee");
    }
  };

  const likePost = async (newliked) => {
    if (newliked === false) setNoOfLikes(noOfLikes - 1);
    else setNoOfLikes(noOfLikes + 1);

    try {
      const querySnapshot = await getDocs(
        query(collection(db, "posts"), where("uid", "==", currentPost.uid))
      );
      const refData = querySnapshot.docs[0].data();
      const refId = querySnapshot.docs[0].id;

      const postRef = doc(db, "posts", refId);

      let likeToAdd = [];
      const likeData = refData.likes || [];

      const indexToRemove = likeData.findIndex(
        (like) => like === currentUser.name
      );

      if (indexToRemove !== -1) {
        likeToAdd = likeData.filter((_, index) => index !== indexToRemove);
      } else {
        likeToAdd = [...likeData, currentUser.name];
      }

      await updateDoc(postRef, { likes: likeToAdd });
    } catch (error) {
      console.log(error.message);
    }
  };

  if (loading) {
    return (
      <Loader loading={loading} />
    );
  }

  return (
    <div>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-3/4 lg:pr-4">
            <motion.div
              className="bg-gray-100 p-4 rounded-lg shadow-md mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-semibold mb-2">
                {currentPost && currentPost.title}
              </h2>
              <h3 className="text-gray-600 text-sm mb-2 border-b-2 border-gray-500">
                by {currentPost && currentPost.username}
              </h3>
              <p className="text-gray-700 mb-4 mt-5">
                {currentPost && currentPost.description}
              </p>

              <div className="flex items-center justify-start">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 1.1 }}
                  className={`flex items-center ${
                    liked
                      ? "text-blue-500 hover:text-blue-700"
                      : "text-gray-500 hover:text-gray-700"
                  } focus:outline-none`}
                  onClick={() => {
                    const newLiked = !liked;
                    setLiked(newLiked);
                    likePost(newLiked);
                  }}
                >
                  <FaThumbsUp className="mr-1" size={20} />
                  <span className="text-black text-2xl">{noOfLikes}</span>
                </motion.button>
              </div>
            </motion.div>
          </div>

          <div className=" lg:mt lg:w-1/4 lg:pl-4 lg:border-l lg:border-gray-200 ">
            <div className="mb-8">
              <textarea
                value={currentComment}
                onChange={(e) => setCurrentComment(e.target.value)}
                type="text"
                placeholder="Write your comment..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 mb-2 transition-colors duration-300 ease-in-out hover:border-blue-500"
              />
              <button
                onClick={() => {
                  postComment();
                  setClicked((prev) => !prev);
                }}
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
              >
                 <FiSend className="text-xl" />
              </button>
            </div>

            <h3 className="text-xl font-semibold mb-4 ">Comments ({fetchedComments.length})</h3>
            <div className="overflow-auto max-h-[500px]">
            {fetchedComments.map((element, index) => (
  <motion.div
    key={index}
    className="bg-white rounded-lg mb-0 p-1"
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
  
    <div ref={scrollTo} className="bg-gray-100 rounded-lg p-3 mb-2">
      <p className="text-black text-md mb-2">{element.comment}</p>
      <div className="flex justify-between items-center text-xs text-gray-500">
        <span>
          Posted on {element.date} by{" "}
          {currentPost.username === element.commenter
            ? "Author"
            : element.commenter}
        </span>
      </div>
      <div className="flex justify-end gap-3 items-center text-xs text-gray-500 mt-2">
        <button
          onClick={() => {
            setShowReplyInput(element.uid);
            setShowReplies();
          }}
          className="text-blue-500 hover:underline focus:outline-none ml-2"
        >
          Reply
        </button>
        <button
          onClick={() => {
            setShowReplyInput();
            setShowReplies(element.uid);
          }}
          className="text-blue-500 hover:underline focus:outline-none ml-2"
        >
          Show replies ({element.replies ? element.replies.length : 0})
        </button>
      </div>
    </div>

    {showReplies === element.uid && element.replies && (
  <motion.div
    className="pl-4"
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    {element.replies.map((value, index) => (
      <div
        key={index}
        className="bg-gray-200 rounded-lg p-3 mb-2"
      >
        <p className="text-black text-sm">
          {value.comment}
        </p>
        <div className="text-xs text-gray-500">
          Posted on {value.date} by {value.name}
        </div>
      </div>
    ))}
  </motion.div>
)}
{showReplyInput === element.uid && (
  <motion.div 
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="mt-3"
  >
    <textarea
      onChange={(e) => setCurrentReply(e.target.value)}
      value={currentReply}
      placeholder="Write your reply..."
      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 mb-2 transition-colors duration-300 ease-in-out hover:border-blue-500"
    />
    <button
      onClick={() => {
        commentReply(element.uid);
        setClicked((prev) => !prev);
      }}
      className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none transition-colors duration-300 ease-in-out transform hover:scale-105 flex items-center"
    >
      <FiSend className="text-xl" /> {/* Replace text with Send icon */}
    </button>
  </motion.div>
)}

  </motion.div>
))}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Postpage;
