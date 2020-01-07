import React, { useState, useEffect, useCallback } from 'react';
import { Grid, TextField, Tab, Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import HorizontalTabs from '../HorizontalTabs';
import TabPanel from '../TabPanel';
import PaginatedTable from '../CustomPaginationActionsTable';
import account from '../../services/account';

const UserAdmin = ({ allAccounts, setAllAccounts, getProfileData, setNotification, setIsError}) => {
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
        try {                                    
            const data = await account.getAllAccounts();            
            
            setAllAccounts(data);
            setSearch(data);

            return;                
        } catch (exception) {
            setNotification('Error acquiring user accounts.');
            setIsError(true);
            setTimeout(() => {
                setNotification(null);
                setIsError(false);
            }, 5000);
        }
    }, [setAllAccounts, setNotification, setIsError]);

    useEffect(() => {         
        getAllAccounts();    
    }, [getAllAccounts]);

    const handleSearch = event => {
        const s = event.target.value.toLowerCase();

        if (allAccounts) {
            const filteredSearch = allAccounts.filter(a => {
                const s1 = a.username.toLowerCase();
                const s2 = a.email.toLowerCase();
                const s3 = a.name.toLowerCase();

                return s1.includes(s) ||
                       s2.includes(s) ||
                       s3.includes(s) ||
                       s.includes(a.user_id);
            });
            setSearch(filteredSearch);
        }

        if (searchField === '') {
            setSearch(allAccounts);
        }

        setSearchField(s);
    };

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
                                <TextField  id="standard-basic" 
                                            label="search" 
                                            value={ searchField }
                                            name="name"
                                            onChange={ handleSearch }
                                            margin="normal"                                                                                                                        
                                            autoFocus
                                            fullWidth
                                />                                
                            </Grid>
                        
                            <PaginatedTable rows={ search ? search : [] } retrieve={ getAllAccounts } refresh={ getProfileData } />
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