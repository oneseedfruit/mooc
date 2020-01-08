import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Button, Container, Grid, TextField } from '@material-ui/core';
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';

const ExpansionPanel = withStyles({
  root: {        
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: 'auto',
    },
  },
  expanded: {},
})(MuiExpansionPanel);

const ExpansionPanelSummary = withStyles({
  root: {    
    minHeight: 56,
    '&$expanded': {
      minHeight: 56,
    },
  },
  content: {
    '&$expanded': {
      margin: '12px 0',
    },
  },
  expanded: {},
})(MuiExpansionPanelSummary);

const ExpansionPanelDetails = withStyles(theme => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiExpansionPanelDetails);

const CourseAdminForm = ({setNotification, setIsError}) => {
  
  const [courseCode, setCourseCode] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  const handleAddCourse = async event => {
    event.preventDefault();

    console.log(title);    
    
    try {             
        // const regUser = await account.register({
        //     newUsername, newPassword, newEmail, newName
        // });

        setNotification(`Course successfully added!`);
        setIsError(false);
        setTimeout(() => {
            setNotification(null);                
        }, 5000);        

        setCourseCode('');
        setTitle('');
        setDescription('');
    } catch (exception) {
        if (exception.response === undefined)
            setNotification("Can't connect to backend! Server down?");
        else
            setNotification(exception.response.data);
        setIsError(true);
        setTimeout(() => {
            setNotification(null);
            setIsError(false);
        }, 5000);
    }
  };

  const [expanded, setExpanded] = useState('');

  const handleChange = panel => (event, newExpanded) => {      
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <div>
      <ExpansionPanel square expanded={expanded === 'panel1'} onChange={ handleChange('panel1') }>
        <ExpansionPanelSummary aria-controls="panel1d-content" id="panel1d-header">          
            <Button variant="outlined" color="primary" fullWidth={ true } >
                { expanded === 'panel1' ? "Close" : "Add Course" }
            </Button>          
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
              <Container component="main" maxWidth="md">
                <form                     
                    onSubmit={ handleAddCourse }
                >
                    <Grid container>
                        <TextField  id="standard-basic" 
                                    label="course code" 
                                    value={ courseCode }
                                    name="course_code"
                                    onChange={({ target }) => setCourseCode(target.value)}
                                    margin="normal"                                    
                                    autoComplete="course_code"                                                    
                        />                    
                        <TextField  id="standard-basic" 
                                    label="title" 
                                    value={ title }
                                    name="title"
                                    onChange={({ target }) => setTitle(target.value)}
                                    margin="normal"
                                    required
                                    autoComplete="title"
                                    fullWidth                      
                        />
                    </Grid>
                    <Grid container>            
                        <TextField  id="standard-basic" 
                                    label="description" 
                                    value={ description }
                                    name="description"
                                    onChange={({ target }) => setDescription(target.value)}
                                    margin="normal"                                    
                                    autoComplete="description"
                                    multiline={ true }
                                    rows="5"
                                    fullWidth
                        />
                    </Grid>
                    <Button 
                        variant="contained" 
                        color="primary"                         
                        type="submit" 
                        // onClick={ handleChange('panel1') }
                        fullWidth
                    >
                        add
                    </Button>             
                </form>
            </Container>          
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
}

export default CourseAdminForm;