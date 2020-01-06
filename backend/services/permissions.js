const query = require('./query');

const permissions = async (req, res, next, conn, accountsTableName, permissionsTableName) => {    
    const data = await query.query(conn, 
            'SELECT ' + 
                'ac.userid, ' +
                'p.canManageUsers, ' +
                'p.canModerateUsers, ' +
                'p.canManageCourses, ' +
                'p.canManageOwnClasses, ' +
                'p.canManageAllClasses ' +
            'FROM ' + accountsTableName + ' ac ' +
            'JOIN ' + permissionsTableName + ' p ON ac.userid = p.permid ' +
            'WHERE sessionId = ? ;', [req.body.sessionId]
        ).catch(console.log);
    
    res.send(data[0]);
    res.end();
};

module.exports = permissions;