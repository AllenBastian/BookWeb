import { Protected } from "./components/Protected";
import { NavbarSimple } from "./components/Navb";
import Homepage from "./pages/Homepage";
import Dashboard from "./pages/Dashboard";
import SignUpForm from "./pages/Signup";
import { BrowserRouter,Route,Routes } from "react-router-dom";
import { IsSignedUpProvider } from "./context/Context";
import "./App.css"

function App() {
  return (
    <BrowserRouter>
    <IsSignedUpProvider>
        <div className="App">
          <NavbarSimple/>
        <Routes>
          <Route path="/" element={<Homepage/>}/>
          <Route path="/dashboard" element={<Protected><Dashboard/></Protected>}/>
          <Route path="/Signup" element={<SignUpForm/>} />
        </Routes>
        </div>
        </IsSignedUpProvider>
    </BrowserRouter>
  );
}

export default App;
