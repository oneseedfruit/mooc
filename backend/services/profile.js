const query = require('./query');

const profile = async (req, res, next, conn, user_accounts_tb, user_permissions_tb) => {
    const data = await query.query(conn, 
            'SELECT ac.userid, username, email, name, p.canManageUsers FROM ' + user_accounts_tb + ' ac ' +
            'JOIN ' + user_permissions_tb + ' p ON ac.userid = p.permid ' +
            'WHERE sessionId = ? ;', [req.body.sessionId]
        ).catch(console.log);

    if (data) {
        res.send(data[0]);
        return;
    }
};

module.exports = profile;