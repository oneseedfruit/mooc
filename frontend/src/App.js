import React, { useState, useEffect } from 'react';
import Notification from './components/Notification';
import UserLogin from './components/UserLogin';
import MainLayout from './components/MainLayout';

const App = () => {
  const [notification, setNotification] = useState(null);
  const [isError, setIsError] = useState(false);

  const [user, setUser] = useState(null);   
  const [session_id, setSessionId] = useState(null);

  useEffect(() => {
    let unmounted = false;

    if (!unmounted) {
      const loggedUserJSON = window.localStorage.getItem('loggedUser');
      if (loggedUserJSON) {
        const user = JSON.parse(loggedUserJSON);
        setUser(user);      
        setSessionId(user.session_id);
      }
    }
    
    return () => { unmounted = true }
  }, []);
  
  return (
    <div className="App">      
      <Notification message={ notification } isError={ isError } />
      <UserLogin user={ user }
                 setUser={ setUser }
                 setSessionId={ setSessionId }
                 setNotification={ setNotification } 
                 setIsError={ setIsError }
                 onLoggedIn={ MainLayout({ session_id,
                                           setNotification, 
                                           setIsError, 
                                           setUser }) } />
    </div>
  );
};

export default App;