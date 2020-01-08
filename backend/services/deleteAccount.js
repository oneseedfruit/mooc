const bcrypt = require('bcrypt');
const query = require('./query');

const deleteAccount = async (req, res, next, conn, user_accounts_tb, user_permissions_tb) => {	
    const user_id = req.body.user_id;    
    const session_id = req.body.session_id;

    console.log(user_id);
    console.log(session_id);

    if (session_id) {
        const data = await query.query(conn, 
                'SELECT ' + 
                    'ac.user_id, ' +
                    'p.can_manage_users ' +
                'FROM ' + user_accounts_tb + ' ac ' +
                'JOIN ' + user_permissions_tb + ' p ON ac.user_id = p.perm_id ' +
                'WHERE sessionId = ? ;', [session_id]
            ).catch(console.log);
        
        if (data && data[0].can_manage_users === 1) {
            await query.query(conn, 
                'DELETE FROM ' + user_permissions_tb + ' ' +                
                'WHERE user_id = ? ;', [user_id]
            ).catch(console.log);
            await query.query(conn, 
                'DELETE FROM ' + user_accounts_tb + ' ' +
                'WHERE user_id = ? ;', [user_id]
            ).catch(console.log);

            res.end();
        }
        else {
            res.status(401).send(`You are not authroized to make this change.`);
        }
    }

	res.end();
};

module.exports = deleteAccount;