const query = require('./query');

const profile = async (req, res, next, conn, user_accounts_tb, user_permissions_tb) => {
    const data = await query.query(conn, 
            'SELECT ac.user_id, username, email, name, p.can_manage_users FROM ' + user_accounts_tb + ' ac ' +
            'JOIN ' + user_permissions_tb + ' p ON ac.user_id = p.perm_id ' +
            'WHERE sessionId = ? ;', [req.body.sessionId]
        ).catch(console.log);

    if (data) {
        res.send(data[0]);
        return;
    }
};

module.exports = profile;