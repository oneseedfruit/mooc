import React, { useEffect } from 'react';
import HorizontalTabs from './HorizontalTabs';
import Tab from '@material-ui/core/Tab';
import TabPanel from './TabPanel';
import { Divider, List, ListItem, ListItemText } from '@material-ui/core';

import account from '../services/account';

const UserProfile = ({ sessionId, profileData, setProfileData, setNotification, setIsError }) => {    
    useEffect(() => {
        const getProfileData = async () => {        
            try {
                if (profileData !== null) {
                    setNotification('Retrieving user profile...');
                    setIsError(false);
                }

                const data1 = await account.getProfile({
                    sessionId
                });
                const data2 = await account.getPermissions({
                    sessionId
                });

                setProfileData({ ...data1, ...data2 });
                setNotification(null);
                
                return;
            
            } catch (exception) {
                setNotification('Error acquiring user profile details.');
                setIsError(true);
                setTimeout(() => {
                    setNotification(null);
                    setIsError(false);
                }, 5000);
            }
        };
        getProfileData();        
    }, [sessionId, setProfileData, setNotification, setIsError]);

    const Tabs = a11yProps => {
        return (
            [
                <Tab key={0} label="Me" {...a11yProps(0)} />,
                <Tab key={1} label="Item" {...a11yProps(1)} />,
                <Tab key={2} label="Item" {...a11yProps(2)} />,
                <Tab key={3} label="Item" {...a11yProps(3)} />,                
            ]
        );
    };

    const TabPanels = value => {        
        return (
            <>
                <TabPanel value={value} index={0}>                    
                    <div>Username: { profileData ? profileData.username : '' }</div>
                    <div>Email: { profileData ? profileData.email : '' }</div>
                    <Divider />
                    <div>Permissions:</div>
                    <div>
                        <List component="nav" aria-label="main mailbox folders">
                            <ListItem alignItems="flex-start">
                                <ListItemText primary={ "Admin: " + (profileData ? profileData.isAdmin ? "Yes": "No" : '')} />
                            </ListItem>
                        </List>
                    </div>
                    {/* <div>Account type: { profileData && profileData.length > 0 ? profileData[0].permissions : '' }</div> */}
                </TabPanel>
                <TabPanel value={value} index={1}>
                    Item
                </TabPanel>
                <TabPanel value={value} index={2}>
                    Meti
                </TabPanel>
                <TabPanel value={value} index={3}>
                    :D
                </TabPanel>
            </>
        );
    };

    return (        
        <HorizontalTabs tabs={ Tabs } tabPanels={ TabPanels } />
    );
};

export default UserProfile;