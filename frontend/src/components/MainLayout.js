import React, { useState, useEffect } from 'react';

import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import HomeIcon from '@material-ui/icons/Home';
import ProfileIcon from '@material-ui/icons/AccountCircle';
import ClassesIcon from '@material-ui/icons/School';
import UserAdminIcon from '@material-ui/icons/SupervisorAccount';
import CourseAdminIcon from '@material-ui/icons/LibraryBooks';
import ExitIcon from '@material-ui/icons/ExitToAppRounded';

import loginService from '../services/login';
import account from '../services/account';

import HomePage from './HomePage';
import UserProfile from './UserProfile';

const MainLayout = ({ sessionId, setNotification, setIsError, setUser }) => {
    const drawerWidth = 200;

    const useStyles = makeStyles(theme => ({
        root: {
            display: 'flex',
        },
        appBar: {
            zIndex: theme.zIndex.drawer + 1,
            transition: theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
        }),
        },
        appBarShift: {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
            transition: theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
        }),
        },
        menuButton: {
            marginRight: 36,
        },
        hide: {
            display: 'none',
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
            whiteSpace: 'nowrap',
        },
        drawerOpen: {
            width: drawerWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
        }),
        },
        drawerClose: {
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
            width: theme.spacing(7) + 1,
            [theme.breakpoints.up('sm')]: {
                width: theme.spacing(9) + 1,
            },
        },
        toolbar: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: theme.spacing(0, 1),
            ...theme.mixins.toolbar,
        },
        content: {                        
            paddingTop: theme.spacing(7),
            paddingLeft: theme.spacing(7)
        },
    })); 

    const classes = useStyles();
    const theme = useTheme();

    const [open, setOpen] = useState(false);
    const [pageIndex, setPageIndex] = useState(0);
    
    const [permissions, setPermissions] = useState(null);
    const [profileData, setProfileData] = useState(null);
    
    useEffect(() => {
        const getProfileData = async () => {        
            try {                                    
                const data = await account.getPermissions({
                    sessionId
                });
                
                setPermissions(data);

                return;                
            } catch (exception) {
                setNotification('Error acquiring user permissions.');
                setIsError(true);
                setTimeout(() => {
                    setNotification(null);
                    setIsError(false);
                }, 5000);
            }
        };
        getProfileData();        
    }, [sessionId, setNotification, setIsError]);

    const pages = [
        {
            show: 
                <HomePage />
        },
        {             
            show:
                <UserProfile sessionId={ sessionId }
                             profileData={ profileData }
                             setProfileData={ setProfileData }
                             setNotification={ setNotification }
                             setIsError={ setIsError } />
        }
    ];

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleGoToPage = page => () => {
        setPageIndex(page);
        setOpen(false);
    };

    const handleLogout = async event => { 
        event.preventDefault();        
        try { 
            const loggedUser = JSON.parse(window.localStorage.getItem('loggedUser'));  
            await loginService.login({
                isLogout: true, sessionId
            });
  
            window.localStorage.removeItem('loggedUser');
            window.localStorage.clear();
            setUser(null);
            setOpen(false);
            setPageIndex(0);
            setNotification(`${ loggedUser ? loggedUser.username : 'User' } logout successfully.`);
            setIsError(true);
            setTimeout(() => {
                setNotification(null);
                setIsError(false);
            }, 5000);
        } catch (exception) {
            setNotification('Logout failed.');
            setIsError(true);
            setTimeout(() => {
                setNotification(null);
                setIsError(false);
            }, 5000);
        }
    };  

    return (
        <div className="App">            
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}
            >
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={handleDrawerOpen}
                    edge="start"
                    className={clsx(classes.menuButton, {
                        [classes.hide]: open,
                    })}
                >
                <MenuIcon />
                </IconButton>
                <Typography variant="h6" noWrap>
                    
                </Typography>
            </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                className={clsx(classes.drawer, {
                    [classes.drawerOpen]: open,
                    [classes.drawerClose]: !open,
                })}
                classes={{
                    paper: clsx({
                    [classes.drawerOpen]: open,
                    [classes.drawerClose]: !open,
                    }),
                }}
            >
                <div className={classes.toolbar}>                
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </div>
                <Divider />
                <List>
                    <ListItem button key="Home" onClick={ handleGoToPage(0) }>
                        <ListItemIcon><HomeIcon /></ListItemIcon>
                        <ListItemText primary="Home" />
                    </ListItem>            
                    <ListItem button key="My Profile" onClick={ handleGoToPage(1) }>
                        <ListItemIcon><ProfileIcon /></ListItemIcon>
                        <ListItemText primary="My Profile" />
                    </ListItem>
                    <ListItem button key="My Classes" >
                        <ListItemIcon><ClassesIcon /></ListItemIcon>
                        <ListItemText primary="My Classes" />
                    </ListItem>

                    { permissions !== null ? permissions.canManageUsers ?
                        <>
                            <ListItem button key="User Admin" >
                                <ListItemIcon><UserAdminIcon /></ListItemIcon>
                                <ListItemText primary="User Admin" />
                            </ListItem>
                            <ListItem button key="Course Admin" >
                                <ListItemIcon><CourseAdminIcon /></ListItemIcon>
                                <ListItemText primary="Course Admin" />
                            </ListItem> 
                        </>
                        : '' : ''
                    }

                    <ListItem button key="Logout" onClick={ handleLogout } >
                        <ListItemIcon><ExitIcon /></ListItemIcon>
                        <ListItemText primary="Logout" />
                    </ListItem>
                </List>
            </Drawer>
            <main className={classes.content}>
                { pages[pageIndex].show }
            </main>
        </div>
    );
};

export default MainLayout;