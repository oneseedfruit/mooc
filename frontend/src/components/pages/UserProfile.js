import React, { useEffect } from 'react';
import HorizontalTabs from '../HorizontalTabs';
import Tab from '@material-ui/core/Tab';
import TabPanel from '../TabPanel';
import { Divider } from '@material-ui/core';

import account from '../../services/account';

const UserProfile = ({ sessionId, profileData, setProfileData, setNotification, setIsError }) => {    
    useEffect(() => {
        const getProfileData = async () => {        
            try {                                
                const data1 = await account.getProfile({
                    sessionId
                });

                const data2 = await account.getPermissions({
                    sessionId
                });

                setProfileData({ ...data1, ...data2 });
                
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
    }, [sessionId, profileData, setProfileData, setNotification, setIsError]);

    const Tabs = a11yProps => {
        return (
            [
                <Tab key={0} label="My Profile" {...a11yProps(0)} />,                            
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
                        <ul>
                            <li>Can manage users?:  {(profileData ? profileData.canManageUsers ? "Yes": "No" : '')}</li>
                            <li>Can moderate users?: {(profileData ? profileData.canModerateUsers ? "Yes": "No" : '')}</li>
                            <li>Can manage courses?: {(profileData ? profileData.canManageCourses ? "Yes": "No" : '')}</li>
                            <li>Can manage own classes?: {(profileData ? profileData.canManageOwnClasses ? "Yes": "No" : '')}</li>
                            <li>Can manage all classes?: {(profileData ? profileData.canManageAllClasses ? "Yes": "No" : '')}</li>
                        </ul>                   
                    </div>
                </TabPanel>
            </>
        );
    };

    return (        
        <HorizontalTabs tabs={ Tabs } tabPanels={ TabPanels } />
    );
};

export default UserProfile;