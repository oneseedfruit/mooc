const crypto = require('crypto');
const uuid = require('node-uuid');
const query = require('./query');

const auth = async (req, res, next, conn, accountsTableName) => {
	const isLogout = req.body.isLogout;

	if (isLogout) {
		const sessionId = req.body.sessionId;		

		await query(conn, 'UPDATE ' + accountsTableName 
		+ ' SET sessionid = "' + 0 
		+ '" WHERE sessionId = "' + sessionId + '";');
		
		res.end();
	}
	else if (!isLogout) {
		const username = req.body.username;
		const password = req.body.password;

		if (username && password) {
            const loginResults = await query(conn, 'SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password]);
            
            if (loginResults.length > 0) {
                req.session.loggedin = true;

                const sessionId = crypto.createHash('sha256').update(uuid.v1()).update(crypto.randomBytes(256)).digest("hex");
                await query(conn, 'UPDATE ' + accountsTableName 
                                + ' SET sessionid = "' + sessionId 
                                + '" WHERE username = "' + username + '";');                                    									
                res.send({ username, sessionId });
            } else {
                res.status(401).send('Incorrect Username and/or Password!');
            }			
            res.end();
			
		} else {
			res.status(401).send('Please enter Username and Password!');
			res.end();
		}
	}
};

module.exports = auth;