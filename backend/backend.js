const cors = require('cors')

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();

const initdb = require('./services/initdb');
const auth = require('./services/auth');
const register = require('./services/register');
const updateAccount = require('./services/updateAccount');
const profile = require('./services/profile');
const permissions = require('./services/permissions');
const listAccounts = require('./services/listAccounts');

const conn = initdb();

const user_accounts_tb = 'user_accounts';
const user_permissions_tb = 'user_permissions';

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

app.post('/auth', (req, res, next) => auth(req, res, next, conn, user_accounts_tb));
app.post('/register', (req, res, next) => register(req, res, next, conn, user_accounts_tb));
app.post('/updateaccount', (req, res, next) => updateAccount(req, res, next, conn, user_accounts_tb));
app.post('/profile', (req, res, next) => profile(req, res, next, conn, user_accounts_tb, user_permissions_tb));
app.post('/permissions', (req, res, next) => permissions(req, res, next, conn, user_accounts_tb, user_permissions_tb));
app.get('/listaccounts', (req, res, next) => listAccounts(req, res, next, conn, user_accounts_tb, user_permissions_tb));

app.listen(PORT, () => console.log('listening on: ', PORT));