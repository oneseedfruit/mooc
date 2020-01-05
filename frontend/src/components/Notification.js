import React from 'react';
import { Snackbar, Fade } from '@material-ui/core';


const Notification = ({ message, isError }) => {
    if (message === null) {
        return null;
    }

    return (
        <Snackbar
            open={message !== null}
            onClose={() => true}
            TransitionComponent={ Fade }
            ContentProps={{
                'aria-describedby': 'message-id',
            }}
            message={<span id="message-id">{ message }</span>}            
        />
    );
};

export default Notification;