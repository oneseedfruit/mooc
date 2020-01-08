const query = require('./query');

const permissions = async (req, res, next, conn, user_accounts_tb, user_permissions_tb) => {    
    if (req.body.sessionId) {
        const data = await query.query(conn, 
                'SELECT ' + 
                    'ac.user_id, ' +
                    'p.can_manage_users, ' +
                    'p.can_moderate_users, ' +
                    'p.can_manage_own_courses, ' +
                    'p.can_manage_all_courses, ' +
                    'p.can_manage_own_classes, ' +
                    'p.can_manage_all_classes ' +
                'FROM ' + user_accounts_tb + ' ac ' +
                'JOIN ' + user_permissions_tb + ' p ON ac.user_id = p.perm_id ' +
                'WHERE sessionId = ? ;', [req.body.sessionId]
            ).catch(console.log);
        
        res.send(data[0]);
        res.end();
        return;
    }
    if (req.body.perm && req.body.isChecked != undefined && req.body.isChecked != null) {
        await query.query(conn, 
                'UPDATE ' + user_permissions_tb + ' ' +
                'SET ' + req.body.perm + ' = ' + req.body.isChecked + ' ' +
                'WHERE user_id = ' + req.body.user_id + '; '
            ).catch(console.log);
        
        res.end();
    }    
    res.end();
};

module.exports = permissions;