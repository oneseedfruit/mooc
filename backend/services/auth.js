const bcrypt = require('bcrypt');
const crypto = require('crypto');
const uuid = require('node-uuid');
const query = require('./query');

const auth = async (req, res, next, conn, accountsTableName) => {
	const isLogout = req.body.isLogout;

	if (isLogout) {
		const sessionId = req.body.sessionId;		

		await query.query(conn, 'UPDATE ' + accountsTableName 
		+ ' SET sessionid = "' + 0 
		+ '" WHERE sessionId = "' + sessionId + '";');
		
		res.end();
	}
	else if (!isLogout) {
		if (req.body.username && req.body.password) {
            const loginResults = await query.query(conn, 'SELECT password FROM accounts WHERE username = ?', [req.body.username]);
			const isMatching = loginResults.length > 0 ? bcrypt.compareSync(req.body.password, loginResults[0].password, 10) : false;				
									
            if (isMatching) {
                req.session.loggedin = true;

                const sessionId = crypto.createHash('sha256').update(uuid.v1()).update(crypto.randomBytes(256)).digest("hex");
                await query.query(conn, 'UPDATE ' + accountsTableName 
                                + ' SET sessionid = "' + sessionId 
                                + '" WHERE username = "' + req.body.username + '";');                                    									
                res.send({ username: req.body.username, sessionId });
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