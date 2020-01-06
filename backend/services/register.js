const bcrypt = require('bcrypt');
const crypto = require('crypto');
const uuid = require('node-uuid');
const query = require('./query');

const register = async (req, res, next, conn, accountsTableName) => {
	const reqNewUsername = req.body.newUsername;
	const reqNewPassword = req.body.newPassword;
	const reqNewEmail = req.body.newEmail;
	const reqNewName = req.body.newName;
	
	const checkUsername = await query.query(conn, 
		'SELECT username FROM ' + accountsTableName + ' WHERE username = "' + reqNewUsername + '";'
	).catch(console.log);

	if (checkUsername[0]) {
		res.status(401).send(`Username "${reqNewUsername}" has already been taken!`);		
		return;
	}

	const checkEmail = await query.query(conn,
		'SELECT email FROM ' + accountsTableName + ' WHERE email = "' + reqNewEmail + '";'
	).catch(console.log);

	if(checkEmail[0]) {
		res.status(401).send(`Email address "${reqNewEmail}" has already been taken!`);		
		return;
	}

	const sessionId = crypto.createHash('sha256').update(uuid.v1()).update(crypto.randomBytes(256)).digest("hex");
	
	const insertNewUser = await query.query(conn,
			"INSERT INTO `" + accountsTableName + "` (" +                     
				"`username`, " + 
				"`password`, " + 
				"`email`, " +                         
				"`name`, " +  
				"`sessionid`" + 
			") VALUES (" +                     
				"'" + reqNewUsername + "', "+ 
				"'" + bcrypt.hashSync(reqNewPassword, 10) + "', "+ 
				"'"+ reqNewEmail + "', "+ 
				"'"+ reqNewName + "', "+ 
				"'" + sessionId + "'" +
			");"
		).catch(console.log);

	if (insertNewUser) {
		res.status(200).send({ username: reqNewUsername, sessionId });		
	}

	res.end();
};

module.exports = register;