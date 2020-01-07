const query = require('./query');

const listAccounts = async (req, res, next, conn, accountsTableName, permissionsTableName) => {
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
            "FROM " + accountsTableName + " ac " +
            "JOIN " + permissionsTableName + " p " +
            "ON ac.userid = p.userid;"
        ).catch(console.log);

    if (data)
        res.status(200).send(data);
};

module.exports = listAccounts;