import React, { useState } from 'react';
import { Divider, Button, TextField, Grid, Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import HorizontalTabs from '../HorizontalTabs';
import Tab from '@material-ui/core/Tab';
import TabPanel from '../TabPanel';

import account from '../../services/account';

const UserProfile = ({ sessionId, profileData, permissions, getProfileData, setNotification, setIsError }) => {
    const [oldPassword, setOldPassword] = useState('');
    const [updatePassword, setUpdatePassword] = useState('');
    const [updatePasswordConfirm, setUpdatePasswordConfirm] = useState('');
    const [updateEmail, setUpdateEmail] = useState('');
    const [updateName, setUpdateName] = useState('');
    
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
                    <Container component="main" maxWidth="xs">
                        <Table size="small">
                            <TableBody>
                                <TableRow>
                                    <TableCell align="right">Username: </TableCell>
                                    <TableCell>
                                        { profileData ? profileData.username : '' }
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="right">Email: </TableCell>
                                    <TableCell>
                                        { profileData ? profileData.email : '' }
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>                   
                        
                        <Divider />

                        <Table size="small">
                            <TableBody>
                                <TableRow>
                                    <TableCell>Can manage users?:  </TableCell>
                                    <TableCell align="left">{(permissions ? permissions.canManageUsers ? "Yes": "No" : '')}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Can moderate users?:  </TableCell>
                                    <TableCell align="left">{(permissions ? permissions.canModerateUsers ? "Yes": "No" : '')}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Can manage courses?:  </TableCell>
                                    <TableCell align="left">{(permissions ? permissions.canManageCourses ? "Yes": "No" : '')}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Can manage own classes?:  </TableCell>
                                    <TableCell align="left">{(permissions ? permissions.canManageOwnClasses ? "Yes": "No" : '')}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Can manage all classes?:  </TableCell>
                                    <TableCell align="left">{(permissions ? permissions.canManageAllClasses ? "Yes": "No" : '')}</TableCell>
                                </TableRow>                                        
                            </TableBody>
                        </Table>
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