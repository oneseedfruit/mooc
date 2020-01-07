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

    const user_accounts_tb = "user_accounts";
    const user_permissions_tb = "user_permissions";
    const courses_tb = "courses";
    const courses_prereqs_tb = "courses_prereqs";
    const contents_tb = "contents";
    const class_sessions_tb = "class_sessions";
    const class_sessions_info_tb = "class_sessions_info";
    const class_sessions_contents_tb = "class_sessions_contents";
    const class_sessions_regis_tb = "class_sessions_regis";

    conn.query(
        "SELECT TABLE_NAME FROM information_schema.tables" +
        " WHERE table_schema = ? AND table_name = ?", [databaseName, user_accounts_tb], 
        (error, results, fields) => {	
            if (results && results.length <= 0) {
                conn.query(
                    "CREATE TABLE IF NOT EXISTS `" + user_accounts_tb + "` ("+
                        "`userid` int(11) NOT NULL DEFAULT 1, " + 
                        "`username` varchar(255) NOT NULL, " + 
                        "`password` varchar(255) NOT NULL, " + 
                        "`email` varchar(100) NOT NULL, " +                         
                        "`name` varchar(255) NULL, " +        
                        "`sessionid` nvarchar(256) DEFAULT 0"+
                    ") ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;"
                );

                conn.query(
                    "CREATE TABLE IF NOT EXISTS `" + user_permissions_tb + "` ("+
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
                    "ALTER TABLE `" + user_accounts_tb + 
                    "` ADD PRIMARY KEY (`userid`);"
                );
                conn.query(
                    "ALTER TABLE `" + user_accounts_tb + 
                    "` MODIFY `userid` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=1;"
                );
                conn.query(
                    "ALTER TABLE `" + user_accounts_tb + 
                    "` MODIFY `username` varchar(255) CHARACTER SET latin1 COLLATE latin1_general_cs;"
                );
                

                conn.query(
                    "ALTER TABLE `" + user_permissions_tb + 
                    "` ADD PRIMARY KEY (`permid`);"
                );
                conn.query(
                    "ALTER TABLE `" + user_permissions_tb + 
                    "` MODIFY `permid` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=1;"
                );
                conn.query(
                    "ALTER TABLE `" + user_permissions_tb + 
                    "` ADD CONSTRAINT `fk" + user_permissions_tb + "_" + user_accounts_tb + "_userid` " + 
                    "FOREIGN KEY (`userid`) " +
                    "REFERENCES `" + user_accounts_tb + "`(`userid`) ON UPDATE CASCADE;"
                );


                conn.query(
                    "CREATE TRIGGER insert_permissions " +
                    "AFTER INSERT ON " + user_accounts_tb + " FOR EACH ROW " +
                        "BEGIN " +                             
                            "INSERT INTO `" + user_permissions_tb + "` (" +                                 
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
                            "UPDATE " + user_permissions_tb + " " +
                            "INNER JOIN " + user_accounts_tb + 
                            " ON (" + user_permissions_tb + ".permid = " + 
                                user_accounts_tb + ".userid) " +
                            "SET " + user_permissions_tb + ".userid = " + 
                                user_accounts_tb + ".userid; " +
                        "END; "
                );


                conn.query(
                    "INSERT INTO `" + user_accounts_tb + "` (" +                     
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
                    "UPDATE " + user_permissions_tb + " " +
                    "SET " + 
                        "canManageUsers = 1, "+
                        "canModerateUsers = 1, "+
                        "canManageCourses = 1, "+
                        "canManageOwnClasses = 1, "+
                        "canManageAllClasses = 1 "+
                    "WHERE userid = 1;"
                );                
                

                conn.query(
                    "INSERT INTO `" + user_accounts_tb + "` (" +                     
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
                    "INSERT INTO `" + user_accounts_tb + "` (" +                     
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
        " WHERE table_schema = ? AND table_name = ?", [databaseName, courses_tb], 
        (error, results, fields) => {
            if (results && results.length <= 0) {



                conn.query(
                    "CREATE TABLE IF NOT EXISTS `" + courses_tb + "` ("+
                        "`courseid` int(11) NOT NULL, " + 
                        "`title` varchar(255) NULL, " +
                        "`description` mediumtext NULL, " +                        
                        "`userid` int(11) NOT NULL" +
                    ") ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;"
                );
                conn.query(
                    "ALTER TABLE `" + courses_tb + 
                    "` ADD PRIMARY KEY (`courseid`);"
                );
                conn.query(
                    "ALTER TABLE `" + courses_tb + 
                    "` MODIFY `courseid` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=1;"
                );
                conn.query(
                    "ALTER TABLE `" + courses_tb + 
                    "` ADD CONSTRAINT `fk" + courses_tb + "_" + user_accounts_tb + "_userid` " + 
                    "FOREIGN KEY (`userid`) " +
                    "REFERENCES `" + user_accounts_tb + "`(`userid`) ON UPDATE CASCADE;"
                );



                conn.query(
                    "CREATE TABLE IF NOT EXISTS `" + courses_prereqs_tb + "` ("+
                        "`prereqid` int(11) NOT NULL, " +
                        "`courseid` int(11) NOT NULL" + 
                    ") ENGINE=InnoDB DEFAULT CHARSET=utf8;"
                );
                conn.query(
                    "ALTER TABLE `" + courses_prereqs_tb + 
                    "` ADD CONSTRAINT `fk" + courses_prereqs_tb + "_prereqid_" + courses_tb + "_courseid` " + 
                    "FOREIGN KEY (`prereqid`) " +
                    "REFERENCES `" + courses_tb + "`(`courseid`) ON UPDATE CASCADE;"
                );
                conn.query(
                    "ALTER TABLE `" + courses_prereqs_tb + 
                    "` ADD CONSTRAINT `fk" + courses_prereqs_tb + "_courseid_" + courses_tb + "_courseid` " + 
                    "FOREIGN KEY (`courseid`) " +
                    "REFERENCES `" + courses_tb + "`(`courseid`) ON UPDATE CASCADE;"
                );



                conn.query(
                    "CREATE TABLE IF NOT EXISTS `" + contents_tb + "` ("+
                        "`contentid` int(11) NOT NULL, " + 
                        "`content` text NULL" +
                    ") ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;"
                );
                conn.query(
                    "ALTER TABLE `" + contents_tb + 
                    "` ADD PRIMARY KEY (`contentid`);"
                );
                conn.query(
                    "ALTER TABLE `" + contents_tb + 
                    "` MODIFY `contentid` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=1;"
                );



                conn.query(
                    "CREATE TABLE IF NOT EXISTS `" + class_sessions_tb + "` ("+
                        "`classid` int(11) NOT NULL, " +                         
                        "`startdate` date NULL, " +
                        "`enddate` date NULL, " +
                        "`courseid` int(11) NOT NULL, " +
                        "`userid` int(11) NOT NULL" +
                    ") ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;"
                );
                conn.query(
                    "ALTER TABLE `" + class_sessions_tb + 
                    "` ADD PRIMARY KEY (`classid`);"
                );
                conn.query(
                    "ALTER TABLE `" + class_sessions_tb + 
                    "` MODIFY `classid` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=1;"
                );
                conn.query(
                    "ALTER TABLE `" + class_sessions_tb + 
                    "` ADD CONSTRAINT `fk" + class_sessions_tb + "_" + user_accounts_tb + "_userid` " + 
                    "FOREIGN KEY (`userid`) " +
                    "REFERENCES `" + user_accounts_tb + "`(`userid`) ON UPDATE CASCADE;"
                );
                conn.query(
                    "ALTER TABLE `" + class_sessions_tb + 
                    "` ADD CONSTRAINT `fk" + class_sessions_tb + "_" + courses_tb + "_courseid` " + 
                    "FOREIGN KEY (`courseid`) " +
                    "REFERENCES `" + courses_tb + "`(`courseid`) ON UPDATE CASCADE;"
                );



                conn.query(
                    "CREATE TABLE IF NOT EXISTS `" + class_sessions_info_tb + "` ("+
                        "`classid` int(11) NOT NULL, " + 
                        "`title` varchar(255) NULL, " +
                        "`description` mediumtext NULL" +                        
                    ") ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;"
                );
                conn.query(
                    "ALTER TABLE `" + class_sessions_info_tb + 
                    "` ADD CONSTRAINT `fk" + class_sessions_info_tb + "_" + class_sessions_tb + "_classid` " + 
                    "FOREIGN KEY (`classid`) " +
                    "REFERENCES `" + class_sessions_tb + "`(`classid`) ON UPDATE CASCADE;"
                );



                conn.query(
                    "CREATE TABLE IF NOT EXISTS `" + class_sessions_contents_tb + "` ("+
                        "`classid` int(11) NOT NULL, " + 
                        "`contentid` int(11) NOT NULL" +                      
                    ") ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;"
                );
                conn.query(
                    "ALTER TABLE `" + class_sessions_contents_tb + 
                    "` ADD CONSTRAINT `fk" + class_sessions_contents_tb + "_" + contents_tb + "_contentid` " + 
                    "FOREIGN KEY (`contentid`) " +
                    "REFERENCES `" + contents_tb + "`(`contentid`) ON UPDATE CASCADE;"
                );
                conn.query(
                    "ALTER TABLE `" + class_sessions_contents_tb + 
                    "` ADD CONSTRAINT `fk" + class_sessions_contents_tb + "_" + class_sessions_tb + "_classid` " + 
                    "FOREIGN KEY (`classid`) " +
                    "REFERENCES `" + class_sessions_tb + "`(`classid`) ON UPDATE CASCADE;"
                );



                conn.query(
                    "CREATE TABLE IF NOT EXISTS `" + class_sessions_regis_tb + "` ("+
                        "`userid` int(11) NOT NULL, " + 
                        "`classid` int(11) NOT NULL" +                         
                    ") ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;"
                );
                conn.query(
                    "ALTER TABLE `" + class_sessions_regis_tb + 
                    "` ADD CONSTRAINT `fk" + class_sessions_regis_tb + "_" + user_accounts_tb + "_userid` " + 
                    "FOREIGN KEY (`userid`) " +
                    "REFERENCES `" + user_accounts_tb + "`(`userid`) ON UPDATE CASCADE;"
                );
                conn.query(
                    "ALTER TABLE `" + class_sessions_regis_tb + 
                    "` ADD CONSTRAINT `fk" + class_sessions_regis_tb + "_" + class_sessions_tb + "_classid` " + 
                    "FOREIGN KEY (`classid`) " +
                    "REFERENCES `" + class_sessions_tb + "`(`classid`) ON UPDATE CASCADE;"
                );


            }
    });
    return conn;
}

module.exports = initdb;