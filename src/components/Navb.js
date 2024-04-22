import React, { useState, useEffect, useContext,useMemo } from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { auth } from "../Firebase/Firebase";
import { useNavigate } from "react-router-dom";
import { IsSignedUpContext } from "../context/Context";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../Firebase/Firebase";
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

function NavList() {
  const { isSignedUp, setIsSignedUp } = useContext(IsSignedUpContext);
  const nav = useNavigate();
  const provider = new GoogleAuthProvider();
  const [user, setUser] = useState(false);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(true);
        const email = user.email;
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('email', '==', email));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.docs.length > 0) {
          setIsSignedUp(true);
        } else {
          setIsSignedUp(false);
        }
      } else {
        setUser(false);
        setIsSignedUp(false);
      }
      setLoading(false); 
    });
    return () => unsubscribe();
  }, [auth]);

  const logout = () => {
    signOut(auth).then(() => {
      setUser(false);
      nav("/");
    }).catch((error) => {
      console.error("Sign out error:", error);
    });
  };

  const login = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
      }).catch((error) => {
        console.error("Sign in error:", error);
      });
  };

  if (loading)
    return <div></div>

  return (
    <ul className="my-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      {user && (
        <>
         <Typography
            as="li"
            variant="small"
            color="blue-gray"
            className="p-1 font-medium"
          >
            <a href="/forum" className="flex items-center hover:text-blue-500 transition-colors ">
              COMMUNITY
            </a>
          </Typography>
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
            <a href="/userprofile" className="flex items-center hover:text-blue-500 transition-colors ">
              PROFILE
            </a>
            </Typography>

          <Typography
            as="li"
            variant="small"
            color="blue-gray"
            className="p-1 font-medium"
          >
            <a href="/viewbooks" className="flex items-center hover:text-blue-500 transition-colors">
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
        {user === false ? (
          <Button onClick={login} className="flex font-myfont items-center hover:text-blue-500 transition-colors">
            Login
          </Button>
        ) : (
          <Button onClick={logout} className="flex items-center  hover:text-blue-500 transition-colors">
            Logout
          </Button>
        )}
      </Typography>

      {isSignedUp === false && user === true && (
        <Typography
          as="li"
          variant="small"
          color="blue-gray"
          className="p-1 font-medium"
        >
          <a href="/signup" className="flex items-center hover:text-blue-500 transition-colors">
            Sign Up
          </a>
        </Typography>
      )}
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
            href="/"
            className="mr-4 cursor-pointer py-1.5 text-3xl font-bold" // Increase text size to text-3xl
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
