const bcrypt = require('bcrypt');
const crypto = require('crypto');
const uuid = require('node-uuid');
const query = require('./query');

const updateAccount = async (req, res, next, conn, accountsTableName, permissionsTableName) => {
	const reqNewUsername = req.body.username;
	const reqNewName = req.body.name;
	const reqNewEmail = req.body.newEmail;
	const reqOldPassword = req.body.oldPassword;
	const reqSessionId = req.body.sessionId;	
	
	const matchSessionId = await query.query(conn, 
		"SELECT username, password FROM " + accountsTableName + " " +
		"WHERE sessionId = '" + reqSessionId + "';"
	).catch(console.log);
		
	const reqNewPassword = req.body.newPassword != '' ? bcrypt.hashSync(req.body.newPassword, 10) : matchSessionId[0].password;

	if (!matchSessionId) {
		res.status(401).send('Session lost! Please logout and login again.');
		return;
	}

	const checkEmail = await query.query(conn,
		'SELECT email FROM ' + accountsTableName + 
		' WHERE email = "' + reqNewEmail + '"' + 
		' AND sessionId != "' + reqSessionId + '"; '		
	).catch(console.log);

	if (checkEmail[0]) {
		res.status(401).send(`Email address "${reqNewEmail}" has already been taken!`);
		return;	
	}
	
	const matchOldPassword = bcrypt.compareSync(reqOldPassword, matchSessionId[0].password, 10);

	if (!matchOldPassword) {
		res.status(401).send("Incorrect password!");
		return;
	}	
	
	if (!checkEmail[0] && matchSessionId && matchOldPassword) {
		const updateAcc = await query.query(conn,
			"UPDATE " + accountsTableName + " " +
			"SET " + 
				"name = '" + reqNewName + "' ," +
				"email = '" + reqNewEmail + "', " +
				"password = '" + reqNewPassword + "' " +
			"WHERE sessionId = '" + reqSessionId + "';"
		).catch(console.log);

		res.status(200).send("Account updated successfully!");
		return;
	}

	res.end();
};

module.exports = updateAccount;