import React, { useState, useEffect } from 'react';
import UserLogin from './components/UserLogin';
import UserProfile from './components/UserProfile';

const App = () => {
  const [errorMessage, setErrorMessage] = useState('');  
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
        <UserProfile user={ user }/>
      </div>
    );
  };
  
  return (
    <div className="App">
      <div>{ errorMessage }</div>      
      <UserLogin user={ user }
                 setUser={ setUser }
                 setErrorMessage={ setErrorMessage } 
                 onLoggedIn={ onLoggedIn } />
    </div>
  );
};

export default App;