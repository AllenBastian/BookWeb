import { useState, useEffect, useContext } from 'react';
import { db } from "../firebase/Firebase";
import { collection, addDoc } from "firebase/firestore";
import { IsSignedUpContext } from '../context/Context';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Input } from '@material-tailwind/react';
import { motion } from 'framer-motion';
import { FaUserPlus } from 'react-icons/fa';

const SignUpForm = () => {

  const [user, setUser] = useState();
  const [disableButton,setDisableButton] = useState(false);
  const [hide,setHide] = useState(false);
  const nav = useNavigate();
  const auth = getAuth();
  const { IsSignedUp,setIsSignedUp } = useContext(IsSignedUpContext);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
      }
    });

    return () => unsubscribe();
  }, []);

  const [userInfo, setUserInfo] = useState({
    name: '',
    semester: '',
    department: '',
    batch: '',
    college: '',
    contact: '',
  });



  useEffect(() => {
 
    if (user) {
      setUserInfo(prevState => ({
        ...prevState,
        email: user.email
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prevState => ({
      ...prevState,
      [name]: value
    }));

  };

  const handleSignUp = async () => {

    setHide(true);
    if (Object.values(userInfo).some((item) => item.trim() === "")){
      setDisableButton(true);
      setHide(false);
    }
    else
    {
    try {
      const userRef = await addDoc(collection(db, 'users'),{ ...userInfo,email:user.email});
      console.log('User signed up successfully! User ID:', userRef.id);

      setUserInfo({
        name: '',
        semester: '',
        department: '',
        batch: '',
        college: '',
        contact: '',
        email: userInfo.email 
      });

      setIsSignedUp(true);
      localStorage.setItem("isSignedUp", JSON.stringify(true));
      nav("/");
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };
  if(IsSignedUp===true){
    nav("/");
  }
}

  return (
    <div className="relative flex justify-center items-center h-screen bg-gray-100">
      
      <img src="images/brownbooks.jpg" alt="Background" className="absolute inset-0 w-full h-full object-cover" />
     
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute bg-offwhite p-7 rounded-md shadow-md w-96"
        style={{ zIndex: 1 }}
      >
        <h2 className="text-2xl font-medium mb-4">
  <FaUserPlus className="inline-block mr-2" />
  Sign Up to continue
</h2>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={userInfo.name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Semester"
            name="semester"
            value={userInfo.semester}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Department"
            name="department"
            value={userInfo.department}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Batch"
            name="batch"
            value={userInfo.batch}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="College"
            name="college"
            value={userInfo.college}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Contact"
            name="contact"
            value={userInfo.contact}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={userInfo.email}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            readOnly
          />
        </div>
        {hide ?( <p className="text-gray-500">Signing up...</p>):(
        <button onClick={handleSignUp} className={`w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-500  `}>Sign Up</button>
        )}
        {disableButton && <p className="text-red-500 text-sm mt-2">Please fill all the fields</p>}
      </motion.div>
    </div>
  );
};

export default SignUpForm;
