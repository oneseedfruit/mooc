const mysql = require("mysql");
const bcrypt = require("bcrypt");

const databaseName = "db";
const firstUserName = "admin";
const firstUserPassword = bcrypt.hashSync("admin", 10);
const firstUserEmail = "admin@admin.com";

const initdb = () => {
    const conn = mysql.createConnection({
        host     : "deerclops.sytes.net",
        port     :  3305,
        user     : "randy",
        password : "shaoxian",
        database : databaseName
    });

    const accountsTableName = "accounts";
    const permissionsTableName = "permissions";

    conn.query(
        "SELECT TABLE_NAME FROM information_schema.tables" +
        " WHERE table_schema = ? AND table_name = ?", [databaseName, accountsTableName], 
        (error, results, fields) => {	
            if (results && results.length <= 0) {

                conn.query(
                    "CREATE TABLE IF NOT EXISTS `" + accountsTableName + "` ("+
                        "`userid` int(11) NOT NULL, " + 
                        "`username` varchar(50) NOT NULL, " + 
                        "`password` varchar(255) NOT NULL, " + 
                        "`email` varchar(100) NOT NULL, " +                         
                        "`name` varchar(100) NOT NULL, " +        
                        "`sessionid` nvarchar(256) DEFAULT 0"+
                    ") ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;"
                );

                conn.query(
                    "CREATE TABLE IF NOT EXISTS `" + permissionsTableName + "` ("+
                        "`permid` int(11) NOT NULL, " + 
                        "`canManageUsers` bool NOT NULL, " +
                        "`canModerateUsers` bool NOT NULL, " +
                        "`canManageCourses` bool NOT NULL, " +
                        "`canManageOwnClasses` bool NOT NULL, " +
                        "`canManageAllClasses` bool NOT NULL, " +
                        "`userid` int(11) NOT NULL DEFAULT 1" + 
                    ") ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;"
                );

                conn.query(
                    "ALTER TABLE `" + accountsTableName + 
                    "` ADD PRIMARY KEY (`userid`);"
                );
                conn.query(
                    "ALTER TABLE `" + accountsTableName + 
                    "` MODIFY `userid` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=1;"
                );
                conn.query(
                    "ALTER TABLE `" + accountsTableName + 
                    "` MODIFY `username` VARCHAR(255) CHARACTER SET latin1 COLLATE latin1_general_cs;"
                );
                
                conn.query(
                    "ALTER TABLE `" + permissionsTableName + 
                    "` ADD PRIMARY KEY (`permid`);"
                );
                conn.query(
                    "ALTER TABLE `" + permissionsTableName + 
                    "` MODIFY `permid` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=1;"
                );
                conn.query(
                    "ALTER TABLE `" + permissionsTableName + 
                    "` ADD FOREIGN KEY (`userid`) " +
                    "REFERENCES `" + accountsTableName + "`(`userid`) ON UPDATE CASCADE;"
                );

                conn.query(
                    "CREATE TRIGGER insert_permissions " +
                    "AFTER INSERT ON " + accountsTableName + " FOR EACH ROW " +
                        "BEGIN " +                             
                            "INSERT INTO `" + permissionsTableName + "` (" +                                 
                                "`canManageUsers`, " +  
                                "`canModerateUsers`, " +
                                "`canManageCourses`,  " +
                                "`canManageOwnClasses`, " +
                                "`canManageAllClasses` " +
                            ") VALUES (" +                                 
                                "0, "+
                                "0, "+
                                "0, "+
                                "0, "+
                                "0 "+
                            "); " +
                            "UPDATE " + permissionsTableName + " " +
                            "INNER JOIN " + accountsTableName + 
                            " ON (" + permissionsTableName + ".permid = " + 
                                accountsTableName + ".userid) " +
                            "SET " + permissionsTableName + ".userid = " + 
                                accountsTableName + ".userid; " +
                        "END; "
                );

                conn.query(
                    "INSERT INTO `" + accountsTableName + "` (" +                     
                        "`username`, " +
                        "`password`, " +
                        "`email`, " +
                        "`name`, " +
                        "`sessionid`" + 
                    ") VALUES (" +                     
                        "'" + firstUserName + "', "+ 
                        "'"+ firstUserPassword + "', "+ 
                        "'"+ firstUserEmail + "', "+ 
                        "'" + firstUserName + "', "+ 
                        "0 "+
                    ");"
                );
                conn.query(
                    "UPDATE " + permissionsTableName + " " +
                    "SET " + 
                        "canManageUsers = 1, "+
                        "canModerateUsers = 1, "+
                        "canManageCourses = 1, "+
                        "canManageOwnClasses = 1, "+
                        "canManageAllClasses = 1 "+
                    "WHERE userid = 1;"
                );                
                
                conn.query(
                    "INSERT INTO `" + accountsTableName + "` (" +                     
                        "`username`, " + 
                        "`password`, " + 
                        "`email`, " +
                        "`name`, " +           
                        "`sessionid`" + 
                    ") VALUES (" +                     
                        "'" + "blergh" + "', "+ 
                        "'"+ "blergh" + "', "+ 
                        "'"+ "blergh" + "', "+                     
                        "'"+ "blergh" + "', "+    
                        "0 "+
                    ");"
                );

                conn.query(
                    "INSERT INTO `" + accountsTableName + "` (" +                     
                        "`username`, " + 
                        "`password`, " + 
                        "`email`, " +
                        "`name`, " +
                        "`sessionid`" + 
                    ") VALUES (" +                     
                        "'" + "flergh" + "', "+ 
                        "'"+ "flergh" + "', "+ 
                        "'"+ "flergh" + "', "+                     
                        "'"+ "flergh" + "', "+        
                        "0 "+
                    ");"
                );

            }
        });

    return conn;
}

module.exports = initdb;