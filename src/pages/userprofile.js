import React, { useState, useEffect } from "react";
import { db, storage } from "../firebase/Firebase";
import { collection, getDocs, query, where, doc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Button } from "@material-tailwind/react";

const UserProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({});
  const [editing, setEditing] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [selectedOption, setSelectedOption] = useState("Post");
  const [userPosts, setUserPosts] = useState([]);
  const auth = getAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser;

        if (currentUser) {
          const userCollectionRef = collection(db, 'users');
          const q = query(userCollectionRef, where('email', '==', currentUser.email));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const userDataFromSignup = querySnapshot.docs[0].data();
            setUserData(userDataFromSignup);
            setFormData(userDataFromSignup);
            if (userDataFromSignup.profilePicture) {
              setProfilePicture(userDataFromSignup.profilePicture);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [auth]);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const currentUser = auth.currentUser;
  
        if (currentUser) {
          const postsCollectionRef = collection(db, 'posts');
          const q = query(postsCollectionRef, where('owner', '==', currentUser.email)); // Query posts based on user's email
          const querySnapshot = await getDocs(q);
  
          if (!querySnapshot.empty) {
            const posts = querySnapshot.docs.map(doc => doc.data());
            setUserPosts(posts);
          }
        }
      } catch (error) {
        console.error('Error fetching user posts:', error);
      }
    };
  
    fetchUserPosts();
  }, [auth]);
  
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditClick = () => {
    setEditing(true);
  };

  const handleSaveClick = async () => {
    setEditing(false);
    try {
      const updatedUserData = {
        ...userData,
        name: formData.name,
        semester: formData.semester,
        department: formData.department,
        batch: formData.batch,
        college: formData.college,
        contact: formData.contact
      };

      const currentUser = auth.currentUser;
      if (currentUser) {
        const userCollectionRef = collection(db, 'users');
        const q = query(userCollectionRef, where('email', '==', currentUser.email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const userRef = doc(db, 'users', userDoc.id);
          await updateDoc(userRef, updatedUserData);

          console.log("Updated user data in Firestore:", updatedUserData);

          setUserData(updatedUserData);

        } else {
          console.error('User document not found');
        }
      } else {
        console.error('Current user not found');
      }

    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const storageRef = storage.ref();
      const fileRef = storageRef.child(`${auth.currentUser.uid}/profilePicture/${file.name}`);
      fileRef.put(file).then((snapshot) => {
        fileRef.getDownloadURL().then((url) => {
          setProfilePicture(url);
          const updatedUserData = {
            ...userData,
            profilePicture: url
          };
          setUserData(updatedUserData);
          updateDoc(doc(db, 'users', auth.currentUser.uid), updatedUserData);
        });
      }).catch((error) => {
        console.error('Error uploading file:', error);
      });
    }
  };

  const openFileInput = () => {
    document.getElementById("profilePictureInput").click();
  };

  const closeModal = () => {
    setEditing(false);
  };

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  return (
    <div className="container mx-auto mt-8 flex flex-wrap">
      <div className="w-full md:w-1/2 lg:w-1/2 xl:w-1/2 p-4">
        <div className="bg-white shadow-md rounded-lg p-4 mb-4 flex flex-col items-center justify-center">
          <label htmlFor="profilePictureInput" className="cursor-pointer mb-4" onClick={openFileInput}>
            {profilePicture ? (
              <img src={profilePicture} alt="Profile" className="w-24 h-24 rounded-full mb-4" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-300 mb-4"></div>
            )}
            <div className="text-blue-500">Change Profile Picture</div>
          </label>
          <input
            id="profilePictureInput"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleProfilePictureChange}
          />
          <div>
            <h2 className="text-xl font-semibold">{userData && userData.name}</h2>
            <p className="text-gray-500">Email: {userData && userData.email}</p>
            <p className="text-gray-500">Semester: {userData && userData.semester}</p>
            <p className="text-gray-500">Department: {userData && userData.department}</p>
            <p className="text-gray-500">Batch: {userData && userData.batch}</p>
            <p className="text-gray-500">College: {userData && userData.college}</p>
            <p className="text-gray-500">Contact: {userData && userData.contact}</p>
          </div>
          <div>
            <Button color="blue" onClick={handleEditClick}>Edit</Button>
          </div>
        </div>
      </div>
      <div className="w-full md:w-1/2 lg:w-1/2 xl:w-1/2 p-4">
        <div className="bg-white shadow-md rounded-lg p-4 mb-4">
          <h1 className="text-3xl font-bold mb-4">History</h1>
          <div className="mb-4">
            <label className="mr-2">Select:</label>
            <select onChange={(e) => handleOptionChange(e.target.value)} value={selectedOption}>
              <option value="Post">Post</option>
              <option value="Exchange">Exchange</option>
            </select>
          </div>
          {selectedOption === "Post" && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Your Posts</h2>
              {userPosts.length > 0 ? (
  <div className="flex flex-wrap">
    {userPosts.map((post, index) => (
      <div key={index} className="bg-white rounded-lg shadow-md p-4 m-2 flex-grow">
        <h3 className="text-lg font-semibold">{post.title}</h3>
        <p className="text-gray-500">Category: {post.category}</p>
        <p className="text-gray-500">Description: {post.description}</p>
      </div>
    ))}
  </div>
) : (
  <p className="text-gray-500">You haven't made any posts yet.</p>
)}

            </div>
          )}
          {selectedOption === "Exchange" && (
            <div>
              {/* Content for "Exchange" option */}
            </div>
          )}
        </div>
      </div>
      {editing && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white p-8 rounded-lg max-w-lg w-full">
            <h2 className="text-2xl font-semibold mb-4">Edit Profile</h2>
            <form>
              {['name', 'semester', 'department', 'batch', 'college', 'contact'].map((key) => (
                <div className="mb-2" key={key}>
                  <label htmlFor={key} className="block font-semibold capitalize">{key}</label>
                  <input
                    type="text"
                    id={key}
                    name={key}
                    value={formData[key]}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  />
                </div>
              ))}
              <Button color="blue" onClick={handleSaveClick}>Save</Button>
              <Button color="red" onClick={closeModal} className="ml-2">Cancel</Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfilePage;

