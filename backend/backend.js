const cors = require('cors')

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();

const initdb = require('./services/initdb');
const auth = require('./services/auth');
const register = require('./services/register');
const permissions = require('./services/permissions');
const updateAccount = require('./services/updateAccount');
const deleteAccount = require('./services/deleteAccount');
const listAccounts = require('./services/listAccounts');
const profile = require('./services/profile');
const listCourses = require('./services/listCourses');
const addCourse = require('./services/addCourse');
const deleteCourse = require('./services/deleteCourse');
const updateCourse = require('./services/updateCourse');

const conn = initdb();

const user_accounts_tb = 'user_accounts';
const user_permissions_tb = 'user_permissions';
const courses_tb = "courses";
const class_sessions_tb = "class_sessions";
const class_sessions_regis_tb = "class_sessions_regis";

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

try {
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
}
catch {
	console.log("Promises are broken.");
}

app.listen(PORT, () => console.log('listening on: ', PORT));
