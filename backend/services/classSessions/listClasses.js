const query = require('../query');

const listClasses = async (req, res, next, conn, class_sessions_tb, class_sessions_info_tb, courses_tb, user_permissions_tb, user_accounts_tb) => {
    if (req.body.user_id != undefined) {
        const data = await query.query(conn,
            'SELECT ' + 
                'c.user_id, ' +
                'p.can_manage_users, ' +
                'p.can_moderate_users, ' +
                'p.can_manage_own_courses, ' +
                'p.can_manage_all_courses, ' +
                'p.can_manage_own_classes, ' +
                'p.can_manage_all_classes ' +
            'FROM ' + class_sessions_tb + ' c ' +
            'JOIN ' + user_permissions_tb + ' p ON c.user_id = p.user_id ' +
            'WHERE p.user_id = ? ;', [req.body.user_id]
        ).catch(console.log);

        if (data.length > 0 && data[0]) {
            const own = data[0].can_manage_own_classes > 0;
            const all = data[0].can_manage_all_classes > 0;

            // if (own && !all) {
            //     const r = await query.query(conn,
            //         "SELECT c.*, a.username FROM " + class_sessions_tb + " c " +
            //         'JOIN ' + user_accounts_tb + ' a ON a.user_id = c.user_id ' +
            //         'JOIN ' + class_sessions_info_tb + ' i ON i.class_id = c.class_id ' +
            //         "WHERE c.user_id = " + req.body.user_id + "; "
            //     ).catch(console.log);
                
            //     if (r) {
            //         res.status(200).send(r);
            //         return;
            //     }
            // }
            // else {
                const d = await query.query(conn,
                        "SELECT * FROM " + class_sessions_tb + " c " + 
                        "JOIN " + class_sessions_info_tb + " i ON i.class_id = c.class_id " +
                        "JOIN " + courses_tb + " s ON s.course_id = c.course_id " +
                        "JOIN " + user_accounts_tb + " a ON a.user_id = c.user_id " +
                        "WHERE c.user_id = " + req.body.user_id + "; " +
                        ";"
                    ).catch(console.log);
            
                console.log(d);
                if (d)
                    res.status(200).send(d);
            // }
        }        
    }

    res.end();
};

module.exports = listClasses;