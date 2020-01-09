import React, { useState, useEffect, useCallback } from 'react';
import { Grid, Tab, Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import AddBoxIcon from '@material-ui/icons/AddBox';
import HorizontalTabs from '../HorizontalTabs';
import TabPanel from '../TabPanel';
import PaginatedTable from '../CustomPaginationActionsTable';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Search from '../../components/SimpleSearchInArrayOfObjects';
import ClassesAdminForm from './subcomponents/ClassesAdminForm';
import courses from '../../services/courses';
import classSessions from '../../services/classSessions';

const Classes = ({ allCourses, setAllCourses, allClasses, setAllClasses, profileData, getProfileData, permissions, setNotification, setIsError}) => {
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

    const [searchClassField, setSearchClassField] = useState('');
    const [searchClass, setSearchClass] = useState('');
    const [searchCourseField, setSearchCourseField] = useState('');
    const [searchCourse, setSearchCourse] = useState(null);

    const [expandedForm, setExpandedForm] = useState('');
    const [showForm, setShowForm] = useState(false);

    const [course_id, setCourseId] = useState('');
    const [user_id, setUserId] = useState('');
    const [start_date, setStartDate] = useState('');
    const [end_date, setEndDate] = useState('');
    const [class_code, setClassCode] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');



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
            setSearchCourse(data);

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



    const getAllClasses = useCallback(async () => {
        setNotification('Retrieving classes...');
        setIsError(false);
        setTimeout(() => {
            setNotification(null);
            setIsError(false);
        }, 5000);

        try {
            const data = await classSessions.getAllClasses({ user_id: profileData.user_id }).catch(console.log);    
            
            setNotification(null);
            setAllClasses(data);
            getProfileData();
            setSearchClass(data);

            return;                
        } catch (exception) {
            setNotification('Error acquiring classes!');
            setIsError(true);
            setTimeout(() => {
                setNotification(null);
                setIsError(false);
            }, 5000);
        }
    }, [setAllClasses, getProfileData, setNotification, setIsError]);

    useEffect(() => {
        let unmounted = false;
        if (!unmounted)
            getAllClasses();
        return () => { unmounted = true }
    }, [getAllClasses]);


    
    const handleAddClass = (course_id, user_id) => event => {
        setCourseId(course_id);
        setUserId(user_id);
        setShowForm(true);
        setExpandedForm('panel1');
        getAllClasses();
        // try {
        //     const r = await classSessions.addClass({ course_id, user_id }).catch(console.log);
        //     getAllCourses();

        //     if (r) {
        //         setNotification(r);
        //         setIsError(true);
        //         setTimeout(() => {
        //             setNotification(null);
        //             setIsError(false);
        //         }, 5000);
        //     }
        // }
        // catch (exception) {
        //     setNotification('Failed to add a class!');
        //     setIsError(true);
        //     setTimeout(() => {
        //         setNotification(null);
        //         setIsError(false);
        //     }, 5000);
        // }
    };

    const columnsCourse = [        
        { id: 'course_code', label: 'course code', minWidth: 10 },
        { id: 'title', label: 'title', minWidth: 10 },
        { id: 'description', label: 'description', minWidth: 10 },
        { id: 'added_by', label: 'added by', minWidth: 10 },
        { id: 'add a class', label: 'start a class', minWidth: 10 },
    ];

    const customTableCourse = row => {
        return (
            <TableRow key={row.course_id}>                
                <TableCell>{row.course_code}</TableCell>
                <TableCell>{row.course_title}</TableCell>
                <TableCell>{row.course_description}</TableCell>
                <TableCell> {row.username}</TableCell>
                <TableCell>
                    <IconButton aria-label="add a class" onClick={ handleAddClass(row.course_id, profileData.user_id) }>
                        <AddBoxIcon />
                    </IconButton>
                </TableCell>
            </TableRow>
        );
    }

    const columnsClass = [        
        { id: 'title', label: 'title', minWidth: 10 },
        { id: 'description', label: 'description', minWidth: 100 },        
        { id: 'by', label: 'by', minWidth: 10 },
        // { id: 'start_date', label: 'start date', minWidth: 10 },
        // { id: 'end_date', label: 'end date', minWidth: 10 },
    ];

    const customTableClass = row => {
        return (
            <TableRow key={row.class_id}>                
                <TableCell>{row.class_title}</TableCell>         
                <TableCell>{row.class_description}</TableCell>
                <TableCell> {row.username}</TableCell>
                {/* <TableCell>{row.start_date}</TableCell>
                <TableCell>{row.end_date}</TableCell> */}
            </TableRow>
        );
    }

    const Tabs = a11yProps => {
        return (
            [
                <Tab key={0} label="My Classes" {...a11yProps(1)} />,
                ((permissions !== null) ? (permissions.can_manage_own_courses || permissions.can_manage_all_courses  ?        
                    <Tab key={1} label="Instructing Classes" {...a11yProps(2)} />        
                    : '') : ''),
                ((permissions !== null) ? (permissions.can_manage_own_courses || permissions.can_manage_all_courses  ?        
                    <Tab key={2} label="Start a Class Session" {...a11yProps(3)} />        
                    : '') : ''),
            ]
        );
    };

    const TabPanels = value => {        
        return (
            <>
                <TabPanel value={value} index={0}>
                    <Container component="main" maxWidth="xl">                        
                        <div className={classes.paper}>                             
                            <Grid container>
                                                               
                            </Grid>                  
                        </div>
                    </Container>
                </TabPanel>

                { permissions !== null ? permissions.can_manage_own_courses || permissions.can_manage_all_courses  ?
                        <>
                            <TabPanel value={value} index={1}>                
                                <Container component="main" maxWidth="xl">
                                    <ClassesAdminForm 
                                        profileData={ profileData }
                                        getAllCourses={ getAllClasses }
                                        setNotification={ setNotification }
                                        setIsError={ setIsError }
                                            expanded={ expandedForm }
                                        setExpanded={ setExpandedForm }
                                            showForm={ showForm }
                                        setShowForm={ setShowForm }
                                            allCourses={ allCourses }
                                            course_id={ course_id}
                                        setCourseId={ setCourseId }
                                            user_id={ user_id }
                                        setUserId={ setUserId }
                                            start_date={ start_date }
                                        setStartDate={ setStartDate }
                                            end_date={ end_date }
                                        setEndDate={ setEndDate }
                                            class_code={ class_code }
                                        setClassCode={ setClassCode }
                                            title={ title }
                                        setTitle={ setTitle }
                                            description={ description }
                                        setDescription={ setDescription }
                                    />
                                    <div className={classes.paper}>                             
                                        <Grid container>
                                            <Search arrayOfObjects={ allClasses }
                                                    searchField={ searchClassField }
                                                    setSearchField={ setSearchClassField }
                                                    setSearch={ setSearchClass } />
                                        </Grid>                        
                                        <PaginatedTable rows={ searchClass ? searchClass : [] } 
                                                        columns={ columnsClass } 
                                                        size="small"
                                                        customTable = { customTableClass } />
                                    </div>
                                </Container>
                            </TabPanel>
                            </>
                                    : '' : ''
                }

                { permissions !== null ? permissions.can_manage_own_courses || permissions.can_manage_all_courses  ?
                        <>
                            <TabPanel value={value} index={2}>                
                                <Container component="main" maxWidth="xl">
                                    <ClassesAdminForm 
                                        profileData={ profileData }
                                        getAllCourses={ getAllClasses }
                                        setNotification={ setNotification }
                                        setIsError={ setIsError }
                                            expanded={ expandedForm }
                                        setExpanded={ setExpandedForm }
                                            showForm={ showForm }
                                        setShowForm={ setShowForm }
                                            allCourses={ allCourses }
                                            course_id={ course_id}
                                        setCourseId={ setCourseId }
                                            user_id={ user_id }
                                        setUserId={ setUserId }
                                            start_date={ start_date }
                                        setStartDate={ setStartDate }
                                            end_date={ end_date }
                                        setEndDate={ setEndDate }
                                            class_code={ class_code }
                                        setClassCode={ setClassCode }
                                            title={ title }
                                        setTitle={ setTitle }
                                            description={ description }
                                        setDescription={ setDescription }
                                    />
                                    <div className={classes.paper}>                             
                                        <Grid container>
                                            <Search arrayOfObjects={ allCourses }
                                                    searchField={ searchCourseField }
                                                    setSearchField={ setSearchCourseField }
                                                    setSearch={ setSearchCourse } />
                                        </Grid>                        
                                        <PaginatedTable rows={ searchCourse ? searchCourse : [] } 
                                                        columns={ columnsCourse } 
                                                        size="small"
                                                        customTable = { customTableCourse } />
                                    </div>
                                </Container>
                            </TabPanel>
                            </>
                                    : '' : ''
                }
            </>
        );
    };

    return (
        <HorizontalTabs tabs={ Tabs } tabPanels={ TabPanels } />
    );
};

export default Classes;