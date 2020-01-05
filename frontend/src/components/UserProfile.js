import React, { useState, useEffect } from 'react';
import { Button, TextField, Grid, Container, CssBaseline } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import profile from '../services/getProfile';

const UserProfile = ({ user, setNotification, setIsError }) => {    
    const [profileData, setProfileData] = useState(null);

    const useStyles = makeStyles(theme => ({
        paper: {
          marginTop: theme.spacing(8),
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        },
        avatar: {
          margin: theme.spacing(1),
          backgroundColor: theme.palette.secondary.main,
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

    useEffect(() => {
        const getData = async () => {        
            try {             
                const loggedUser = JSON.parse(window.localStorage.getItem('loggedUser'));
                if (loggedUser && loggedUser.sessionId) {
                    const profileData = await profile.getProfile({
                        sessionId: loggedUser.sessionId
                    });
                    
                    setProfileData(profileData);                }
                else {
                    throw "";
                }
            } catch (exception) {
                setNotification('Error acquiring user profile details.');
                setIsError(true);
                setTimeout(() => {
                    setNotification(null);
                    setIsError(false);
                }, 5000);
            }
        };
        getData();
    }, [user, setNotification, setIsError]);

    return (
        <Container component="main" maxWidth="xs">
        <CssBaseline /> 
            <div className={classes.paper}>
                Welcome, { profileData != null ? profileData[0].username : '' }! 
                Email: { profileData != null ? profileData[0].email : '' } 
                Type: { profileData != null ? profileData[0].type : '' } 
            </div>
        </Container>
    );
};

export default UserProfile;