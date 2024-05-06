import React, { useState, useEffect, useContext } from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { auth } from "../firebase/Firebase";
import { useNavigate } from "react-router-dom";
import { IsSignedUpContext } from "../context/Context";
import { collection, query, where, getDocs } from "firebase/firestore";
import { IoNotificationsOutline } from "react-icons/io5";
import SignUpForm from "../pages/Signup";
import { Link } from "react-router-dom";
import Loader from "./Loader";

import { db } from "../firebase/Firebase";
import { css } from "@emotion/react";
import { ClipLoader } from "react-spinners";

import {
  Navbar,
  Collapse,
  Typography,
  IconButton,
  Button,
} from "@material-tailwind/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { IoPeopleOutline } from "react-icons/io5";
import { LuLayoutDashboard } from "react-icons/lu";
import { IoBookOutline } from "react-icons/io5";
import { SlLogin, SlLogout } from "react-icons/sl"; 
import { HiOutlineUserCircle } from "react-icons/hi2";
import { IoIosNotificationsOutline } from "react-icons/io5";
import { Tooltip } from "@material-tailwind/react";

import { NotificationCountContext } from "../context/Context";

function NavList() {
  const nav = useNavigate();
  const {notificationCount} = useContext(NotificationCountContext);
 
  const provider = new GoogleAuthProvider();
  const [loading, setLoading] = useState(true);
 const {isSignedUp, setIsSignedUp} = useContext(IsSignedUpContext);
  const [ user, setUser ] = useState(false);

  useEffect(() => {

    
    const storedIsSignedUp = localStorage.getItem("isSignedUp");
    if (storedIsSignedUp !== null) {
      setIsSignedUp(JSON.parse(storedIsSignedUp));
    }
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(true);
        setLoading(false);
      } else {
        setUser(false);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  },[])


  const logout = () => {
    signOut(auth).then(() => {
      setUser(false);
      setIsSignedUp(false)
      localStorage.setItem("isSignedUp", JSON.stringify(false));
      nav("/");
    }).catch((error) => {
      console.error("Sign out error:", error);
    });
  };
  const login = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const email = result.user.email; 
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);
      const isUserSignedUp = querySnapshot.docs.length > 0;
      localStorage.setItem("isSignedUp", JSON.stringify(isUserSignedUp));
      setIsSignedUp(isUserSignedUp);
     
      if(isUserSignedUp===false)
        nav("/Signup");
      else  
       nav("/"); 
    } catch (error) {
      console.error("Sign in error:", error);
    }
  };

  console.log("yesbpi")

  return (
    <ul className="my-2 flex flex-col mx-4 gap-5 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      {loading ?(   
          <ClipLoader color={"#123abc"} loading={loading} size={20} />
        ):(
        <>
    {user && isSignedUp===true&& (
      <>
        <Typography
          as="li"
          variant="small"
          color="blue-gray"
          className="flex items-center p-1 ml-4 font-medium nav-icon hover:text-blue-500 transition-colors border-b-2 lg:border-none"
        >
          <Tooltip placement="bottom" content="Forum">
            <Link to="/forum">
              <div className="flex">
              <IoPeopleOutline size={23} />
              <span className="lg:hidden ml-4">Forum</span>
              </div>
            </Link>
          </Tooltip>
         
        </Typography>
        <Typography
          as="li"
          variant="small"
          color="blue-gray"
          className="flex items-center p-1 ml-4 font-medium nav-icon hover:text-blue-500 transition-colors border-b-2 lg:border-none"
        >
          <Tooltip placement="bottom" content="Dashboard">
            <Link to="/dashboard">
              <div className="flex">
              <LuLayoutDashboard size={20} />
              <span className="lg:hidden ml-4">Dashboard</span>
              </div>
            </Link>
          </Tooltip>
          
        </Typography>
        <Typography
          as="li"
          variant="small"
          color="blue-gray"
          className="flex items-center p-1 ml-4 font-medium nav-icon hover:text-blue-500 transition-colors border-b-2 lg:border-none"
        >
          <Tooltip placement="bottom" content="User Profile">
            <Link to="/userprofile">
              <div className="flex">
              <HiOutlineUserCircle size={25} />
              <span className="lg:hidden ml-4">User Profile</span>
              </div>
            </Link>
          </Tooltip>
        
        </Typography>
        <Typography
          as="li"
          variant="small"
          color="blue-gray"
          className="flex items-center p-1 ml-4 font-medium nav-icon hover:text-blue-500 transition-colors border-b-2 lg:border-none"
        >
          <Tooltip placement="bottom" content="View Books">
            <Link to="/viewbooks">
              <div className="flex">
              <IoBookOutline size={25} />
              <span className="lg:hidden ml-4">View Books</span>
              </div>
            </Link>
          </Tooltip>
        
        </Typography>
        <Typography
          as="li"
          variant="small"
          color="blue-gray"
          className="flex items-center p-1 ml-4 font-medium nav-icon hover:text-blue-500 transition-colors border-b-2 lg:border-none"
        >
          
          
      <Tooltip placement="bottom" content="Inbox">
        <Link to="/inbox">
          <div className="flex">
       
            <IoNotificationsOutline size={25} />
            {notificationCount > 0 && 
        <span className="text-red-900 rounded">{notificationCount}</span>
      }
            <span className="lg:hidden ml-4 mb">Inbox</span>
          </div>
        </Link>
      </Tooltip>
     

         
        </Typography>
      </>
    )}
    </>
      )}
    <Typography
      as="li"
      variant="small"
      color="blue-gray"
      className="p-1 ml-4 font-medium"
    >
      {user === false ? (
        <Button onClick={login} className="flex font-myfont items-center">
          <SlLogin className="mr-1" /> 
        </Button>
      ) : (
        <Button onClick={logout} className="flex items-center">
          <SlLogout className="mr-1" /> 
        </Button>
      )}
    </Typography>
  
    
  </ul>
  
  
  );
}

export function NavbarSimple() {
  const [openNav, setOpenNav] = React.useState(false);
  const handleWindowResize = () =>
    window.innerWidth >= 960 && setOpenNav(false);

  React.useEffect(() => {
    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  return (
    <Navbar className="mx-auto max-w-screen-xl px-6 py-3">
      <div className="flex items-center justify-between text-blue-gray-900">
      <Link to="/" className="mr-4 ml-4 cursor-pointer py-1.5 text-2xl font-bold">
  <Typography variant="h2">BOOKWEB</Typography>
</Link>
        <div className="hidden lg:block">
          <NavList />
        </div>
        <IconButton
          variant="text"
          className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
          ripple={false}
          onClick={() => setOpenNav(!openNav)}
        >
          {openNav ? (
            <XMarkIcon className="h-6 w-6" strokeWidth={2} />
          ) : (
            <Bars3Icon className="h-6 w-6" strokeWidth={2} />
          )}
        </IconButton>
      </div>
      <Collapse open={openNav}>
        <NavList />
      </Collapse>
    </Navbar>
  );
}

export default NavbarSimple;