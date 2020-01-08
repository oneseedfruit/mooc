const query = require('./query');

const updateCourse = async (req, res, next, conn, courses_tb, user_permissions_tb) => {       
    if (req.body.user_id != null)  {
        const data = await query.query(conn, 
            'SELECT c.user_id, p.can_manage_own_courses, p.can_manage_all_courses ' +
            'FROM ' + courses_tb + ' c ' +
            'JOIN ' + user_permissions_tb + ' p ON c.user_id = p.perm_id ' +       
            'WHERE c.user_id = ' + req.body.user_id + ' ' +  
            '; '
        ).catch(console.log);

        if (data && data.length > 0 && (data[0].user_id === req.body.user_id)) {            
            if (req.body.course_id !== null && 
                (req.body.isChecked === 0 || req.body.isChecked === 1) && 
                req.body.isChecked != null) {
                
                let andUserId = 'AND user_id = ' + req.body.user_id;
                if (data[0].can_manage_all_courses === 1)
                    andUserId = '';
            
                if (data[0].can_manage_own_courses === 1 || data[0].can_manage_all_courses === 1)
                {
                    await query.query(conn, 
                            'UPDATE ' + courses_tb + ' ' +
                            'SET is_available = ' + req.body.isChecked + ' ' +
                            'WHERE course_id = ' + req.body.course_id + ' ' +
                            andUserId +
                            '; '
                        ).catch(console.log);
                    
                    res.status(200);
                    res.send(`The change is successfully saved!`);
                }
            }    
        }
        else {
            res.status(401);
            res.send(`You are not authroized to make this change!`);		
        }
    }

    res.end();
};

module.exports = updateCourse;