const query = require('./query');

const profile = async (req, res, next, conn, accountsTableName) => {
    const data = await query(conn, 'SELECT username,email,type FROM ' + accountsTableName + ' WHERE sessionId = ? ;', [req.body.sessionId])
                       .catch(console.log);
    res.send(data);
    res.end();
};

module.exports = profile;