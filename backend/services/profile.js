const query = require('./query');

const profile = async (req, res, next, conn, accountsTableName, permissionsTableName) => {
    const data = await query.query(conn, 
            'SELECT ac.userid, username, email, p.canManageUsers FROM ' + accountsTableName + ' ac ' +
            'JOIN ' + permissionsTableName + ' p ON ac.userid = p.permid ' +
            'WHERE sessionId = ? ;', [req.body.sessionId]
        ).catch(console.log);

    res.send(data[0]);
    res.end();
    return;
};

module.exports = profile;