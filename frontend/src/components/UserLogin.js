import React, { useState } from 'react';
import { Button, TextField, Grid, Container, CssBaseline } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import loginService from '../services/login';

const UserLogin = ({ user, setUser, setSessionId, onLoggedIn, setNotification, setIsError }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

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
            const user = await loginService.login({
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
            setNotification('Wrong credentials. Login failed.');
            setIsError(true);
            setTimeout(() => {
                setNotification(null);
                setIsError(false);
            }, 5000);
        }
    };

    if (user === null || user === '')
        return (
            <Container component="main" maxWidth="xs">
            <CssBaseline /> 
                <div className={classes.paper}>
                    <form className={classes.form} onSubmit={ handleLogin }>
                        <Grid container>                            
                            <TextField id="standard-basic" 
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
                        
                            <TextField id="standard-basic" 
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
                    </form>
                </div>
            </Container>
        );

    return (   
        <>{ onLoggedIn }</>
    );
};

export default UserLogin;