const query = async (conn, q, params) => new Promise(
    (resolve, reject) => {
        const handler = (error, result) => {
            if (error) {
            reject(error);
            return;
        }
        resolve(result);
    }
    conn.query(q, params, handler);
});

module.exports = { query };