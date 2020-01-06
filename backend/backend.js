const cors = require('cors')

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();

const initdb = require('./services/initdb');
const auth = require('./services/auth');
const profile = require('./services/profile');
const permissions = require('./services/permissions');

const conn = initdb();
const accountsTableName = 'accounts';

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

app.post('/auth', (req, res, next) => auth(req, res, next, conn, accountsTableName));
app.post('/profile', (req, res, next) => profile(req, res, next, conn, accountsTableName));
app.post('/permissions', (req, res, next) => permissions(req, res, next, conn, accountsTableName));

app.listen(PORT, () => console.log('listening on: ', PORT));