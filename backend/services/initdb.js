const mysql = require('mysql');
const bcrypt = require('bcrypt');

const databaseName = 'db';
const accountsTableName = 'accounts';
const firstUserName = 'admin';
const firstUserPassword = bcrypt.hashSync('admin', 10);
const firstUserEmail = 'admin@admin.com';

const initdb = () => {
    const conn = mysql.createConnection({
        host     : 'deerclops.sytes.net',
        port     :  3305,
        user     : 'randy',
        password : 'shaoxian',
        database : databaseName
    });

    conn.query("SELECT TABLE_NAME FROM information_schema.tables" +
              " WHERE table_schema = ? AND table_name = ?", 
              [databaseName, accountsTableName], 
        (error, results, fields) => {	
            if (results && results.length <= 0) {
                conn.query("CREATE TABLE IF NOT EXISTS `" + accountsTableName + "` ("+
                        "`id` int(11) NOT NULL, " + 
                        "`username` varchar(50) NOT NULL, " + 
                        "`password` varchar(255) NOT NULL, " + 
                        "`email` varchar(100) NOT NULL, " + 
                        "`type` int(11) NOT NULL, " +
                        "`sessionid` nvarchar(256) DEFAULT 0"+
                    ") ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;");
                conn.query("INSERT INTO `" + accountsTableName + "` (" + 
                        "`id`, " +
                        "`username`, " + 
                        "`password`, " + 
                        "`email`, " + 
                        "`type`, " + 
                        "`sessionid`" + 
                    ") VALUES (" + 
                        "1, " + 
                        "'" + firstUserName + "', "+ 
                        "'"+ firstUserPassword + "', "+ 
                        "'"+ firstUserEmail + "', "+ 
                        "0, " +
                        "0 "+
                    ");");
                conn.query("ALTER TABLE `" + accountsTableName + "` ADD PRIMARY KEY (`id`);");
                conn.query("ALTER TABLE `" + accountsTableName + "` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;");
            }
        });

    return conn;
}

module.exports = initdb;