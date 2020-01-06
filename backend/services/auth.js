const bcrypt = require('bcrypt');
const crypto = require('crypto');
const uuid = require('node-uuid');
const query = require('./query');

const auth = async (req, res, next, conn, accountsTableName) => {
	const isLogout = req.body.isLogout;

	if (isLogout) {
		const sessionId = req.body.sessionId;		

		await query.query(conn, 
			'UPDATE ' + accountsTableName +
			' SET sessionid = "' + 0 +
			'" WHERE sessionId = "' + sessionId + '";'
		);
		
		res.status(200).end();
	}
	else if (!isLogout) {
		const reqUsername = req.body.username;
		const reqPassword = req.body.password;
		
		if (reqUsername && reqPassword) {
            const loginResults = await query.query(conn, 'SELECT password FROM accounts WHERE username = ?', [reqUsername]);
			const isMatching = loginResults.length > 0 ? bcrypt.compareSync(reqPassword, loginResults[0].password, 10) : false;				
									
            if (isMatching) {
                req.session.loggedin = true;

                const sessionId = crypto.createHash('sha256').update(uuid.v1()).update(crypto.randomBytes(256)).digest("hex");
				await query.query(conn, 
					'UPDATE ' + accountsTableName +
                    ' SET sessionid = "' + sessionId +
					'" WHERE username = "' + reqUsername + '";'
				);
                res.send({ username: reqUsername, sessionId });
            } else {
                res.status(401).send('Incorrect username and/or password!');
            }			
            res.end();
			
		} else {
			res.status(401).send('Please enter username and password!');
			res.end();
		}
	}
};

module.exports = auth;