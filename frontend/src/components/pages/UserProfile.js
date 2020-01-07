import React, { useEffect, useState, useCallback } from 'react';
import { Divider, Button, TextField, Grid, Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import HorizontalTabs from '../HorizontalTabs';
import Tab from '@material-ui/core/Tab';
import TabPanel from '../TabPanel';

import account from '../../services/account';

const UserProfile = ({ sessionId, profileData, setProfileData, setNotification, setIsError }) => {
    const [oldPassword, setOldPassword] = useState('');
    const [updatePassword, setUpdatePassword] = useState('');
    const [updatePasswordConfirm, setUpdatePasswordConfirm] = useState('');
    const [updateEmail, setUpdateEmail] = useState('');
    const [updateName, setUpdateName] = useState('');
    
    const getProfileData = useCallback(async () => {        
        try {                                
            const data1 = await account.getProfile({
                sessionId
            });

            const data2 = await account.getPermissions({
                sessionId
            });

            setProfileData({ ...data1, ...data2 });
            
            return;
        
        } catch (exception) {                
            setNotification('Error acquiring user profile details.');
            setIsError(true);
            setTimeout(() => {
                setNotification(null);
                setIsError(false);
            }, 5000);
        }
    }, [sessionId, setProfileData, setNotification, setIsError]);

    useEffect(() => {         
        getProfileData();    
    }, [getProfileData]);

    const useStyles = makeStyles(theme => ({
        paper: {        
          alignItems: 'left',
        },
        form: {
          width: '100%', // Fix IE 11 issue.        
        },
        submit: {
          margin: theme.spacing(3, 0, 2),
        },
      }));
    const classes = useStyles();

    const handleUpdateAccount = async event => {
        event.preventDefault();

        if (!updateEmail.includes("@") || !updateEmail.includes(".")) {
            setNotification("Invalid email!");
            setIsError(true);
            setTimeout(() => {
                setNotification(null);
                setIsError(false);
            }, 5000);

            return;
        }

        if (updatePassword.length > 0 && (updatePassword.length < 8 || updatePasswordConfirm < 8)) {
            setNotification("Password length too short!");
            setIsError(true);
            setTimeout(() => {
                setNotification(null);      
                setIsError(false);          
            }, 5000);

            return;
        }

        if (updatePassword !== updatePasswordConfirm) {
            setNotification("Passwords don't match!");
            setIsError(true);
            setTimeout(() => {
                setNotification(null);        
                setIsError(false);        
            }, 5000);

            return;
        }

        try {             
            await account.updateAccount({       
                name: updateName,         
                username: (profileData ? profileData.username : ''),
                newEmail: updateEmail,
                oldPassword,
                newPassword: updatePassword, 
                sessionId, 
            });

            getProfileData();
                        
            setNotification(`Account updated successfully!`);
            setIsError(false);
            setTimeout(() => {
                setNotification(null);                
            }, 5000);
        } catch (exception) {
            setNotification(exception.response.data);
            setIsError(true);
            setTimeout(() => {
                setNotification(null);
                setIsError(false);
            }, 5000);
        }
    };

    const Tabs = a11yProps => {
        return (
            [
                <Tab key={0} label={ profileData ? profileData.name : "My Profile" } {...a11yProps(0)} />,                            
                <Tab key={1} label="Edit Account" {...a11yProps(1)} onClick={ 
                    () => { 
                        if (profileData && updateName === '') 
                            setUpdateName(profileData.name);
                        if (profileData && updateEmail === '') 
                            setUpdateEmail(profileData.email);
                        setOldPassword('');
                        setUpdatePassword(''); 
                        setUpdatePasswordConfirm('');                        
                    } 
                }/>,
            ]
        );
    };

    const TabPanels = value => {        
        return (
            <>                
                <TabPanel value={value} index={0}>
                    <Container component="main" maxWidth="sm">                    

                        <Grid container>Username: { profileData ? profileData.username : '' }</Grid>
                        <Grid container>Email: { profileData ? profileData.email : '' }</Grid>
                        <Divider />
                            <div>Permissions:</div>
                            <div>
                                <ul>
                                    <li>Can manage users?:  {(profileData ? profileData.canManageUsers ? "Yes": "No" : '')}</li>
                                    <li>Can moderate users?: {(profileData ? profileData.canModerateUsers ? "Yes": "No" : '')}</li>
                                    <li>Can manage courses?: {(profileData ? profileData.canManageCourses ? "Yes": "No" : '')}</li>
                                    <li>Can manage own classes?: {(profileData ? profileData.canManageOwnClasses ? "Yes": "No" : '')}</li>
                                    <li>Can manage all classes?: {(profileData ? profileData.canManageAllClasses ? "Yes": "No" : '')}</li>
                                </ul>                   
                            </div>                        
                    </Container>
                </TabPanel>

                <TabPanel value={value} index={1}>
                    <Container component="main" maxWidth="sm">                    
                        <div className={classes.paper}>
                            <form className={classes.form} onSubmit={ handleUpdateAccount }>
                                <Grid container>
                                    <TextField  id="standard-basic" 
                                                label="name" 
                                                value={ updateName }
                                                name="newName"
                                                onChange={({ target }) => setUpdateName(target.value)}
                                                margin="normal"
                                                required
                                                fullWidth
                                                autoComplete="newName"
                                                autoFocus
                                    />
                                    <TextField  id="standard-basic" 
                                                label="username" 
                                                value={ profileData ? profileData.username : '' }
                                                name="newUsername"
                                                disabled
                                                margin="normal"
                                                required
                                                fullWidth
                                                autoComplete="newUsername"
                                                autoFocus
                                    />
                                    <TextField  id="standard-basic" 
                                                label="email address" 
                                                value={ updateEmail }
                                                name="newEmail"
                                                onChange={({ target }) => setUpdateEmail(target.value)}
                                                margin="normal"
                                                required
                                                fullWidth
                                                autoComplete="email"
                                                autoFocus
                                    />
                                    <TextField  id="standard-basic" 
                                                label="old password"
                                                value={ oldPassword }
                                                name="oldPassword"
                                                onChange={({ target }) => setOldPassword(target.value)}
                                                margin="normal"
                                                type="password"
                                                required
                                                fullWidth
                                                autoComplete="password"
                                    />
                                    <TextField  id="standard-basic" 
                                                label="new password"
                                                value={ updatePassword }
                                                name="newPassword"
                                                onChange={({ target }) => setUpdatePassword(target.value)}
                                                margin="normal"
                                                type="password"                                                
                                                fullWidth
                                                autoComplete="password"
                                    />
                                    <TextField  id="standard-basic" 
                                                label="confirm new password"
                                                value={ updatePasswordConfirm }
                                                name="newPasswordConfirm"
                                                onChange={({ target }) => setUpdatePasswordConfirm(target.value)}
                                                margin="normal"
                                                type="password"                                                
                                                fullWidth
                                                autoComplete="password"
                                    />
                                </Grid>                    
                                <Button variant="contained" color="primary" className={classes.submit} type="submit" fullWidth>SAVE</Button>                                
                            </form>
                        </div>
                    </Container>
                </TabPanel>
            </>
        );
    };

    return (        
        <HorizontalTabs tabs={ Tabs } tabPanels={ TabPanels } />
    );
};

export default UserProfile;