const query = require('../query');

const addClass = async (req, res, next, conn, 
        class_sessions_tb, 
        class_sessions_info_tb, 
        class_sessions_regis_tb,
        class_sessions_contents_tb,
        contents_tb,
        courses_tb, 
        user_permissions_tb
) => {
    const escapeQuotes = (str) => {
        return (str + '').replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
    };

    const course_id = escapeQuotes(req.body.course_id);
    const user_id = escapeQuotes(req.body.user_id);
    let start_date = escapeQuotes(req.body.start_date);
    let end_date = escapeQuotes(req.body.end_date);
    const class_code = escapeQuotes(req.body.class_code);
    const title = escapeQuotes(req.body.title);
    const description = escapeQuotes(req.body.description);

    start_date = start_date === '' ? '1000-01-01' : start_date;
    end_date = end_date === '' ? '1000-01-01' : end_date;

    console.log("\n\n");
    console.log("A new class is being added!");
    console.log("course_id: " + course_id);
    console.log("user_id: " + user_id);
    console.log("start_date: " + start_date);
    console.log("end_date: " + end_date);
    console.log("class_code: " + class_code);
    console.log("title: " + title);
    console.log("description: " + description);
    console.log("\n\n");

    if (course_id != null && user_id!= null)  {
        const perm = await query.query(conn, 
            "SELECT can_manage_own_courses, can_manage_all_courses " +
            "FROM " + user_permissions_tb + " " +
            "WHERE user_id = " + user_id + ";"
        ).catch(console.log);
        
        console.log("Checking permissions for user_id " + user_id + "...");
        console.log("Permission object: ");
        console.log(perm);
        console.log("\n");

        if (perm && perm.length > 0) {
            if (perm[0].can_manage_own_courses > 0 || 
                perm[0].can_manage_all_courses > 0) {
                
                console.log("Inserting...");

                await query.query(conn, 
                    "SET FOREIGN_KEY_CHECKS = 0;" +
                    "; "
                ).catch(console.log);
                await query.query(conn, 
                    "INSERT INTO " + class_sessions_tb + " (" +                
                        "start_date, " +
                        "end_date, " +
                        "course_id, " +
                        "user_id" +
                    ") VALUES ('" +
                        start_date + "', '" +
                        end_date + "', '" +
                        course_id + "', '" +
                        user_id + 
                    "');"
                ).catch(console.log);
                await query.query(conn, 
                    "UPDATE " + class_sessions_info_tb + " i " +
                    "INNER JOIN " + class_sessions_tb + " cs " +
                    "ON (i.class_id = cs.class_id) " +                    
                    "SET " +                         
                        "class_code = '" + class_code + "', " +                        
                        "i.title = '" + title + "', " +
                        "i.description = '" + description + "' " +
                    "WHERE i.class_id = LAST_INSERT_ID()" +
                    "; "
                ).catch(console.log);
                await query.query(conn, 
                    "SET FOREIGN_KEY_CHECKS = 1;" +
                    "; "
                ).catch(console.log);
            }
        }
            
            // const perm = await query.query(conn,
            //     'SELECT can_manage_own_courses, can_manage_all_courses FROM ' +
            //     user_permissions_tb + ' ' +
            //     'WHERE user_id = ' + user_id + ';'
            // ).catch(console.log);;

            // if (perm && perm.length > 0 && perm[0].can_manage_own_courses <= 0 &&
            //     perm[0].can_manage_all_coures <= 0) {
            //     res.status(401);
            //     res.send("You are not authorized to add a course!");
            //     return;
            // }

            // const duplicateTitle = await query.query(conn, 
            //     "SELECT course_code, title FROM " + courses_tb + " " +
            //     "WHERE course_code = " + (course_code === '' ? "null" : "'" + course_code + "'") + 
            //         " OR title = '" + title + "';"
            // ).catch(console.log);

            // if (duplicateTitle && duplicateTitle.length > 0) {
            //     res.status(500);
            //     res.send("A duplicate/similarly titled course exists!");
            //     return;
            // }

            // await query.query(conn, 
            //     "INSERT INTO `" + courses_tb + "` (" +                     
            //         "`course_code`, " + 
            //         "`title`, " + 
            //         "`description`, " +                         
            //         "`is_available`, " +  
            //         "`user_id`" +                          
            //     ") VALUES (" +                     
            //         "'" + (course_code ? course_code : '') + "', " + 
            //         "'" + title + "', "+ 
            //         "'"+ (description ? description : '') + "', " +
            //         "1" + ", " +
            //         user_id +                         
            //     ");"
            // ).catch(console.log);

            // res.status(200).send("Course successfully added!");
        
    }

    res.end();
};

module.exports = addClass;