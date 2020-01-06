const bcrypt = require('bcrypt');
const crypto = require('crypto');
const uuid = require('node-uuid');
const query = require('./query');

const register = async (req, res, next, conn, accountsTableName, permissionsTableName) => {
	const reqNewUsername = req.body.newUsername;
	const reqNewPassword = req.body.newPassword;
	const reqNewEmail = req.body.newEmail;							
	
	const checkUsername = await query.query(conn, 
		'SELECT username FROM ' + accountsTableName + ' WHERE username = "' + reqNewUsername + '";'
	).catch(console.log);

	if (checkUsername[0]) {
		res.status(401).send(`Username "${reqNewUsername}" has already been taken!`);
		res.end();
		return;
	}

	const checkEmail = await query.query(conn,
		'SELECT email FROM ' + accountsTableName + ' WHERE email = "' + reqNewEmail + '";'
	).catch(console.log);

	if(checkEmail[0]) {
		res.status(401).send(`Email address "${reqNewEmail}" has already been taken!`);
		res.end();
		return;
	}

	res.end();
};

module.exports = register;