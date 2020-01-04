import React, { useState, useEffect } from 'react';
import profile from '../services/getProfile';

const UserProfile = ({ user }) => {    
    const [profileData, setProfileData] = useState(null);

    useEffect(() => {
        const getData = async () => {        
            try {             
                const profileData = await profile.getProfile({
                    sessionId: user.sessionId
                });
                
                setProfileData(profileData);
            } catch (exception) {
                // setErrorMessage('Wrong credentials');
                setTimeout(() => {
                    // setErrorMessage(null);
                }, 5000);
            }
        };
        getData();
    }, [user.sessionId]);

    return (
        <div>
            Welcome, { profileData != null ? profileData[0].username : '' }! 
            Email: { profileData != null ? profileData[0].email : '' } 
            Type: { profileData != null ? profileData[0].type : '' } 
        </div>
    );
};

export default UserProfile;