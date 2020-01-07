import React, { useEffect, useCallback } from 'react';
import { Tab, Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import HorizontalTabs from '../HorizontalTabs';
import TabPanel from '../TabPanel';

import account from '../../services/account';

import InfiniteScroll from "react-infinite-scroll-component";
import PaginatedTable from '../CustomPaginationActionsTable';

const UserAdmin = ({ allAccounts, setAllAccounts, setNotification, setIsError}) => {
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

    

    const getAllAccounts = useCallback(async () => {
        try {                                    
            const data = await account.getAllAccounts();            
            
            setAllAccounts(data);

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
                            <PaginatedTable rows={ allAccounts ? allAccounts : [] }/>
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