import { useEffect, useState,useContext } from "react"
import { useNavigate } from "react-router-dom"
import { auth } from "../firebase/Firebase";
import { IsSignedUpContext } from "../context/Context";



export const Protected=({children})=>{

    const nav = useNavigate();
    const {isSignedUp, setIsSignedUp} = useContext(IsSignedUpContext);
    const [isLogged,setLogged] = useState(null);

    console.log(isSignedUp);
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
          if (user) {
            console.log(user);
            setLogged(true);
          } else {
            setLogged(false);
          }
        });
        return () => unsubscribe();
      }, []);
      

    useEffect(() => {
      if (isLogged && !isSignedUp) {
          nav("/Signup");
      }
  }, [isLogged, isSignedUp]);

  return isLogged && (isSignedUp || window.location.pathname.includes("/Signup")) ? children : null;

}