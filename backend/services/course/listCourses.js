const query = require('../query');

const listCourses = async (req, res, next, conn, courses_tb, user_permissions_tb, user_accounts_tb) => {
    if (req.query.user_id !== undefined) {
        const data = await query.query(conn,
            'SELECT ' + 
                'c.user_id, ' +
                'p.can_manage_users, ' +
                'p.can_moderate_users, ' +
                'p.can_manage_own_courses, ' +
                'p.can_manage_all_courses, ' +
                'p.can_manage_own_classes, ' +
                'p.can_manage_all_classes ' +
            'FROM ' + courses_tb + ' c ' +
            'JOIN ' + user_permissions_tb + ' p ON c.user_id = p.user_id ' +
            'WHERE p.user_id = ? ;', [req.query.user_id]
        ).catch(console.log);

        if (data !== undefined && data.length > 0 && data[0]) {
            const own = data[0].can_manage_own_courses > 0;
            const all = data[0].can_manage_all_courses > 0;

            if (own && !all) {
                const r = await query.query(conn,
                    "SELECT c.*, a.username FROM " + courses_tb + " c " +
                    'JOIN ' + user_accounts_tb + ' a ON a.user_id = c.user_id ' +
                    "WHERE c.user_id = " + req.query.user_id + "; "
                ).catch(console.log);

                if (r) {
                    res.status(200).send(r);
                    return;
                }
            }
            else {
                const data = await query.query(conn,
                        "SELECT c.*, a.username FROM " + courses_tb + " c " + 
                        "JOIN " + user_accounts_tb + " a ON a.user_id = c.user_id " +
                        ";"
                    ).catch(console.log);
            
                if (data)
                    res.status(200).send(data);
            }
        }        
    }

    res.end();
};

module.exports = listCourses;