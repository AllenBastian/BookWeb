
import  { createContext, useState } from 'react';
export const IsSignedUpContext = createContext();
export const NotificationCountContext = createContext();


export const IsSignedUpProvider = ({ children }) => {

  const [isSignedUp, setIsSignedUp] = useState(false);
 
  console.log(isSignedUp);

  return (
    <IsSignedUpContext.Provider value={{ isSignedUp, setIsSignedUp }}>
      {children}
    </IsSignedUpContext.Provider>
  );
};

export const NotificationCountProvider = ({ children }) => {  
  const [notificationCount,setNotificationCount] = useState(0);
  return (
    <NotificationCountContext.Provider value={{ notificationCount,setNotificationCount }}>
      {children}
    </NotificationCountContext.Provider>
  );
}
