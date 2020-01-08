const bcrypt = require('bcrypt');
const query = require('../query');

const updateAccount = async (req, res, next, conn, user_accounts_tb) => {	
	const escapeQuotes = (str) => {
        return (str + '').replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
	};
	
	const reqNewName = escapeQuotes(req.body.name);
	const reqNewEmail = escapeQuotes(req.body.newEmail);
	const reqOldPassword = escapeQuotes(req.body.oldPassword);
	const reqSessionId = escapeQuotes(req.body.session_id);
	
	const matchSessionId = await query.query(conn, 
		"SELECT username, password FROM " + user_accounts_tb + " " +
		"WHERE session_id = '" + reqSessionId + "';"
	).catch(console.log);
		
	const reqNewPassword = escapeQuotes(req.body.newPassword) != '' ? 
						   bcrypt.hashSync(escapeQuotes(req.body.newPassword), 10) : 
						   matchSessionId[0].password;

	if (!matchSessionId) {
		res.status(500);
		res.send('Session lost! Please logout and login again.');		
	}

	const checkEmail = await query.query(conn,
		'SELECT email FROM ' + user_accounts_tb + 
		' WHERE email = "' + reqNewEmail + '"' + 
		' AND session_id != "' + reqSessionId + '"; '		
	).catch(console.log);

	if (checkEmail[0]) {
		res.status(500);
		res.send(`Email address "${reqNewEmail}" has already been taken!`);		
	}
	
	const matchOldPassword = bcrypt.compareSync(reqOldPassword, matchSessionId[0].password, 10);

	if (!matchOldPassword) {
		res.status(401);
		res.send("Incorrect password!");		
	}	
	
	if (!checkEmail[0] && matchSessionId && matchOldPassword) {
		await query.query(conn,
			"UPDATE " + user_accounts_tb + " " +
			"SET " + 
				"name = '" + reqNewName + "' ," +
				"email = '" + reqNewEmail + "', " +
				"password = '" + reqNewPassword + "' " +
			"WHERE session_id = '" + reqSessionId + "';"
		).catch(console.log);

		res.status(200);
		res.send("Account updated successfully!");		
	}

	res.end();
};

module.exports = updateAccount;