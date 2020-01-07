import React from 'react';
import { Tab, Grid, Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import HorizontalTabs from '../HorizontalTabs';
import TabPanel from '../TabPanel';

const UserAdmin = () => {
    const useStyles = makeStyles(theme => ({
        paper: {
          marginTop: theme.spacing(8),
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
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
                    <Container component="main" maxWidth="sm">                    
                        <div className={classes.paper}>                            
                                <Grid container>
                                    Manage users here.
                                </Grid>
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