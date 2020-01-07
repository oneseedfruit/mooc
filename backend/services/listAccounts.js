const query = require('./query');

const listAccounts = async (req, res, next, conn, user_accounts_tb, user_permissions_tb) => {
    const data = await query.query(conn,
            "SELECT ac.user_id, " +
                   "ac.username, " + 
                   "ac.email, " + 
                   "ac.name, " + 
                   "p.can_manage_users, " +
                   "p.can_moderate_users, " +
                   "p.can_manage_courses, " +
                   "p.can_manage_own_classes, " +
                   "p.can_manage_all_classes " +
            "FROM " + user_accounts_tb + " ac " +
            "JOIN " + user_permissions_tb + " p " +
            "ON ac.user_id = p.user_id;"
        ).catch(console.log);

    if (data)
        res.status(200).send(data);
};

module.exports = listAccounts;