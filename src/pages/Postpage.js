import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { db } from "../firebase/Firebase";
import { getUserByEmail } from "../utils/Search";
import {
  addDoc,
  collection,
  doc,
  query,
  getDocs,
  where,
  updateDoc,
} from "firebase/firestore";
import { auth } from "../firebase/Firebase";

const Postpage = () => {
  const [currentPost, setCurrentPost] = useState(null);
  const location = useLocation();
  const [currentReply, setCurrentReply] = useState();
  const [currentComment, setCurrenComment] = useState();
  const [fetchedComments, setFetchedComments] = useState([]);
  const [user, setUser] = useState();
  const [currentUser, setCurrentUser] = useState();
  const [clicked, setClicked] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState();
  const [showReplies, setShowReplies] = useState();

  useEffect(() => {
    console.log("hey in 1");

    setUser(auth.currentUser);

    setCurrentPost(location.state);

    const fetchData = async () => {
      try {
        if (user) {
          const cuser = await getUserByEmail(user.email);
          setCurrentUser(cuser);
          console.log(currentPost);
          let q = query(
            collection(db, "comments"),
            where("postid", "==", currentPost.uid)
          );
          const querySnapshot = await getDocs(q);
          const fetched = querySnapshot.docs.map((doc) => doc.data());
          setFetchedComments(fetched);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [location.state, user, clicked]);
  console.log("out");

  const postComment = async () => {
    setCurrenComment("");
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
    } catch {
      console.log("error");
    }
  };

  const commentReply = async (uid) => {
    setCurrentReply("");
    const date = new Date();
    const options = { month: "long", day: "numeric", year: "numeric" };
    const formattedDate = date.toLocaleDateString("en-US", options);
    try {
      console.log(uid);

      const querySnapshot = await getDocs(
        query(collection(db, "comments"), where("uid", "==", uid))
      );

      const refId = querySnapshot.docs[0].id;
      const refData = querySnapshot.docs[0].data();
      const newReply = { name: currentUser.name, comment: currentReply,date:formattedDate };
      const updatedReplies = [...(refData.replies || []), newReply];
      console.log(updatedReplies);
      const commentRef = doc(db, "comments", refId);
      await updateDoc(commentRef, { replies: updatedReplies });
    } catch {
      console.log("erroreeee");
    }
  };

  if (currentPost !== null) 
 {
    return (
      <div>
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row">
            <div className="lg:w-3/4 lg:pr-4">
              <h2 className="text-xl font-semibold mb-4">
                {currentPost.title}
              </h2>
              <h1 className="text-sm font-semibold mb-4">
                by {currentPost.username}
              </h1>
              <p className="text-gray-600 mb-4 text-justify">
                {currentPost.description}
              </p>
            </div>

            <div className=" lg:mt lg:w-1/4 lg:pl-4 ">
              <div className="mb-8">
                <textarea
                  value={currentComment}
                  onChange={(e) => setCurrenComment(e.target.value)}
                  type="text"
                  placeholder="Write your comment..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 mb-4"
                />
                <button
                  onClick={() => {
                    postComment();
                    setClicked((prev) => !prev);
                  }}
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                >
                  Post Comment
                </button>
              </div>


              <h3 className="text-lg font-semibold mb-4">Comments</h3>
              <div className="overflow-auto" style={{ maxHeight: "500px" }}>
                
                {fetchedComments.map((element) => (
                  <div
                    key={element.uid}
                    className="bg-gray-100 rounded-lg p-4 mb-4 "
                  >
                    <p className="text-gray-600 text-sm">{element.comment}</p>
                    <div className="text-xs text-green-500 mb-3">
                        
                      .posted on {element.date} by {currentPost.username===element.commenter?"Author":element.commenter}
                    </div>
                    <button
                      onClick={() => {
                        setShowReplyInput(element.uid);
                        setShowReplies();
                      }}
                      className="text-sm text-blue-500 hover:underline focus:outline-none"
                    >
                      Reply 
                    </button>
                    <button
                      onClick={() => {
                        setShowReplyInput();
                        setShowReplies(element.uid);
                      }}
                      className=" text-sm ml-5 text-blue-500 hover:underline focus:outline-none"
                    >
                      Show replies {element.replies ? element.replies.length : 0}

                    </button>
                   
                

                    {showReplyInput === element.uid  && (
                      <div>
                        <textarea
                          onChange={(e) => setCurrentReply(e.target.value)}
                          value={currentReply}
                          placeholder="Write your reply..."
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 mb-4"
                        />
                        <button
                          onClick={() => {
                            commentReply(element.uid);
                            setClicked((prev) => !prev);
                          }}
                          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                        >
                          Submit Reply
                        </button>
                      </div>
                    )}
                    {showReplies === element.uid && element.replies && (
                      <div>
                        {element.replies.map((value, index) => (
                          <div
                            key={index}
                            className="ml-5 bg-gray-100 rounded-lg mt-4 mb-4"
                          >
                            <p className="text-gray-600 text-sm">
                              {value.comment} 
                            </p>
                            <div className="text-xs text-green-500">
                             .posted on {value.date} by {value.name}
                        </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default Postpage;
