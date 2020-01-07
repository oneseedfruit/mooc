import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';

const a11yProps = index => {
  return {
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`,
  };
};

const HorizontalTabs = ({ tabs, tabPanels }) => {
  const useStyles = makeStyles(theme => ({
    root: {
      flexGrow: 1,
      width: '100%',
      backgroundColor: theme.palette.background.paper,      
    },
    tabs: {
      justifyContent: 'center',
      alignItems: 'center',
    }
  }));
  const classes = useStyles();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Tabs
          orientation="horizontal"
          variant="scrollable"
          value={value}
          onChange={handleChange}        
          scrollButtons="on"
          className={classes.tabs}         
        >
          { tabs(a11yProps) }
        </Tabs>
      </AppBar>
      { tabPanels(value) }
    </div>
  );
};

export default HorizontalTabs;