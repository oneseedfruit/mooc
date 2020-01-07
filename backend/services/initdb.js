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
    const coursesTableName = "courses";
    const prereqsTableName = "prereqs";
    const classesTableName = "classes";
    const classesInfoTableName = "classesinfo";

    conn.query(
        "SELECT TABLE_NAME FROM information_schema.tables" +
        " WHERE table_schema = ? AND table_name = ?", [databaseName, accountsTableName], 
        (error, results, fields) => {	
            if (results && results.length <= 0) {
                conn.query(
                    "CREATE TABLE IF NOT EXISTS `" + accountsTableName + "` ("+
                        "`userid` int(11) NOT NULL DEFAULT 0, " + 
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
                        "`canManageUsers` bool NOT NULL DEFAULT 0, " +
                        "`canModerateUsers` bool NOT NULL DEFAULT 0, " +
                        "`canManageCourses` bool NOT NULL DEFAULT 0, " +
                        "`canManageOwnClasses` bool NOT NULL DEFAULT 0, " +
                        "`canManageAllClasses` bool NOT NULL DEFAULT 0, " +
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
                    "` ADD CONSTRAINT `fk" + permissionsTableName + "_" + accountsTableName + "_userid` " + 
                    "FOREIGN KEY (`userid`) " +
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
                        "'" + "ranmaru90" + "', "+ 
                        "'"+ bcrypt.hashSync("NotVerySecure", 10) + "', "+ 
                        "'"+ "oneseedfruit@gmail.com" + "', "+                     
                        "'"+ "Randy Tan" + "', "+    
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
                        "'" + "chichiko90" + "', "+ 
                        "'"+ bcrypt.hashSync("NotVerySecure", 10) + "', "+ 
                        "'"+ "chichiko90@gmail.com" + "', "+                     
                        "'"+ "Charlene Andrew" + "', "+        
                        "0 "+
                    ");"
                );

            }
        });
    
    conn.query(
        "SELECT TABLE_NAME FROM information_schema.tables" +
        " WHERE table_schema = ? AND table_name = ?", [databaseName, coursesTableName], 
        (error, results, fields) => {
            if (results && results.length <= 0) {
                conn.query(
                    "CREATE TABLE IF NOT EXISTS `" + coursesTableName + "` ("+
                        "`courseid` int(11) NOT NULL, " + 
                        "`title` varchar(50) NOT NULL, " +
                        "`description` mediumtext NOT NULL, " +                        
                        "`userid` int(11) NOT NULL" +
                    ") ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;"
                );

                conn.query(
                    "CREATE TABLE IF NOT EXISTS `" + prereqsTableName + "` ("+
                        "`prereqid` int(11) NOT NULL, " +
                        "`courseid` int(11) NOT NULL" + 
                    ") ENGINE=InnoDB DEFAULT CHARSET=utf8;"
                );

                conn.query(
                    "CREATE TABLE IF NOT EXISTS `" + classesTableName + "` ("+
                        "`classid` int(11) NOT NULL, " +                         
                        "`startdate` date NOT NULL, " +
                        "`enddate` date NOT NULL, " +
                        "`courseid` int(11) NOT NULL, " +
                        "`userid` int(11) NOT NULL" +
                    ") ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;"
                );

                conn.query(
                    "CREATE TABLE IF NOT EXISTS `" + classesInfoTableName + "` ("+
                        "`classid` int(11) NOT NULL, " + 
                        "`title` varchar(50) NOT NULL, " +
                        "`description` mediumtext NOT NULL" +                        
                    ") ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;"
                );

                conn.query(
                    "ALTER TABLE `" + coursesTableName + 
                    "` ADD PRIMARY KEY (`courseid`);"
                );
                conn.query(
                    "ALTER TABLE `" + coursesTableName + 
                    "` MODIFY `courseid` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=1;"
                );
                conn.query(
                    "ALTER TABLE `" + coursesTableName + 
                    "` ADD CONSTRAINT `fk" + coursesTableName + "_" + accountsTableName + "_userid` " + 
                    "FOREIGN KEY (`userid`) " +
                    "REFERENCES `" + accountsTableName + "`(`userid`) ON UPDATE CASCADE;"
                );


                conn.query(
                    "ALTER TABLE `" + prereqsTableName + 
                    "` ADD CONSTRAINT `fk" + prereqsTableName + "_prereqid_" + coursesTableName + "_courseid` " + 
                    "FOREIGN KEY (`prereqid`) " +
                    "REFERENCES `" + coursesTableName + "`(`courseid`) ON UPDATE CASCADE;"
                );
                conn.query(
                    "ALTER TABLE `" + prereqsTableName + 
                    "` ADD CONSTRAINT `fk" + prereqsTableName + "_courseid_" + coursesTableName + "_courseid` " + 
                    "FOREIGN KEY (`courseid`) " +
                    "REFERENCES `" + coursesTableName + "`(`courseid`) ON UPDATE CASCADE;"
                );


                conn.query(
                    "ALTER TABLE `" + classesTableName + 
                    "` ADD PRIMARY KEY (`classid`);"
                );
                conn.query(
                    "ALTER TABLE `" + classesTableName + 
                    "` MODIFY `classid` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=1;"
                );
                conn.query(
                    "ALTER TABLE `" + classesTableName + 
                    "` ADD CONSTRAINT `fk" + classesTableName + "_" + accountsTableName + "_userid` " + 
                    "FOREIGN KEY (`userid`) " +
                    "REFERENCES `" + accountsTableName + "`(`userid`) ON UPDATE CASCADE;"
                );
                conn.query(
                    "ALTER TABLE `" + classesTableName + 
                    "` ADD CONSTRAINT `fk" + classesTableName + "_" + coursesTableName + "_courseid` " + 
                    "FOREIGN KEY (`courseid`) " +
                    "REFERENCES `" + coursesTableName + "`(`courseid`) ON UPDATE CASCADE;"
                );

                
                conn.query(
                    "ALTER TABLE `" + classesInfoTableName + 
                    "` ADD CONSTRAINT `fk" + classesInfoTableName + "_" + classesTableName + "_classid` " + 
                    "FOREIGN KEY (`classid`) " +
                    "REFERENCES `" + classesTableName + "`(`classid`) ON UPDATE CASCADE;"
                );
            }
    });
    return conn;
}

module.exports = initdb;