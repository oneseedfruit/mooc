import React from 'react';
import { Container, CssBaseline, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const HomePage = () => {
    const useStyles = makeStyles(theme => ({
        content: {
          marginTop: theme.spacing(8),
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }
      }));
    const classes = useStyles();

    return (
        <Container component="main" maxWidth="xl">
        <CssBaseline /> 
            <div className={classes.content}>
                <Typography variant="h6" gutterBottom>
                    Welcome home! Welcome home! Welcome home! Welcome home! Welcome home! Welcome home! Welcome home! Welcome home! Welcome home! Welcome home! Welcome home! Welcome home! Welcome home! Welcome home! Welcome home! Welcome home! Welcome home! Welcome home! Welcome home! Welcome home! Welcome home! Welcome home! Welcome home! Welcome home! Welcome home! Welcome home! Welcome home! 
                </Typography>
            </div>
        </Container>
    );
};

export default HomePage;