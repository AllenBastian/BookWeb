import { auth } from "../firebase/firebase";

const Dashboard=()=>{

    const user = auth.currentUser;
    if (user) {
       console.log(user.email+ "is signed in")
      } else {
        
      }
      
    return(
        <div className="flex justify-center items-center h-screen">
        <h1>This is the dashboard.You are logged in as {user?.displayName}</h1>
      </div>
    )
}

export default Dashboard;