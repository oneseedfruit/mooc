const bcrypt = require('bcrypt');
const crypto = require('crypto');
const uuid = require('node-uuid');
const query = require('./query');

const auth = async (req, res, next, conn, user_accounts_tb) => {
	const escapeQuotes = (str) => {
        return (str + '').replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
    };

	const isLogout = req.body.isLogout;

	if (isLogout) {
		const session_id = req.body.session_id;		

		try {
			await query.query(conn, 
				'UPDATE ' + user_accounts_tb +
				' SET session_id = "' + 0 +
				'" WHERE session_id = "' + session_id + '";'
			).catch(console.log);
		}
		catch (exception) {

		}
		
		res.status(200).end();
	}
	else if (!isLogout) {
		const reqUsername = escapeQuotes(req.body.username);
		const reqPassword = escapeQuotes(req.body.password);
		
		if (reqUsername && reqPassword) {
            const loginResults = await query.query(conn, 'SELECT password FROM ' + user_accounts_tb + ' WHERE username = ?', [reqUsername]);
			const isMatching = loginResults.length > 0 ? bcrypt.compareSync(reqPassword, loginResults[0].password, 10) : false;				
									
            if (isMatching) {
                req.session.loggedin = true;

				const session_id = crypto.createHash('sha256').update(uuid.v1()).update(crypto.randomBytes(256)).digest("hex");
				try {
					await query.query(conn, 
						'UPDATE ' + user_accounts_tb +
						' SET session_id = "' + session_id +
						'" WHERE username = "' + reqUsername + '";'
					).catch(console.log);
				}
				catch (exception) {

				}
                res.send({ username: reqUsername, session_id });
            } else {
				res.status(401);
				res.send('Incorrect username and/or password!');
            }			
            res.end();
			
		} else {
			res.status(401);
			res.send('Please enter username and password!');			
		}
	}
};

module.exports = auth;