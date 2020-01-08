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
                        "`user_id` int(11) NOT NULL DEFAULT 1, " + 
                        "`member_id` varchar(255) NULL, " + 
                        "`username` varchar(255) NOT NULL, " + 
                        "`password` varchar(255) NOT NULL, " + 
                        "`email` varchar(100) NOT NULL, " +                         
                        "`name` varchar(255) NULL, " +        
                        "`sessionid` nvarchar(256) DEFAULT 0"+
                    ") ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;"
                );
                conn.query(
                    "ALTER TABLE `" + user_accounts_tb + 
                    "` ADD PRIMARY KEY (`user_id`);"
                );
                conn.query(
                    "ALTER TABLE `" + user_accounts_tb + 
                    "` MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=1;"
                );
                conn.query(
                    "ALTER TABLE `" + user_accounts_tb + 
                    "` MODIFY `username` varchar(255) CHARACTER SET latin1 COLLATE latin1_general_cs;"
                );



                conn.query(
                    "CREATE TABLE IF NOT EXISTS `" + user_permissions_tb + "` ("+
                        "`perm_id` int(11) NOT NULL, " + 
                        "`can_manage_users` bool NOT NULL DEFAULT 0, " +
                        "`can_moderate_users` bool NOT NULL DEFAULT 0, " +
                        "`can_manage_own_courses` bool NOT NULL DEFAULT 0, " +
                        "`can_manage_all_courses` bool NOT NULL DEFAULT 0, " +
                        "`can_manage_own_classes` bool NOT NULL DEFAULT 0, " +
                        "`can_manage_all_classes` bool NOT NULL DEFAULT 0, " +
                        "`user_id` int(11) NOT NULL DEFAULT 1" + 
                    ") ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;"
                );
                conn.query(
                    "ALTER TABLE `" + user_permissions_tb + 
                    "` ADD PRIMARY KEY (`perm_id`);"
                );
                conn.query(
                    "ALTER TABLE `" + user_permissions_tb + 
                    "` MODIFY `perm_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=1;"
                );
                conn.query(
                    "ALTER TABLE `" + user_permissions_tb + 
                    "` ADD CONSTRAINT `fk" + user_permissions_tb + "_" + user_accounts_tb + "_userid` " + 
                    "FOREIGN KEY (`user_id`) " +
                    "REFERENCES `" + user_accounts_tb + "`(`user_id`) ON UPDATE CASCADE;"
                );



                conn.query(
                    "CREATE TRIGGER insert_permissions " +
                    "AFTER INSERT ON " + user_accounts_tb + " FOR EACH ROW " +
                        "BEGIN " +                             
                            "INSERT INTO `" + user_permissions_tb + "` (" +                                 
                                "`can_manage_users`, " +  
                                "`can_moderate_users`, " +
                                "`can_manage_own_courses`,  " +
                                "`can_manage_all_courses`,  " +
                                "`can_manage_own_classes`, " +
                                "`can_manage_all_classes` " +
                            ") VALUES (" +                                 
                                "0, "+
                                "0, "+
                                "0, "+
                                "0, "+
                                "0, "+
                                "0 "+
                            "); " +
                            "UPDATE " + user_permissions_tb + " " +
                            "INNER JOIN " + user_accounts_tb + 
                            " ON (" + user_permissions_tb + ".perm_id = " + 
                                user_accounts_tb + ".user_id) " +
                            "SET " + user_permissions_tb + ".user_id = " + 
                                user_accounts_tb + ".user_id; " +
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
                        "can_manage_users = 1, "+
                        "can_moderate_users = 1, "+
                        "can_manage_own_courses = 1, "+
                        "can_manage_all_courses = 1, "+
                        "can_manage_own_classes = 1, "+
                        "can_manage_all_classes = 1 "+
                    "WHERE user_id = 1;"
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
                        "`course_id` int(11) NOT NULL, " + 
                        "`course_code` varchar(255) NULL, " +
                        "`title` varchar(255) NULL, " +
                        "`description` mediumtext NULL, " + 
                        "`is_available` bool NOT NULL DEFAULT 1, " +  
                        "`user_id` int(11) NOT NULL" +
                    ") ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;"
                );
                conn.query(
                    "ALTER TABLE `" + courses_tb + 
                    "` ADD PRIMARY KEY (`course_id`);"
                );
                conn.query(
                    "ALTER TABLE `" + courses_tb + 
                    "` MODIFY `course_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=1;"
                );
                conn.query(
                    "ALTER TABLE `" + courses_tb + 
                    "` ADD CONSTRAINT `fk" + courses_tb + "_" + user_accounts_tb + "_userid` " + 
                    "FOREIGN KEY (`user_id`) " +
                    "REFERENCES `" + user_accounts_tb + "`(`user_id`) ON UPDATE CASCADE;"
                );



                conn.query(
                    "CREATE TABLE IF NOT EXISTS `" + courses_prereqs_tb + "` ("+
                        "`prereq_id` int(11) NOT NULL, " +
                        "`course_id` int(11) NOT NULL" + 
                    ") ENGINE=InnoDB DEFAULT CHARSET=utf8;"
                );
                conn.query(
                    "ALTER TABLE `" + courses_prereqs_tb + 
                    "` ADD CONSTRAINT `fk" + courses_prereqs_tb + "_prereqid_" + courses_tb + "_courseid` " + 
                    "FOREIGN KEY (`prereq_id`) " +
                    "REFERENCES `" + courses_tb + "`(`course_id`) ON UPDATE CASCADE;"
                );
                conn.query(
                    "ALTER TABLE `" + courses_prereqs_tb + 
                    "` ADD CONSTRAINT `fk" + courses_prereqs_tb + "_courseid_" + courses_tb + "_courseid` " + 
                    "FOREIGN KEY (`course_id`) " +
                    "REFERENCES `" + courses_tb + "`(`course_id`) ON UPDATE CASCADE;"
                );



                conn.query(
                    "CREATE TABLE IF NOT EXISTS `" + contents_tb + "` ("+
                        "`content_id` int(11) NOT NULL, " + 
                        "`content` text NULL" +
                    ") ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;"
                );
                conn.query(
                    "ALTER TABLE `" + contents_tb + 
                    "` ADD PRIMARY KEY (`content_id`);"
                );
                conn.query(
                    "ALTER TABLE `" + contents_tb + 
                    "` MODIFY `content_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=1;"
                );



                conn.query(
                    "CREATE TABLE IF NOT EXISTS `" + class_sessions_tb + "` ("+
                        "`class_id` int(11) NOT NULL, " +                         
                        "`start_date` date NULL, " +
                        "`end_date` date NULL, " +
                        "`course_id` int(11) NOT NULL, " +
                        "`user_id` int(11) NOT NULL" +
                    ") ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;"
                );
                conn.query(
                    "ALTER TABLE `" + class_sessions_tb + 
                    "` ADD PRIMARY KEY (`class_id`);"
                );
                conn.query(
                    "ALTER TABLE `" + class_sessions_tb + 
                    "` MODIFY `class_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=1;"
                );
                conn.query(
                    "ALTER TABLE `" + class_sessions_tb + 
                    "` ADD CONSTRAINT `fk" + class_sessions_tb + "_" + user_accounts_tb + "_userid` " + 
                    "FOREIGN KEY (`user_id`) " +
                    "REFERENCES `" + user_accounts_tb + "`(`user_id`) ON UPDATE CASCADE;"
                );
                conn.query(
                    "ALTER TABLE `" + class_sessions_tb + 
                    "` ADD CONSTRAINT `fk" + class_sessions_tb + "_" + courses_tb + "_courseid` " + 
                    "FOREIGN KEY (`course_id`) " +
                    "REFERENCES `" + courses_tb + "`(`course_id`) ON UPDATE CASCADE;"
                );



                conn.query(
                    "CREATE TABLE IF NOT EXISTS `" + class_sessions_info_tb + "` ("+
                        "`class_id` int(11) NOT NULL, " + 
                        "`class_code` varchar(255) NULL, " + 
                        "`title` varchar(255) NULL, " +
                        "`description` mediumtext NULL" +                        
                    ") ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;"
                );
                conn.query(
                    "ALTER TABLE `" + class_sessions_info_tb + 
                    "` ADD CONSTRAINT `fk" + class_sessions_info_tb + "_" + class_sessions_tb + "_classid` " + 
                    "FOREIGN KEY (`class_id`) " +
                    "REFERENCES `" + class_sessions_tb + "`(`class_id`) ON UPDATE CASCADE;"
                );



                conn.query(
                    "CREATE TABLE IF NOT EXISTS `" + class_sessions_contents_tb + "` ("+
                        "`class_id` int(11) NOT NULL, " + 
                        "`content_id` int(11) NOT NULL" +                      
                    ") ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;"
                );
                conn.query(
                    "ALTER TABLE `" + class_sessions_contents_tb + 
                    "` ADD CONSTRAINT `fk" + class_sessions_contents_tb + "_" + contents_tb + "_contentid` " + 
                    "FOREIGN KEY (`content_id`) " +
                    "REFERENCES `" + contents_tb + "`(`content_id`) ON UPDATE CASCADE;"
                );
                conn.query(
                    "ALTER TABLE `" + class_sessions_contents_tb + 
                    "` ADD CONSTRAINT `fk" + class_sessions_contents_tb + "_" + class_sessions_tb + "_classid` " + 
                    "FOREIGN KEY (`class_id`) " +
                    "REFERENCES `" + class_sessions_tb + "`(`class_id`) ON UPDATE CASCADE;"
                );



                conn.query(
                    "CREATE TABLE IF NOT EXISTS `" + class_sessions_regis_tb + "` ("+
                        "`user_id` int(11) NOT NULL, " + 
                        "`class_id` int(11) NOT NULL" +                         
                    ") ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;"
                );
                conn.query(
                    "ALTER TABLE `" + class_sessions_regis_tb + 
                    "` ADD CONSTRAINT `fk" + class_sessions_regis_tb + "_" + user_accounts_tb + "_userid` " + 
                    "FOREIGN KEY (`user_id`) " +
                    "REFERENCES `" + user_accounts_tb + "`(`user_id`) ON UPDATE CASCADE;"
                );
                conn.query(
                    "ALTER TABLE `" + class_sessions_regis_tb + 
                    "` ADD CONSTRAINT `fk" + class_sessions_regis_tb + "_" + class_sessions_tb + "_classid` " + 
                    "FOREIGN KEY (`class_id`) " +
                    "REFERENCES `" + class_sessions_tb + "`(`class_id`) ON UPDATE CASCADE;"
                );


                conn.query(
                    "INSERT INTO `" + courses_tb + "` (" +                        
                        "`course_code`, " +
                        "`title`, " +
                        "`description`, " + 
                        "`is_available`, " +                  
                        "`user_id`" +
                    ") VALUES (" +                     
                        "'" + "SCSD2523" + "', " + 
                        "'Database', " + 
                        "'Counter-action rising! Are you ready for the punchline?!!', " +          
                        "'1', "+
                        "'1'"+
                    ");"
                );
                conn.query(
                    "INSERT INTO `" + courses_tb + "` (" +                        
                        "`course_code`, " +
                        "`title`, " +
                        "`description`, " + 
                        "`is_available`, " +  
                        "`user_id`" +                        
                    ") VALUES (" +                     
                        "'" + "SCSJ1023" + "', " + 
                        "'Programming Techniques II', " + 
                        "'See plus plus? See plus plus!! OOP!!', " +
                        "'0', "+
                        "'2'"+
                    ");"
                );
            }
    });
    return conn;
}

module.exports = initdb;