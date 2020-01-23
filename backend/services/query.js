const query = async (conn, q, params) => {
    try {
        return await new Promise(
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
    }
    catch (e) {
        console.log("Promise rejected.");
    }
};

// query().then(() => {
//     console.log("Promise resolved.");
// })
// .catch(() => {
//     console.log("Promise rejected.");
// });

module.exports = { query };