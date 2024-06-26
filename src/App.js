import React from 'react';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Protected } from './components/Protected';
import { NavbarSimple } from './components/Navb';
import Homepage from './pages/Homepage';
import Dashboard from './pages/Dashboard';
import SignUpForm from './pages/Signup';
import Viewbooks from './pages/Viewbooks';
import LearnMore from './pages/Learnmore';
import Postpage from './pages/Postpage';
import UserProfile from './pages/userprofile';
import NotificationListener from "./components/NotificationListener"; 
import Forum from './pages/Forum';
import Chat from './pages/Chat';

import { IsSignedUpProvider } from './context/Context';
import { Toaster } from 'sonner';
import { NotificationCountProvider } from './context/Context';
import './App.css';
import Inbox from './pages/inbox';


function App() {
  console.log('render');
  return (

    <IsSignedUpProvider>
        <NotificationCountProvider>
      <BrowserRouter>
        <div className="App">
        
            <NavbarSimple/>

   
          <Toaster
            richColors
            position="bottom-left"
            gap={20}
          />

          <Protected><NotificationListener /> </Protected>
          <Routes>
            <Route path="/" element={<Homepage/>}/>
            <Route path="/dashboard" element={<Protected><Dashboard/></Protected>}/>
            <Route path="/Signup" element={<Protected><SignUpForm/></Protected>} />
            <Route path="/viewbooks" element={<Protected><Viewbooks/></Protected>} />
            <Route path="/Forum" element={<Protected><Forum/></Protected>}/>
            <Route path="/userprofile" element={<Protected><UserProfile /></Protected>} />
            <Route path="/forum/:id" element={<Protected><Postpage/></Protected>}/>
            <Route path="/chat" element={<Protected><Chat/></Protected>}/>
            <Route path="/inbox" element={<Protected><Inbox/></Protected>}/>
            <Route path="/learn-more" element={<LearnMore/>}/>
          </Routes>
        </div>
      </BrowserRouter>
      </NotificationCountProvider>
    </IsSignedUpProvider>

  );
}

export default App;
