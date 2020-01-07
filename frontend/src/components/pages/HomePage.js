import React from 'react';
import { Tab, Grid, Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import HorizontalTabs from '../HorizontalTabs';
import TabPanel from '../TabPanel';

const HomePage = () => {
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
    
    const Tabs = a11yProps => {
        return (
            [
                <Tab key={0} label="Home" {...a11yProps(0)} />,                                
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
                                Welcome home!
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

export default HomePage;