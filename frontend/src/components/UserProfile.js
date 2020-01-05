import React, { useState, useEffect } from 'react';
import { Container, CssBaseline, Typography, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import profile from '../services/getProfile';

const UserProfile = ({ setNotification, setIsError }) => {    
    const [profileData, setProfileData] = useState(null);

    const useStyles = makeStyles(theme => ({
        content: {
          marginTop: theme.spacing(8),
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }
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
                    
                    setProfileData(profileData);
                    return;             
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
    }, [setNotification, setIsError]);

    return (
        <Container component="main" maxWidth="xl">
        <CssBaseline />         
            <div className={classes.content}>
                <Typography variant="h6" gutterBottom>
                    <div>Username: { profileData && profileData.length > 0 ? profileData[0].username : '' }</div>
                    <div>Email: { profileData && profileData.length > 0 ? profileData[0].email : '' }</div>                    
                    <div>Account type: { profileData && profileData.length > 0 ? profileData[0].type : '' }</div>
                </Typography>
            </div>
        </Container>
    );
};

export default UserProfile;