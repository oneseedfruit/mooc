const query = require('./query');

const listCourses = async (req, res, next, conn, courses_tb) => {
    const data = await query.query(conn,
            "SELECT * FROM " + courses_tb + ";"
        ).catch(console.log);

    if (data)
        res.status(200).send(data);
};

module.exports = listCourses;