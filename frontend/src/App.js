import React, { useState, useEffect } from 'react';
import Notification from './components/Notification';
import UserLogin from './components/UserLogin';
import UserProfile from './components/UserProfile';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ExitIcon from '@material-ui/icons/ExitToAppRounded';
import ProfileIcon from '@material-ui/icons/AccountCircleSharp';
import loginService from './services/login';

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

  const handleLogout = async event => { 
      event.preventDefault();        
      try { 
          const loggedUser = JSON.parse(window.localStorage.getItem('loggedUser'));

          await loginService.login({
              isLogout: true, sessionId: loggedUser.sessionId
          });            

          window.localStorage.removeItem('loggedUser');
          window.localStorage.clear();
          setUser(null);
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

  const showMainLayout = user => {
    return (
      <div className="App">        
        <CssBaseline />
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
            <ListItem button key="My Profile">
              <ListItemIcon><ProfileIcon /></ListItemIcon>
              <ListItemText primary="My Profile" />
            </ListItem>            
            <ListItem button key="Logout" onClick={ handleLogout } >
                <ListItemIcon><ExitIcon /></ListItemIcon>
                <ListItemText primary="Logout" />
            </ListItem>            
          </List>
        </Drawer>
        <main className={classes.content}>
          <div className={classes.toolbar} />
            <UserProfile setNotification={ setNotification }
                        setIsError={ setIsError } />
        </main>
      </div>
    );
  };
  
  const drawerWidth = 240;

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
      flexGrow: 1,
      padding: theme.spacing(3),
    },
  })); 

  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div className="App">
      <main className={classes.content}>
        <div className={classes.toolbar} />
          <Notification message={ notification } isError={ isError } />
          <UserLogin user={ user }
                    setUser={ setUser }
                    setNotification={ setNotification } 
                    setIsError={ setIsError }
                    onLoggedIn={ showMainLayout } />
        
      </main>
    </div>
  );
};

export default App;