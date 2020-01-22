const cors = require('cors');

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();

const initdb = require('./services/initdb');
const auth = require('./services/auth/auth');
const register = require('./services/auth/register');
const permissions = require('./services/account/permissions');
const updateAccount = require('./services/account/updateAccount');
const deleteAccount = require('./services/account/deleteAccount');
const listAccounts = require('./services/account/listAccounts');
const profile = require('./services/account/profile');
const listCourses = require('./services/course/listCourses');
const addCourse = require('./services/course/addCourse');
const deleteCourse = require('./services/course/deleteCourse');
const updateCourse = require('./services/course/updateCourse');
const listClasses = require('./services/classSessions/listClasses');
const addClass = require('./services/classSessions/addClass');

const conn = initdb();

const user_accounts_tb = 'user_accounts';
const user_permissions_tb = 'user_permissions';
const courses_tb = "courses";
const class_sessions_tb = "class_sessions";
const class_sessions_info_tb = "class_sessions_info";
const class_sessions_contents_tb = "class_sessions_contents";
const class_sessions_regis_tb = "class_sessions_regis";
const contents_tb = "contents";

const PORT = 3001;

app.use(cors());
app.options('*', cors());
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.post('/auth/login', (req, res, next) => auth(req, res, next, conn, user_accounts_tb));
app.post('/auth/register', (req, res, next) => register(req, res, next, conn, user_accounts_tb));

app.post('/account/permissions', (req, res, next) => permissions(req, res, next, conn, user_accounts_tb, user_permissions_tb));
app.post('/account/update', (req, res, next) => updateAccount(req, res, next, conn, user_accounts_tb));
app.post('/account/delete', (req, res, next) => deleteAccount(req, res, next, conn, user_accounts_tb, user_permissions_tb, courses_tb, class_sessions_tb, class_sessions_regis_tb));
app.get('/account/get/all', (req, res, next) => listAccounts(req, res, next, conn, user_accounts_tb, user_permissions_tb));

app.post('/profile/get', (req, res, next) => profile(req, res, next, conn, user_accounts_tb, user_permissions_tb));

app.post('/course/get/all', (req, res, next) => listCourses(req, res, next, conn, courses_tb, user_permissions_tb, user_accounts_tb));	
app.post('/course/add', (req, res, next) => addCourse(req, res, next, conn, courses_tb, user_permissions_tb));
app.post('/course/delete', (req, res, next) => deleteCourse(req, res, next, conn, user_accounts_tb, user_permissions_tb, courses_tb, class_sessions_tb, class_sessions_regis_tb));
app.post('/course/update', (req, res, next) => updateCourse(req, res, next, conn, courses_tb, user_permissions_tb));

app.post('/class/get/all', (req, res, next) => listClasses(req, res, next, conn, class_sessions_tb, class_sessions_info_tb, courses_tb, user_permissions_tb, user_accounts_tb));	
app.post('/class/add', (req, res, next) => addClass(req, res, next, conn, 
	class_sessions_tb, 
	class_sessions_info_tb, 
	class_sessions_regis_tb,
	class_sessions_contents_tb,
	contents_tb,
	courses_tb, 
	user_permissions_tb
));

app.listen(PORT, () => console.log('listening on: ', PORT));