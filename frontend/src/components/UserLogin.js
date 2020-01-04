import React, { useState } from 'react';
import loginService from '../services/login';

const UserLogin = ({ user, setUser, onLoggedIn, setErrorMessage }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');    

    const handleLogin = async event => {
        event.preventDefault();
        try { 
            const user = await loginService.login({
                username, password, isLogout: false
            });

            window.localStorage.setItem(
                'loggedUser', JSON.stringify(user)
            );

            setUser(user);
            setUsername('');
            setPassword('');
        } catch (exception) {
            setErrorMessage('Wrong credentials');
            setTimeout(() => {
                setErrorMessage(null);
            }, 5000);
        }
    };

    const handleLogout = async event => { 
        event.preventDefault();        
        try { 
            await loginService.login({
                isLogout: true, sessionId: user.sessionId
            });

            window.localStorage.removeItem('loggedUser');
            window.localStorage.clear();
            setUser(null);
        } catch (exception) {
            setErrorMessage('Can\'t logout');
            setTimeout(() => {
                setErrorMessage(null);
            }, 5000);
        }
    };

    if (user === null || user === '')
        return (
            <div>
                <form onSubmit={ handleLogin }>
                    <div>
                        username <input type="text"
                                        value={ username }
                                        name="username"
                                        onChange={({ target }) => setUsername(target.value)} />
                    </div>
                    <div>
                        password <input type="password"
                                        value={ password }
                                        name="password"
                                        onChange={({ target }) => setPassword(target.value)} />
                    </div>
                    <button type="submit">login</button>
                </form>
            </div>
        );

    return (        
        <><button onClick={ handleLogout }>logout</button>{ onLoggedIn(user) }</>
    );
};

export default UserLogin;