const query = async (conn, q, params) => await new Promise(
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

query().then(() => {
    console.log("Promise resolved.");
})
.catch(() => {
    console.log("Promise rejected.");
});

module.exports = { query };