const bcrypt = require('bcrypt');
const crypto = require('crypto');
const uuid = require('node-uuid');
const query = require('./query');

const register = async (req, res, next, conn, user_accounts_tb) => {
	const escapeQuotes = (str) => {
        return (str + '').replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
	};
	
	const reqNewUsername = escapeQuotes(req.body.newUsername);
	const reqNewPassword = escapeQuotes(req.body.newPassword);
	const reqNewEmail = escapeQuotes(req.body.newEmail);
	const reqNewName = escapeQuotes(req.body.newName);
	
	const checkUsername = await query.query(conn, 
		'SELECT username FROM ' + user_accounts_tb + ' WHERE username = "' + reqNewUsername + '";'
	).catch(console.log);

	if (checkUsername[0]) {
		res.status(500);
		res.send(`Username "${reqNewUsername}" has already been taken!`);		
		return;
	}

	const checkEmail = await query.query(conn,
		'SELECT email FROM ' + user_accounts_tb + ' WHERE email = "' + reqNewEmail + '";'
	).catch(console.log);

	if(checkEmail[0]) {
		res.status(500);
		res.send(`Email address "${reqNewEmail}" has already been taken!`);		
		return;
	}

	const session_id = crypto.createHash('sha256').update(uuid.v1()).update(crypto.randomBytes(256)).digest("hex");
	
	const insertNewUser = await query.query(conn,
			"INSERT INTO `" + user_accounts_tb + "` (" +                     
				"`username`, " + 
				"`password`, " + 
				"`email`, " +                         
				"`name`, " +  
				"`session_id`" + 
			") VALUES (" +                     
				"'" + reqNewUsername + "', "+ 
				"'" + bcrypt.hashSync(reqNewPassword, 10) + "', "+ 
				"'"+ reqNewEmail + "', "+ 
				"'"+ reqNewName + "', "+ 
				"'" + session_id + "'" +
			");"
		).catch(console.log);

	if (insertNewUser) {
		res.status(200).send({ username: reqNewUsername, session_id });		
	}

	res.end();
};

module.exports = register;