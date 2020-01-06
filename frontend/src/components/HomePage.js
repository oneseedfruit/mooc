import React from 'react';
import VerticalTabs from './VerticalTabs';
import Tab from '@material-ui/core/Tab';
import TabPanel from './TabPanel';

const HomePage = () => {
    const Tabs = a11yProps => {
        return (
            [
                <Tab key={0} label="Item One" {...a11yProps(0)} />,
                <Tab key={1} label="Item Two" {...a11yProps(1)} />
            ]
        );
    };

    const TabPanels = value => {        
        return (
            <>
                <TabPanel value={value} index={0}>
                    Welcome home!
                </TabPanel>
                <TabPanel value={value} index={1}>
                    Item Two
                </TabPanel>
            </>
        );
    };

    return (
        <VerticalTabs tabs={ Tabs } tabPanels={ TabPanels } />
    );
};

export default HomePage;