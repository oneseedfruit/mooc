const bcrypt = require('bcrypt');
const cors = require('cors')
const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

const auth = require('./services/auth');
const profile = require('./services/profile');

const PORT = 3001;

const databaseName = 'db';
const accountsTableName = 'accounts';
const firstUserName = 'admin';
const firstUserPassword = bcrypt.hashSync('admin', 10);
const firstUserEmail = 'admin@admin.com';

const conn = mysql.createConnection({
	host     : 'deerclops.sytes.net',
	port     :  3305,
	user     : 'randy',
	password : 'shaoxian',
	database : databaseName
});

app.use(cors());
app.options('*', cors());

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

conn.query('SELECT TABLE_NAME FROM information_schema.tables WHERE table_schema = ? AND table_name = ?', [databaseName, accountsTableName], (error, results, fields) => {	
	if (results && results.length <= 0) {
		conn.query('CREATE TABLE IF NOT EXISTS ' + 
							accountsTableName + 
								'(`id` int(11) NOT NULL, ' + 
								'`username` varchar(50) NOT NULL, ' + 
								'`password` varchar(255) NOT NULL, ' + 
								'`email` varchar(100) NOT NULL, ' + 
								'`type` int(11) NOT NULL, ' +
								'`sessionid` nvarchar(256) DEFAULT 0)' + 
							'ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;');
		conn.query("INSERT INTO `accounts` (`id`, `username`, `password`, `email`, `type`, `sessionid`) VALUES " + 
						   "(1, '" + 
							firstUserName + "', '"+ 
							firstUserPassword +"', '"+ 
							firstUserEmail+"', "+ 
							0 + ", " +
							0 +
							");");
		conn.query('ALTER TABLE `accounts` ADD PRIMARY KEY (`id`);');
		conn.query('ALTER TABLE `accounts` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;');
	}
});

app.post('/auth', (req, res, next) => auth(req, res, next, conn, accountsTableName));
app.post('/profile', (req, res, next) => profile(req, res, next, conn, accountsTableName));

app.listen(PORT, () => console.log('listening on: ', PORT));