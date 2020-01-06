const query = require('./query');

const permissions = async (req, res, next, conn, accountsTableName) => {
    const get = await query.query(conn, 
                    'SELECT userid FROM ' + accountsTableName + 
                    ' WHERE sessionId = ? ;', [req.body.sessionId]
                ).catch(console.log);
    
    const get2 = await query.query(conn, 
                    'SELECT isAdmin FROM permissions' + 
                    ' WHERE userid = ? ;', [get[0].userid]
                ).catch(console.log);
                
    const data = get2[0];
    
    res.send(data);
    res.end();

};

module.exports = permissions;