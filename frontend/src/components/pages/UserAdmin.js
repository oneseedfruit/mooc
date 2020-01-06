import React from 'react';
import HorizontalTabs from '../HorizontalTabs';
import Tab from '@material-ui/core/Tab';
import TabPanel from '../TabPanel';

const UserAdmin = () => {
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
                    Manage users here.
                </TabPanel>
            </>
        );
    };

    return (
        <HorizontalTabs tabs={ Tabs } tabPanels={ TabPanels } />
    );
};

export default UserAdmin;