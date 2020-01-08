const query = require('./query');

const profile = async (req, res, next, conn, user_accounts_tb, user_permissions_tb) => {
    if (req.body.user_id && !req.body.session_id) {
        const data = await query.query(conn, 
            'SELECT username FROM ' + user_accounts_tb + ' ' +
            'WHERE user_id = ? ', [req.body.user_id] + ';'
        ).catch(console.log);

        if(data)
            res.send(data[0].username);

        return;
    }

    const data = await query.query(conn, 
            'SELECT ac.user_id, username, email, name, p.can_manage_users FROM ' + user_accounts_tb + ' ac ' +
            'JOIN ' + user_permissions_tb + ' p ON ac.user_id = p.perm_id ' +
            'WHERE session_id = ? OR ac.user_id = ? ;', [req.body.session_id, req.body.user_id]
        ).catch(console.log);

    if (data) {
        res.send(data[0]);
        return;
    }
};

module.exports = profile;