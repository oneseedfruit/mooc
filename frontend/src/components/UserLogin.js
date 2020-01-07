import React, { useState } from 'react';
import { Link, Button, TextField, Grid, Container, CssBaseline } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import account from '../services/account';

const UserLogin = ({ user, setUser, setSessionId, onLoggedIn, setNotification, setIsError }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    
    const [reg, setReg] = useState(false);

    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newName, setNewName] = useState('');

    const useStyles = makeStyles(theme => ({
        paper: {
          marginTop: theme.spacing(8),
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        },
        form: {
          width: '100%', // Fix IE 11 issue.
          marginTop: theme.spacing(1),
        },
        submit: {
          margin: theme.spacing(3, 0, 2),
        },
      }));
    const classes = useStyles();

    const handleLogin = async event => {
        event.preventDefault();
        
        try { 
            const user = await account.login({
                username, password, isLogout: false
            });

            window.localStorage.setItem(
                'loggedUser', JSON.stringify(user)
            );
            
            setUser(user);
            setSessionId(user.sessionId);
            setUsername('');
            setPassword('');

            setNotification(`${ username } login successfully.`);
            setIsError(false);
            setTimeout(() => {
                setNotification(null);                
            }, 5000);
        } catch (exception) {           
            if (exception.response === undefined) 
                setNotification("Can't connect to backend! Server down?");
            else
                setNotification(exception.response.data);
            setIsError(true);
            setTimeout(() => {
                setNotification(null);
                setIsError(false);
            }, 5000);
        }
    };

    if ((user === null || user === '') && !reg)
        return (
            <Container component="main" maxWidth="xs">
            <CssBaseline /> 
                <div className={classes.paper}>
                    <form className={classes.form} onSubmit={ handleLogin }>
                        <Grid container>                            
                            <TextField  id="standard-basic" 
                                        label="username" 
                                        value={ username }
                                        name="username"
                                        onChange={({ target }) => setUsername(target.value)}
                                        margin="normal"
                                        required
                                        fullWidth
                                        autoComplete="username"
                                        autoFocus
                            />
                        
                            <TextField  id="standard-basic" 
                                        label="password"
                                        value={ password }
                                        name="password"
                                        onChange={({ target }) => setPassword(target.value)}
                                        margin="normal"
                                        type="password"
                                        required
                                        fullWidth
                                        autoComplete="password"
                            />                  
                        </Grid>                    
                        <Button variant="contained" color="primary" className={classes.submit} type="submit" fullWidth>login</Button>
                        <Link href="#" onClick={ () => setReg(true) }>
                            register new account
                        </Link>
                    </form>
                </div>
            </Container>
        );


    const handleRegister = async event => {
        event.preventDefault();

        if (!newEmail.includes("@") || !newEmail.includes(".")) {
            setNotification("Invalid email!");
            setIsError(true);
            setTimeout(() => {
                setNotification(null);
                setIsError(false);
            }, 5000);

            return;
        }

        if (newPassword.length < 8 || newPasswordConfirm < 8) {
            setNotification("Password length too short!");
            setIsError(true);
            setTimeout(() => {
                setNotification(null);      
                setIsError(false);          
            }, 5000);

            return;
        }

        if (newPassword !== newPasswordConfirm) {
            setNotification("Passwords don't match!");
            setIsError(true);
            setTimeout(() => {
                setNotification(null);        
                setIsError(false);        
            }, 5000);

            return;
        }

        try {             
            const regUser = await account.register({
                newUsername, newPassword, newEmail, newName
            });

            window.localStorage.setItem(
                'loggedUser', JSON.stringify(regUser)
            );
            
            setUser(regUser);
            setSessionId(regUser.sessionId);
            setUsername('');
            setPassword('');
            setReg(false);

            setNotification(`Registered successfully! Login in...`);
            setIsError(false);
            setTimeout(() => {
                setNotification(null);                
            }, 5000);
        } catch (exception) {
            if (exception.response === undefined)
                setNotification("Can't connect to backend! Server down?");
            else
                setNotification(exception.response.data);
            setIsError(true);
            setTimeout(() => {
                setNotification(null);
                setIsError(false);
            }, 5000);
        }
    };

    if (reg)
        return (
            <Container component="main" maxWidth="xs">
            <CssBaseline /> 
                <div className={classes.paper}>
                    <form className={classes.form} onSubmit={ handleRegister }>
                        <Grid container>            
                            <TextField  id="standard-basic" 
                                        label="name" 
                                        value={ newName }
                                        name="name"
                                        onChange={({ target }) => setNewName(target.value)}
                                        margin="normal"
                                        required
                                        fullWidth
                                        autoComplete="newName"
                                        autoFocus
                            />                
                            <TextField  id="standard-basic" 
                                        label="username" 
                                        value={ newUsername }
                                        name="newUsername"
                                        onChange={({ target }) => setNewUsername(target.value)}
                                        margin="normal"
                                        required
                                        fullWidth
                                        autoComplete="newUsername"
                                        autoFocus
                            />
                            <TextField  id="standard-basic" 
                                        label="email address" 
                                        value={ newEmail }
                                        name="newEmail"
                                        onChange={({ target }) => setNewEmail(target.value)}
                                        margin="normal"
                                        required
                                        fullWidth
                                        autoComplete="email"
                                        autoFocus
                            />
                            <TextField  id="standard-basic" 
                                        label="password"
                                        value={ newPassword }
                                        name="newPassword"
                                        onChange={({ target }) => setNewPassword(target.value)}
                                        margin="normal"
                                        type="password"
                                        required
                                        fullWidth
                                        autoComplete="password"
                            />
                            <TextField  id="standard-basic" 
                                        label="confirm password"
                                        value={ newPasswordConfirm }
                                        name="newPasswordConfirm"
                                        onChange={({ target }) => setNewPasswordConfirm(target.value)}
                                        margin="normal"
                                        type="password"
                                        required
                                        fullWidth
                                        autoComplete="password"
                            />
                        </Grid>                    
                        <Button variant="contained" color="primary" className={classes.submit} type="submit" fullWidth>register</Button>
                        <Link href="#" onClick={ () => setReg(false) }>
                            back to login
                        </Link>
                    </form>
                </div>
            </Container>
        );

    if (!reg) 
        return (   
            <>{ onLoggedIn }</>
        );    

    return null;
};

export default UserLogin;