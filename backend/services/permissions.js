const query = require('./query');

const permissions = async (req, res, next, conn, accountsTableName) => {    
    const data = await query.query(conn, 
            'SELECT ac.userid, p.isAdmin FROM ' + accountsTableName + ' ac ' +            
            'JOIN permissions p ON ac.userid = p.permid ' +
            'WHERE sessionId = ? ;', [req.body.sessionId]
        ).catch(console.log);
    
    res.send(data[0]);
    res.end();
};

module.exports = permissions;