const query = require('./query');

const listAccounts = async (req, res, next, conn, user_accounts_tb, user_permissions_tb) => {
    const data = await query.query(conn,
            "SELECT ac.userid, " +
                   "ac.username, " + 
                   "ac.email, " + 
                   "ac.name, " + 
                   "p.canManageUsers, " +
                   "p.canModerateUsers, " +
                   "p.canManageCourses, " +
                   "p.canManageOwnClasses, " +
                   "p.canManageAllClasses " +
            "FROM " + user_accounts_tb + " ac " +
            "JOIN " + user_permissions_tb + " p " +
            "ON ac.userid = p.userid;"
        ).catch(console.log);

    if (data)
        res.status(200).send(data);
};

module.exports = listAccounts;