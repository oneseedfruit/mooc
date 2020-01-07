const query = require('./query');

const permissions = async (req, res, next, conn, user_accounts_tb, user_permissions_tb) => {    
    if (req.body.sessionId) {
        const data = await query.query(conn, 
                'SELECT ' + 
                    'ac.userid, ' +
                    'p.canManageUsers, ' +
                    'p.canModerateUsers, ' +
                    'p.canManageCourses, ' +
                    'p.canManageOwnClasses, ' +
                    'p.canManageAllClasses ' +
                'FROM ' + user_accounts_tb + ' ac ' +
                'JOIN ' + user_permissions_tb + ' p ON ac.userid = p.permid ' +
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
                'WHERE userid = ' + req.body.userid + '; '
            ).catch(console.log);
        
        res.end();
    }    
    res.end();
};

module.exports = permissions;