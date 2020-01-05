const query = require('./query');

const profile = async (req, res, next, conn, accountsTableName) => {
    const get = await query.query(conn, 'SELECT userid,username,email FROM ' + accountsTableName + ' WHERE sessionId = ? ;', [req.body.sessionId])
                       .catch(console.log);    
    const get2 = await query.query(conn, 'SELECT canCreateUser FROM permissions WHERE userid = ? ;', [get[0].userid])
                        .catch(console.log);
    const data = { ...get[0], ...get2[0] };
    
    res.send(data);
    res.end();
};

module.exports = profile;