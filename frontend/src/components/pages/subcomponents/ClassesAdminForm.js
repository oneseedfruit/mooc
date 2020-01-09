import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Button, Container, Grid, TextField } from '@material-ui/core';
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';

import courses from '../../../services/courses';
import classSessions from '../../../services/classSessions';

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

const ClassesAdminForm = ({
      profileData, 
      getAllCourses, 
      setNotification, 
      setIsError,
        expanded,
      setExpanded,
        showForm,
      setShowForm,
        allCourses,
        course_id,
      setCourseId,
        user_id,
      setUserId,
        start_date,
      setStartDate,
        end_date,
      setEndDate,
        class_code,
      setClassCode,
        title,
      setTitle,
        description,
      setDescription
}) => {
  
  const handleAddClass = (
      course_id, user_id
  ) => async event => {
    event.preventDefault();    
    
    try {             
        const r = await classSessions.addClass({ 
            course_id, 
            user_id,
            start_date,
            end_date,
            class_code,
            title,
            description
        }).catch(console.log);
        // getAllCourses();

        if (r) {
          setNotification(r);
          setIsError(false);
          setTimeout(() => {
              setNotification(null);                
          }, 5000);
        }
        setExpanded('');
        setShowForm(false);
        setStartDate('');
        setEndDate('');
        setClassCode('');
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

  const getCourse = course_id => allCourses.find(course => course.course_id === course_id);
  const getCourseCode = course_id => {
    const c = getCourse(course_id).course_code;
    if (c !== "")
      return c;
    return "-";
  };
  const getCourseTitle = course_id => getCourse(course_id).title;  

  const handleChange = panel => (event, newExpanded) => {      
    setExpanded(newExpanded ? panel : false);
  };

  if (showForm)
    return (
      <div> 
        <ExpansionPanel defaultExpanded={true} square expanded={expanded === 'panel1'} onChange={ handleChange('panel1') }>
          <ExpansionPanelSummary aria-controls="panel1d-content" id="panel1d-header">          
              <Button onClick={ ({target}) => setShowForm(false) } variant="outlined" color={ expanded === 'panel1' ? "secondary" : "primary" } fullWidth={ true } >
                  { expanded === 'panel1' ? "Cancel" : "Add Class" }
              </Button>          
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
                <Container component="main" maxWidth="md">
                  <form                     
                      onSubmit={ handleAddClass(course_id, user_id) }
                  >
                      <Grid container>
                          <TextField  id="standard-basic" 
                                      label="course code" 
                                      value={ getCourseCode(course_id) }
                                      name="course code"
                                      disabled
                                      margin="normal"                                    
                                      autoComplete="course_code"                              
                          /> 
                          <TextField  id="standard-basic" 
                                      label="course title" 
                                      value={ getCourseTitle(course_id) }
                                      name="course title"
                                      disabled
                                      margin="normal"                                    
                                      autoComplete="course_title" 
                                      fullWidth                                         
                          />
                          <TextField  id="standard-basic" 
                                      label="class code" 
                                      value={ class_code }
                                      name="class code"
                                      onChange={({ target }) => setClassCode(target.value)}                                      
                                      margin="normal"                                    
                                      autoComplete="class_code"                              
                          /> 
                          <TextField  id="standard-basic" 
                                      label="class title" 
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
                          fullWidth
                      >
                          start a new class session
                      </Button>             
                  </form>
              </Container>          
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    );
  else  
    return(<></>);
}

export default ClassesAdminForm;