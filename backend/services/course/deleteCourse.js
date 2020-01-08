const query = require('../query');

const deleteCourse = async (req, res, next, conn, 
        user_accounts_tb, 
        user_permissions_tb, 
        courses_tb, 
        class_sessions_tb, 
        class_sessions_regis_tb) => {	
    
    const course_id = req.body.course_id;    
    const user_id = req.body.user_id;

    if (course_id != undefined) {
        const addedBy = await query.query(conn, 
            'SELECT user_id ' +                
            'FROM ' + courses_tb + ' ' +            
            'WHERE course_id = ? AND user_id = ? ;', [course_id, user_id]                
        ).catch(console.log);
        
        const _a = addedBy ? addedBy.length > 0 : false;
        const isOwner = _a && user_id === addedBy[0].user_id;

        const perm = await query.query(conn, 
            'SELECT can_manage_all_courses ' +
            'FROM ' + user_permissions_tb + '  ' +            
            'WHERE user_id = ? ;', [user_id]                
        ).catch(console.log);

        const _b = perm ? perm.length > 0 : false;
        const all = _b && perm[0].can_manage_all_courses > 0;

        if (!all && isOwner) {
            const class_id = await query.query(conn, 
                'SELECT class_id ' +
                'FROM ' + class_sessions_tb + ' ' +
                'WHERE course_id = ' + course_id + ';'
            ).catch(console.log);

            if (class_id.length > 0) {
                await query.query(conn, 
                    'UPDATE ' + class_sessions_regis_tb + ' ' +
                    'SET class_id = -1 ' +
                    'WHERE class_id = ' + class_id[0] + '; '
                ).catch(console.log);
            }

            await query.query(conn, 
                'UPDATE ' + class_sessions_tb + ' ' +
                'SET course_id = -1 ' +
                'WHERE course_id = ' + course_id + '; '
            ).catch(console.log);

            await query.query(conn, 
                'DELETE FROM ' + courses_tb + ' ' +                
                'WHERE course_id = ? AND user_id = ? ;', [course_id, user_id]
            ).catch(console.log);

            res.status(200).send("Course successfully deleted!");
            return;
        }
        else if (all) {
            const class_id = await query.query(conn, 
                'SELECT class_id ' +
                'FROM ' + class_sessions_tb + ' ' +
                'WHERE course_id = ' + course_id + ';'
            ).catch(console.log);

            if (class_id.length > 0) {
                await query.query(conn, 
                    'UPDATE ' + class_sessions_regis_tb + ' ' +
                    'SET class_id = -1 ' +
                    'WHERE class_id = ' + class_id[0] + '; '
                ).catch(console.log);
            }

            await query.query(conn, 
                'UPDATE ' + class_sessions_tb + ' ' +
                'SET course_id = -1 ' +
                'WHERE course_id = ' + course_id + '; '
            ).catch(console.log);

            await query.query(conn, 
                'DELETE FROM ' + courses_tb + ' ' +                
                'WHERE course_id = ? ;', [course_id]
            ).catch(console.log);

            res.status(200).send("Course successfully deleted!");
            return;
        }
    }
    
    res.status(401);
    res.send("You are not authorized to delete this!");
	res.end();
};

module.exports = deleteCourse;