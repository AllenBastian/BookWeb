import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { auth } from "../firebase/Firebase";



export const Protected=({children})=>{

    const nav = useNavigate();
    const [isLogged,setLogged] = useState(null);

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
      
    switch(isLogged){
        case true:
            return children
        case false:
             nav("/");
        case null:
            return ( <div className="flex justify-center items-center h-screen">
            <h1>Loading</h1>
          </div>)
                
    }

}