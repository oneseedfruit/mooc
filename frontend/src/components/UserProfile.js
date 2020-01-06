import React, { useEffect } from 'react';
import profile from '../services/getProfile';
import HorizontalTabs from './HorizontalTabs';
import Tab from '@material-ui/core/Tab';
import TabPanel from './TabPanel';

const UserProfile = ({ profileData, setProfileData, setNotification, setIsError }) => {    
    useEffect(() => {
        const getData = async () => {        
            try {             
                const loggedUser = JSON.parse(window.localStorage.getItem('loggedUser'));
                if (loggedUser && loggedUser.sessionId) {
                    const data = await profile.getProfile({
                        sessionId: loggedUser.sessionId
                    });                    

                    setProfileData(data);
                    return;
                }
            } catch (exception) {
                setNotification('Error acquiring user profile details.');
                setIsError(true);
                setTimeout(() => {
                    setNotification(null);
                    setIsError(false);
                }, 5000);
            }
        };
        getData();
    }, [setProfileData, setNotification, setIsError]);

    const Tabs = a11yProps => {
        return (
            [
                <Tab key={0} label="Me" {...a11yProps(0)} />,
                <Tab key={1} label="Item" {...a11yProps(1)} />,
                <Tab key={2} label="Item" {...a11yProps(1)} />,
                <Tab key={3} label="Item" {...a11yProps(1)} />,
                <Tab key={4} label="Item" {...a11yProps(1)} />
            ]
        );
    };

    const TabPanels = value => {        
        return (
            <>
                <TabPanel value={value} index={0}>                    
                    <div>Username: { profileData ? profileData.username : '' }</div>
                    <div>Email: { profileData ? profileData.email : '' }</div>
                    {/* <div>Account type: { profileData && profileData.length > 0 ? profileData[0].permissions : '' }</div> */}
                </TabPanel>
                <TabPanel value={value} index={1}>
                    Item Two
                </TabPanel>
            </>
        );
    };

    return (        
        <HorizontalTabs tabs={ Tabs } tabPanels={ TabPanels } />
    );
};

export default UserProfile;