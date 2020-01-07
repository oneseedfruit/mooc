import React, { useState, useEffect, useCallback } from 'react';
import { Grid, Tab, Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import HorizontalTabs from '../HorizontalTabs';
import TabPanel from '../TabPanel';
import PaginatedTable from '../CustomPaginationActionsTable';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Search from '../../components/SimpleSearchInArrayOfObjects';
import account from '../../services/account';

const CourseAdmin = ({ allAccounts, setAllAccounts, getProfileData, setNotification, setIsError}) => {
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

    // const getAllAccounts = useCallback(async () => {
    //     try {                                    
    //         const data = await account.getAllAccounts();            
            
    //         setAllAccounts(data);
    //         setSearch(data);

    //         return;                
    //     } catch (exception) {
    //         setNotification('Error acquiring user accounts.');
    //         setIsError(true);
    //         setTimeout(() => {
    //             setNotification(null);
    //             setIsError(false);
    //         }, 5000);
    //     }
    // }, [setAllAccounts, setNotification, setIsError]);

    // useEffect(() => {         
    //     getAllAccounts();    
    // }, [getAllAccounts]);

    const columns = [
        { id: '#', label: '#', minWidth: 10 },    
        { id: 'course_code', label: 'course code', minWidth: 10 },
        { id: 'title', label: 'title', minWidth: 10 },
        { id: 'description', label: 'description', minWidth: 10 },
        { id: 'added_by', label: 'added by', minWidth: 10 }        
    ];

    const handleCheck = ({ user_id, perm, isChecked }) => async event => {    
        isChecked = isChecked <= 0 ? 1 : 0;
    
        try {                                    
            await account.getPermissions({ user_id, perm, isChecked });            
        } catch (exception) {        
        }
    };

    const checkbox = (isChecked, user_id, perm) => {
        return (
            <Checkbox checked={ isChecked > 0 ? true : false } onChange={ handleCheck({ user_id, perm, isChecked })} value={ perm } />
        );
    };

    const customTable = row => 
        <TableRow key={ row.user_id }>
            <TableCell>{row.user_id}</TableCell>
            <TableCell>{row.name}</TableCell>
            <TableCell>{row.username}</TableCell>
            <TableCell>{row.email}</TableCell>            
        </TableRow>;

    const Tabs = a11yProps => {
        return (
            [
                <Tab key={0} label="Course Admin" {...a11yProps(0)} />,                
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

export default CourseAdmin;