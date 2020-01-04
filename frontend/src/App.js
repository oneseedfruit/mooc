import React, { useState, useEffect } from 'react';
import Notification from './components/Notification';
import UserLogin from './components/UserLogin';
import UserProfile from './components/UserProfile';

const App = () => {
  const [notification, setNotification] = useState(null);
  const [isError, setIsError] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
    }
  }, []);

  const onLoggedIn = user => {
    return (
      <div>        
        <UserProfile user={ user } 
                     setNotification={ setNotification }
                     setIsError={ setIsError } />
      </div>
    );
  };
  
  return (
    <div className="App">      
      <Notification message={ notification } isError={ isError } />
      <UserLogin user={ user }
                 setUser={ setUser }
                 setNotification={ setNotification } 
                 setIsError={ setIsError }
                 onLoggedIn={ onLoggedIn } />
    </div>
  );
};

export default App;