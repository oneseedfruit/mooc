const query = require('../query');

const deleteAccount = async (req, res, next, conn, user_accounts_tb, user_permissions_tb, courses_tb, class_sessions_tb, class_sessions_regis_tb) => {	
    const user_id = req.body.user_id;    
    const session_id = req.body.session_id;

    if (session_id) {
        const data = await query.query(conn, 
                'SELECT ' + 
                    'ac.user_id, ' +
                    'p.can_manage_users ' +
                'FROM ' + user_accounts_tb + ' ac ' +
                'JOIN ' + user_permissions_tb + ' p ON ac.user_id = p.perm_id ' +
                'WHERE session_id = ? AND ac.user_id != ? ;', [session_id, user_id]                
            ).catch(console.log);

        if (data.length > 0 && data[0].can_manage_users === 1) {
            await query.query(conn, 
                'SET FOREIGN_KEY_CHECKS=0;'
            ).catch(console.log);



            await query.query(conn, 
                'DELETE FROM ' + class_sessions_regis_tb + ' ' +                
                'WHERE user_id = ? ;', [user_id]
            ).catch(console.log);

            
            await query.query(conn, 
                'UPDATE ' + class_sessions_tb + ' ' +
                'SET user_id = -1 ' +
                'WHERE user_id = ' + user_id + '; '
            ).catch(console.log);
            await query.query(conn, 
                'UPDATE ' + courses_tb + ' ' +
                'SET user_id = -1 ' +
                'WHERE user_id = ' + user_id + '; '
            ).catch(console.log);


            await query.query(conn, 
                'DELETE FROM ' + user_permissions_tb + ' ' +                
                'WHERE user_id = ? ;', [user_id]
            ).catch(console.log);
            await query.query(conn, 
                'DELETE FROM ' + user_accounts_tb + ' ' +
                'WHERE user_id = ? ;', [user_id]
            ).catch(console.log);



            await query.query(conn, 
                'SET FOREIGN_KEY_CHECKS=1;'
            ).catch(console.log);

            res.status(200);
            res.send(`Account successfully deleted!`);
            res.end();
        }
        else {
            res.status(401);
            res.send(`You are not authroized to make this change.`);
        }
    }

	res.end();
};

module.exports = deleteAccount;