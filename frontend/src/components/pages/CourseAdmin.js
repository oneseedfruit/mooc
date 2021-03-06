import React, { useState, useEffect, useCallback } from 'react';
import { Grid, Tab, Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Checkbox from '@material-ui/core/Checkbox';
import HorizontalTabs from '../HorizontalTabs';
import TabPanel from '../TabPanel';
import PaginatedTable from '../CustomPaginationActionsTable';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Search from '../../components/SimpleSearchInArrayOfObjects';
import courses from '../../services/courses';
import CourseAdminForm from './subcomponents/CourseAdminForm';

const CourseAdmin = ({ allCourses, setAllCourses, profileData, getProfileData, setNotification, setIsError}) => {
    const useStyles = makeStyles(theme => ({
        paper: {        
            alignItems: 'left',
          },
          form: {
            width: '100%', // Fix IE 11 issue.        
          },
          submit: {
            margin: theme.spacing(3, 0, 2),
        },
      }));
    const classes = useStyles();

    const [searchField, setSearchField] = useState('');
    const [search, setSearch] = useState(null);  
    const [expanded, setExpanded] = useState('');

    const getAllCourses = useCallback(async () => {
        setNotification('Retrieving courses...');
        setIsError(false);
        setTimeout(() => {
            setNotification(null);
            setIsError(false);
        }, 5000);

        try {
            const data = await courses.getAllCourses({ user_id: profileData.user_id }).catch(console.log);    
            
            setNotification(null);
            setAllCourses(data);
            getProfileData();
            setSearch(data);

            return;                
        } catch (exception) {
            setNotification('Error acquiring courses!');
            setIsError(true);
            setTimeout(() => {
                setNotification(null);
                setIsError(false);
            }, 5000);
        }
    }, [setAllCourses, getProfileData, setNotification, setIsError]);

    useEffect(() => {
        let unmounted = false;
        if (!unmounted)
            getAllCourses();
        return () => { unmounted = true }
    }, [getAllCourses]);

    const handleDelete = (course_id, user_id) => async event => {        
        try {
            const r = await courses.deleteCourse({ course_id, user_id }).catch(console.log);
            getAllCourses();

            if (r) {
                setNotification(r);
                setIsError(true);
                setTimeout(() => {
                    setNotification(null);
                    setIsError(false);
                }, 5000);
            }
        }
        catch (exception) {
            setNotification('Can\'t delete!');
            setIsError(true);
            setTimeout(() => {
                setNotification(null);
                setIsError(false);
            }, 5000);
        }
    };

    const handleCheck = (isChecked, course_id, user_id) => async event => {    
        isChecked = isChecked <= 0 ? 1 : 0;
    
        try {                                    
            const r = await courses.updateCourse({ isChecked, course_id, user_id }).catch(console.log);
            getAllCourses();
            
            if (r) {
                setNotification(r);
                setIsError(true);
                setTimeout(() => {
                    setNotification(null);
                    setIsError(false);
                }, 5000);
            }
        } 
        catch (exception) {
            if (exception.response !== undefined)
                setNotification(exception.response.data);
            setIsError(true);
            setTimeout(() => {
                setNotification(null);
                setIsError(false);
            }, 5000);       
        }
    };

    const checkbox = (isChecked, course_id, user_id) => {
        return (
            <Checkbox checked={ isChecked > 0 ? true : false } onChange={ handleCheck(isChecked, course_id, user_id)} value={ course_id } />
        );
    };

    const columns = [        
        { id: 'course_code', label: 'course code', minWidth: 10 },
        { id: 'course_title', label: 'course title', minWidth: 10 },
        { id: 'course_description', label: 'course description', minWidth: 10 },
        { id: 'added_by', label: 'added by', minWidth: 10 },
        { id: 'is_available', label: 'is available', minWidth: 10 },
        { id: 'delete course', label: ' ', minWidth: 10 },
    ];

    const customTable = row => {
        return (
            <TableRow key={row.course_id}>                
                <TableCell>{row.course_code}</TableCell>
                <TableCell>{row.course_title}</TableCell>
                <TableCell>{row.course_description}</TableCell>
                <TableCell> {row.username}</TableCell>
                <TableCell>{checkbox(row.is_available, row.course_id, profileData.user_id)}</TableCell>
                <TableCell><IconButton aria-label="delete" onClick={ handleDelete(row.course_id, profileData.user_id) }><DeleteIcon /></IconButton></TableCell>
            </TableRow>
        );
    }

    const Tabs = a11yProps => {
        return (
            [
                <Tab key={0} label="Course Admin" {...a11yProps(0)} />,                
            ]
        );
    };

    const TabPanels = value => {        
        return (
            <>
                <TabPanel value={value} index={0}>                
                    <Container component="main" maxWidth="xl">
                        <CourseAdminForm 
                            profileData={ profileData }
                            getAllCourses={ getAllCourses }
                            expanded={ expanded }
                            setExpanded={ setExpanded }
                            setNotification={ setNotification }
                            setIsError={ setIsError }
                        />
                        <div className={classes.paper}>                             
                            <Grid container>
                                <Search arrayOfObjects={ allCourses }
                                        searchField={ searchField }
                                        setSearchField={ setSearchField }
                                        setSearch={ setSearch } />
                            </Grid>                        
                            <PaginatedTable rows={ search ? search : [] } 
                                            columns={ columns } 
                                            size="small"
                                            customTable = { customTable } />
                        </div>
                    </Container>
                </TabPanel>
            </>
        );
    };

    return (
        <HorizontalTabs tabs={ Tabs } tabPanels={ TabPanels } />
    );
};

export default CourseAdmin;