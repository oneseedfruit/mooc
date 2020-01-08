import React, { useState, useEffect, useCallback } from 'react';
import { Grid, Tab, Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Checkbox from '@material-ui/core/Checkbox';
import HorizontalTabs from '../HorizontalTabs';
import TabPanel from '../TabPanel';
import PaginatedTable from '../CustomPaginationActionsTable';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Search from '../../components/SimpleSearchInArrayOfObjects';
import account from '../../services/account';

const UserAdmin = ({ allAccounts, setAllAccounts, permissions, getProfileData, setNotification, setIsError}) => {
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

    const [searchField, setSearchField] = useState('');
    const [search, setSearch] = useState(null);

    const getAllAccounts = useCallback(async () => {
        setNotification("Retrieving user accounts...");
        setIsError(false);
        setTimeout(() => {
            setNotification(null);
            setIsError(false);
        }, 5000);

        try {                                    
            const data = await account.getAllAccounts().catch(console.log);            
            
            setNotification(null);
            setAllAccounts(data);
            setSearch(data);
            
        } catch (exception) {
            setNotification('Error acquiring user accounts.');
            setIsError(true);
            setTimeout(() => {
                setNotification(null);
                setIsError(false);
            }, 5000);
        }
    }, [setSearch, setAllAccounts, setNotification, setIsError]);

    useEffect(() => {       
        let unmounted = false;
        if (!unmounted)  
            getAllAccounts();
        return () => { unmounted = true }
    }, [getAllAccounts]);

    const handleDelete = (user_id, session_id) => async event => {        
        try {
            const r = await account.deleteAccount({ user_id, session_id }).catch(console.log);
            getAllAccounts();
            getProfileData();

            if (r) {
                setNotification(r);
                setIsError(true);
                setTimeout(() => {
                    setNotification(null);
                    setIsError(false);
                }, 5000);
            }
        }
        catch (exception) {
            if (exception.response !== undefined)
                setNotification(exception.response.data);
            setIsError(true);
            setTimeout(() => {
                setNotification(null);
                setIsError(false);
            }, 5000);
        }
    };

    const handleCheck = ({ user_id, perm, isChecked }) => async event => {    
        isChecked = isChecked <= 0 ? 1 : 0;
    
        try {                                    
            const r = await account.getPermissions({ user_id, perm, isChecked }).catch(console.log);
            getAllAccounts();
            getProfileData();

            if (r) {
                setNotification(r);
                setIsError(true);
                setTimeout(() => {
                    setNotification(null);
                    setIsError(false);
                }, 5000);
            }
        } 
        catch (exception) {       
            if (exception.response !== undefined)
                setNotification(exception.response.data);
            setIsError(true);
            setTimeout(() => {
                setNotification(null);
                setIsError(false);
            }, 5000);        
        }
    };    

    const checkbox = (isChecked, user_id, perm) => {
        return (
            <Checkbox checked={ isChecked > 0 ? true : false } onChange={ handleCheck({ user_id, perm, isChecked })} value={ perm } />
        );
    };

    const columns = [        
        { id: 'name', label: 'name', minWidth: 10 },
        { id: 'username', label: 'username', minWidth: 10 },
        { id: 'email', label: 'email', minWidth: 10 },
        { id: 'can_manage_users', label: 'manage users', minWidth: 10 },
        { id: 'can_moderate_users', label: 'moderate users', minWidth: 10 },
        { id: 'can_manage_own_courses', label: 'manage own courses', minWidth: 10 },
        { id: 'can_manage_all_courses', label: 'manage all courses', minWidth: 10 },
        { id: 'can_manage_own_classes', label: 'manage own classes', minWidth: 10 },
        { id: 'can_manage_all_classes', label: 'manage all classes', minWidth: 10 },
        { id: 'delete account', label: 'delete account', minWidth: 10 },
    ];

    const customTable = row => 
        <TableRow key={row.user_id}>            
            <TableCell>{row.name}</TableCell>
            <TableCell>{row.username}</TableCell>
            <TableCell>{row.email}</TableCell>
            <TableCell>{checkbox(row.can_manage_users, row.user_id, "can_manage_users")}</TableCell>
            <TableCell>{checkbox(row.can_moderate_users, row.user_id, "can_moderate_users")}</TableCell>
            <TableCell>{checkbox(row.can_manage_own_courses, row.user_id, "can_manage_own_courses")}</TableCell>
            <TableCell>{checkbox(row.can_manage_all_courses, row.user_id, "can_manage_all_courses")}</TableCell>
            <TableCell>{checkbox(row.can_manage_own_classes, row.user_id, "can_manage_own_classes")}</TableCell>
            <TableCell>{checkbox(row.can_manage_all_classes, row.user_id, "can_manage_all_classes")}</TableCell>
            <TableCell><IconButton aria-label="delete" onClick={ handleDelete(row.user_id, 
                JSON.parse(window.localStorage.getItem('loggedUser')).session_id) }><DeleteIcon /></IconButton></TableCell>
        </TableRow>;

    const Tabs = a11yProps => {
        return (
            [
                <Tab key={0} label="User Admin" {...a11yProps(0)} />,                
            ]
        );
    };

    const TabPanels = value => {        
        return (
            <>
                <TabPanel value={value} index={0}>
                    <Container component="main" maxWidth="xl">
                        <div className={classes.paper}>                        
                            <Grid container>
                                <Search arrayOfObjects={ allAccounts }
                                        searchField={ searchField }
                                        setSearchField={ setSearchField }
                                        setSearch={ setSearch } />
                            </Grid>                        
                            <PaginatedTable rows={ search ? search : [] } 
                                            columns={ columns } 
                                            size="small"
                                            customTable = { customTable } />
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

export default UserAdmin;