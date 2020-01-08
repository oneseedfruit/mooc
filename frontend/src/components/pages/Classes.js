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
import courses from '../../services/courses';
import classSessions from '../../services/classSessions';

const Classes = ({ allCourses, setAllCourses, profileData, getProfileData, permissions, setNotification, setIsError}) => {
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


    const handleAddClass = (course_id, user_id) => async event => {     
        try {
            const r = await classSessions.addClass({ course_id, user_id }).catch(console.log);
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
            setNotification('Failed to add a class!');
            setIsError(true);
            setTimeout(() => {
                setNotification(null);
                setIsError(false);
            }, 5000);
        }
    };

    const columns = [        
        { id: 'course_code', label: 'course code', minWidth: 10 },
        { id: 'title', label: 'title', minWidth: 10 },
        { id: 'description', label: 'description', minWidth: 10 },
        { id: 'added_by', label: 'added by', minWidth: 10 },
        { id: 'add a class', label: 'start a class', minWidth: 10 },
    ];

    const customTable = row => {
        return (
            <TableRow key={row.course_id}>                
                <TableCell>{row.course_code}</TableCell>
                <TableCell>{row.title}</TableCell>
                <TableCell>{row.description}</TableCell>
                <TableCell> {row.username}</TableCell>
                <TableCell>
                    <IconButton aria-label="add a class" onClick={ handleAddClass(row.course_id, profileData.user_id) }>
                        <AddBoxIcon />
                    </IconButton>
                </TableCell>
            </TableRow>
        );
    }

    const Tabs = a11yProps => {
        return (
            [
                <Tab key={0} label="My Classes" {...a11yProps(1)} />,
                ((permissions !== null) ? (permissions.can_manage_own_courses || permissions.can_manage_all_courses  ?        
                    <Tab key={1} label="Available Courses" {...a11yProps(1)} />        
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