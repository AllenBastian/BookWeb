import React, { useState,useEffect} from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider,signOut } from "firebase/auth";
import { auth } from "../Firebase/Firebase";


import {
  Navbar,
  Collapse,
  Typography,
  IconButton,
  Button,
} from "@material-tailwind/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
 
function NavList() {

  const provider = new GoogleAuthProvider();
  const [user,setUser] = useState(false);


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log(user);
        setUser(true);
      } else {
        setUser(false);
      }
    });
    return () => unsubscribe();
  }, [auth]);

  const logout = ()=>{
    signOut(auth).then(() => {
      setUser(false)
      console.log("signed out")
    }).catch((error) => {
      
    });
    
  }
  const login=()=>{
   
        signInWithPopup(auth, provider)
        .then((result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            const email = error.customData.email;
            const credential = GoogleAuthProvider.credentialFromError(error);
        });

  
  }
  return (
    
    <ul className="my-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      {user&&(
        <>
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-medium"
      >
        <a href="/dashboard" className="flex items-center hover:text-blue-500 transition-colors ">
          DASHBOARD
        </a>
      </Typography>
      

    
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-medium"
      >
        <a href="#" className="flex items-center hover:text-blue-500 transition-colors">
          VIEW BOOKS
        </a>
      </Typography>
      </>
      )}
     
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-medium"
      >
         {user===false?(

        <Button onClick={()=>{login()}} className="flex font-myfont items-center hover:text-blue-500 transition-colors">

          Login
        </Button>
         ):(<Button onClick={()=>{logout()}} className="flex items-center  hover:text-blue-500 transition-colors">
         Logout
       </Button>)}
      </Typography>
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-medium"
      >
        <a href ="/signup" className="flex items-center hover:text-blue-500 transition-colors">
          Sign Up
        </a>
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
        <Typography
          as="a"
          href="http://localhost:3000/"
          className="mr-4  cursor-pointer py-1.5 text-2xl font-bold"
        >
         BOOKWEB
        </Typography>
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