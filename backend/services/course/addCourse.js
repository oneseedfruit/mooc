const query = require('../query');

const addCourse = async (req, res, next, conn, courses_tb, user_permissions_tb) => {
    const escapeQuotes = (str) => {
        return (str + '').replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
    };

    const course_code = escapeQuotes(req.body.course_code);
    const title = escapeQuotes(req.body.title);
    const description = escapeQuotes(req.body.description);
    const user_id = escapeQuotes(req.body.user_id);

    if (req.body.title != null && 
        req.body.user_id != null)  {            
            
            const perm = await query.query(conn,
                'SELECT can_manage_own_courses, can_manage_all_courses FROM ' +
                user_permissions_tb + ' ' +
                'WHERE user_id = ' + user_id + ';'
            ).catch(console.log);;

            if (perm && perm.length > 0 && perm[0].can_manage_own_courses <= 0 &&
                perm[0].can_manage_all_coures <= 0) {
                res.status(401);
                res.send("You are not authorized to add a course!");
                return;
            }

            const duplicateTitle = await query.query(conn, 
                "SELECT course_code, title FROM " + courses_tb + " " +
                "WHERE course_code = " + (course_code === '' ? "null" : "'" + course_code + "'") + 
                    " OR title = '" + title + "';"
            ).catch(console.log);

            if (duplicateTitle && duplicateTitle.length > 0) {
                res.status(500);
                res.send("A duplicate/similarly titled course exists!");
                return;
            }

            await query.query(conn, 
                "INSERT INTO `" + courses_tb + "` (" +                     
                    "`course_code`, " + 
                    "`title`, " + 
                    "`description`, " +                         
                    "`is_available`, " +  
                    "`user_id`" +                          
                ") VALUES (" +                     
                    "'" + (course_code ? course_code : '') + "', " + 
                    "'" + title + "', "+ 
                    "'"+ (description ? description : '') + "', " +
                    "1" + ", " +
                    user_id +                         
                ");"
            ).catch(console.log);

            res.status(200).send("Course successfully added!");
        
    }

    res.end();
};

module.exports = addCourse;