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

    console.log("\n\n");
    console.log("Begin initializing database...");

    conn.query(
        "SELECT TABLE_NAME FROM information_schema.tables" +
        " WHERE table_schema = ? AND table_name = ?", [databaseName, user_accounts_tb], 
        (error, results, fields) => {	
            if (results && results.length <= 0) {

                console.log("\n");
                console.log(user_accounts_tb + " (table): creating table if it doesn't exist...");
                
                conn.query(
                    "CREATE TABLE IF NOT EXISTS `" + user_accounts_tb + "` ("+
                        "`user_id` int(11) NOT NULL DEFAULT 1, " + 
                        "`member_id` varchar(255) NULL, " + 
                        "`username` varchar(255) NOT NULL, " + 
                        "`password` varchar(255) NOT NULL, " + 
                        "`email` varchar(100) NOT NULL, " +                         
                        "`name` varchar(255) NULL, " +        
                        "`session_id` nvarchar(256) DEFAULT 0"+
                    ") ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;"
                );

                console.log("\n");
                console.log(user_accounts_tb + " (table): adding user_id as primary key...");

                conn.query(
                    "ALTER TABLE `" + user_accounts_tb + 
                    "` ADD PRIMARY KEY (`user_id`);"
                );

                console.log("\n");
                console.log(user_accounts_tb + " (table): setting user_id to NOT NULL and AUTO_INCREMENT...");

                conn.query(
                    "ALTER TABLE `" + user_accounts_tb + 
                    "` MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=1;"
                );

                console.log("\n");
                console.log(user_accounts_tb + " (table): making username case-sensitive...");

                conn.query(
                    "ALTER TABLE `" + user_accounts_tb + 
                    "` MODIFY `username` varchar(255) CHARACTER SET latin1 COLLATE latin1_general_cs;"
                );



                console.log("\n");
                console.log(user_permissions_tb + " (table): creating table if it doesn't exist...");

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

                console.log("\n");
                console.log(user_permissions_tb + " (table): adding perm_id as primary key...");

                conn.query(
                    "ALTER TABLE `" + user_permissions_tb + 
                    "` ADD PRIMARY KEY (`perm_id`);"
                );

                console.log("\n");
                console.log(user_permissions_tb + " (table): setting perm_id to NOT NULL and AUTO_INCREMENT...");

                conn.query(
                    "ALTER TABLE `" + user_permissions_tb + 
                    "` MODIFY `perm_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=1;"
                );

                console.log("\n");
                console.log(user_permissions_tb + " (table): adding `fk" + user_permissions_tb + "_" + user_accounts_tb + "_userid` as foreign key constraint...");

                conn.query(
                    "ALTER TABLE `" + user_permissions_tb + 
                    "` ADD CONSTRAINT `fk" + user_permissions_tb + "_" + user_accounts_tb + "_userid` " + 
                    "FOREIGN KEY (`user_id`) " +
                    "REFERENCES `" + user_accounts_tb + "`(`user_id`) ON UPDATE CASCADE;"
                );

                

                console.log("\n");
                console.log("Creating trigger to insert into " + user_permissions_tb + " table after there is an insert in the " + user_accounts_tb + " table..." );

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


                
                console.log("\n");
                console.log("Inserting first user " + firstUserName + " into the " + user_accounts_tb + " table...");

                conn.query(
                    "INSERT INTO `" + user_accounts_tb + "` (" +                     
                        "`username`, " +
                        "`password`, " +
                        "`email`, " +
                        "`name`, " +
                        "`session_id`" + 
                    ") VALUES (" +                     
                        "'" + firstUserName + "', "+ 
                        "'"+ firstUserPassword + "', "+ 
                        "'"+ firstUserEmail + "', "+ 
                        "'" + firstUserName + "', "+ 
                        "0 "+
                    ");"
                );

                console.log("\n");
                console.log("Setting permissions for " + firstUserName + " in the " + user_permissions_tb + " table...");

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
                
                console.log("\n");
                console.log("Inserting test user into the " + user_accounts_tb + " table...");

                conn.query(
                    "INSERT INTO `" + user_accounts_tb + "` (" +                     
                        "`username`, " + 
                        "`password`, " + 
                        "`email`, " +
                        "`name`, " +           
                        "`session_id`" + 
                    ") VALUES (" +                     
                        "'" + "ranmaru90" + "', "+ 
                        "'"+ bcrypt.hashSync("password", 10) + "', "+ 
                        "'"+ "oneseedfruit@gmail.com" + "', "+                     
                        "'"+ "Randy Tan" + "', "+    
                        "0 "+
                    ");"
                );

                console.log("Inserting test user into the " + user_accounts_tb + " table...");

                conn.query(
                    "INSERT INTO `" + user_accounts_tb + "` (" +                     
                        "`username`, " + 
                        "`password`, " + 
                        "`email`, " +
                        "`name`, " +
                        "`session_id`" + 
                    ") VALUES (" +                     
                        "'" + "chichiko90" + "', "+ 
                        "'"+ bcrypt.hashSync("password", 10) + "', "+ 
                        "'"+ "chichiko90@gmail.com" + "', "+                     
                        "'"+ "Charlene Andrew" + "', "+        
                        "0 "+
                    ");"
                );

                console.log("Inserting test user into the " + user_accounts_tb + " table...");

                conn.query(
                    "INSERT INTO `" + user_accounts_tb + "` (" +                     
                        "`username`, " + 
                        "`password`, " + 
                        "`email`, " +
                        "`name`, " +
                        "`session_id`" + 
                    ") VALUES (" +                     
                        "'" + "bbb" + "', "+ 
                        "'"+ bcrypt.hashSync("password", 10) + "', "+ 
                        "'"+ "bbb@bbb.bbb" + "', "+                     
                        "'"+ "Bbb Bbbbbbb" + "', "+        
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

                console.log("\n");
                console.log(courses_tb + " (table): creating table if it doesn't exist...");

                conn.query(
                    "CREATE TABLE IF NOT EXISTS `" + courses_tb + "` ("+
                        "`course_id` int(11) NOT NULL DEFAULT 1, " + 
                        "`course_code` varchar(255) NULL, " +
                        "`course_title` varchar(255) NULL, " +
                        "`course_description` mediumtext NULL, " + 
                        "`is_available` bool NOT NULL DEFAULT 1, " +  
                        "`user_id` int(11) NOT NULL" +
                    ") ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;"
                );

                console.log("\n");
                console.log(courses_tb + " (table): adding course_id as primary key...");

                conn.query(
                    "ALTER TABLE `" + courses_tb + 
                    "` ADD PRIMARY KEY (`course_id`);"
                );

                console.log("\n");
                console.log(courses_tb + " (table): setting course_id to NOT NULL and AUTO_INCREMENT...");

                conn.query(
                    "ALTER TABLE `" + courses_tb + 
                    "` MODIFY `course_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=1;"
                );

                console.log("\n");
                console.log(courses_tb + " (table): adding `fk" + courses_tb + "_" + user_accounts_tb + "_userid` as foreign key constraint...");

                conn.query(
                    "ALTER TABLE `" + courses_tb + 
                    "` ADD CONSTRAINT `fk" + courses_tb + "_" + user_accounts_tb + "_userid` " + 
                    "FOREIGN KEY (`user_id`) " +
                    "REFERENCES `" + user_accounts_tb + "`(`user_id`) ON UPDATE CASCADE;"
                );


                
                console.log("\n");
                console.log(courses_prereqs_tb + " (table): creating table if it doesn't exist...");

                conn.query(
                    "CREATE TABLE IF NOT EXISTS `" + courses_prereqs_tb + "` ("+
                        "`prereq_id` int(11) NOT NULL, " +
                        "`course_id` int(11) NOT NULL" + 
                    ") ENGINE=InnoDB DEFAULT CHARSET=utf8;"
                );

                console.log("\n");
                console.log(courses_prereqs_tb + " (table): adding `fk" + courses_prereqs_tb + "_prereqid_" + courses_tb + "_courseid` as foreign key constraint...");

                conn.query(
                    "ALTER TABLE `" + courses_prereqs_tb + 
                    "` ADD CONSTRAINT `fk" + courses_prereqs_tb + "_prereqid_" + courses_tb + "_courseid` " + 
                    "FOREIGN KEY (`prereq_id`) " +
                    "REFERENCES `" + courses_tb + "`(`course_id`) ON UPDATE CASCADE;"
                );

                console.log("\n");
                console.log(courses_prereqs_tb + " (table): adding `fk" + courses_prereqs_tb + "_courseid_" + courses_tb + "_courseid` as foreign key constraint...");

                conn.query(
                    "ALTER TABLE `" + courses_prereqs_tb + 
                    "` ADD CONSTRAINT `fk" + courses_prereqs_tb + "_courseid_" + courses_tb + "_courseid` " + 
                    "FOREIGN KEY (`course_id`) " +
                    "REFERENCES `" + courses_tb + "`(`course_id`) ON UPDATE CASCADE;"
                );


                
                console.log("\n");
                console.log(contents_tb + " (table): creating table if it doesn't exist...");

                conn.query(
                    "CREATE TABLE IF NOT EXISTS `" + contents_tb + "` ("+
                        "`content_id` int(11) NOT NULL, " + 
                        "`content` text NULL" +
                    ") ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;"
                );

                console.log("\n");
                console.log(contents_tb + " (table): adding content_id as primary key...");

                conn.query(
                    "ALTER TABLE `" + contents_tb + 
                    "` ADD PRIMARY KEY (`content_id`);"
                );

                console.log("\n");
                console.log(contents_tb + " (table): setting content_id to NOT NULL and AUTO_INCREMENT...");

                conn.query(
                    "ALTER TABLE `" + contents_tb + 
                    "` MODIFY `content_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=1;"
                );



                console.log("\n");
                console.log(class_sessions_tb + " (table): creating table if it doesn't exist...");

                conn.query(
                    "CREATE TABLE IF NOT EXISTS `" + class_sessions_tb + "` ("+
                        "`class_id` int(11) NOT NULL DEFAULT 1, " +                         
                        "`start_date` date NULL DEFAULT '1000-01-01', " +
                        "`end_date` date NULL DEFAULT '1000-01-01', " +
                        "`course_id` int(11) NOT NULL, " +
                        "`user_id` int(11) NOT NULL" +
                    ") ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;"
                );

                console.log("\n");
                console.log(class_sessions_tb + " (table): adding class_id as primary key...");

                conn.query(
                    "ALTER TABLE `" + class_sessions_tb + 
                    "` ADD PRIMARY KEY (`class_id`);"
                );

                console.log("\n");
                console.log(class_sessions_tb + " (table): setting class_id to NOT NULL and AUTO_INCREMENT...");

                conn.query(
                    "ALTER TABLE `" + class_sessions_tb + 
                    "` MODIFY `class_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=1;"
                );

                

                console.log("\n");
                console.log(class_sessions_tb + " (table): adding `fk" + class_sessions_tb + "_" + user_accounts_tb + "_userid` as foreign key constraint...");

                conn.query(
                    "ALTER TABLE `" + class_sessions_tb + 
                    "` ADD CONSTRAINT `fk" + class_sessions_tb + "_" + user_accounts_tb + "_userid` " + 
                    "FOREIGN KEY (`user_id`) " +
                    "REFERENCES `" + user_accounts_tb + "`(`user_id`) ON UPDATE CASCADE;"
                );

                console.log("\n");
                console.log(class_sessions_tb + " (table): adding `fk" + class_sessions_tb + "_" + courses_tb + "_courseid` as foreign key constraint...");

                conn.query(
                    "ALTER TABLE `" + class_sessions_tb + 
                    "` ADD CONSTRAINT `fk" + class_sessions_tb + "_" + courses_tb + "_courseid` " + 
                    "FOREIGN KEY (`course_id`) " +
                    "REFERENCES `" + courses_tb + "`(`course_id`) ON UPDATE CASCADE;"
                );



                conn.query(
                    "CREATE TABLE IF NOT EXISTS `" + class_sessions_info_tb + "` ("+
                        "`class_info_id` int(11) NOT NULL DEFAULT 1, " + 
                        "`class_id` int(11) NOT NULL DEFAULT 1, " + 
                        "`class_code` varchar(255) NULL, " + 
                        "`class_title` varchar(255) NULL, " +
                        "`class_description` mediumtext NULL" +                        
                    ") ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;"
                );
                conn.query(
                    "ALTER TABLE `" + class_sessions_info_tb + 
                    "` ADD PRIMARY KEY (`class_info_id`);"
                );
                conn.query(
                    "ALTER TABLE `" + class_sessions_info_tb + 
                    "` MODIFY `class_info_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=1;"
                );
                conn.query(
                    "ALTER TABLE `" + class_sessions_info_tb + 
                    "` ADD CONSTRAINT `fk" + class_sessions_info_tb + "_" + class_sessions_tb + "_classid` " + 
                    "FOREIGN KEY (`class_id`) " +
                    "REFERENCES `" + class_sessions_tb + "`(`class_id`) ON UPDATE CASCADE;"
                );



                conn.query(
                    "CREATE TRIGGER insert_classs_sessions_info " +
                    "AFTER INSERT ON " + class_sessions_tb + " FOR EACH ROW " +
                        "BEGIN " +                             
                            "INSERT INTO `" + class_sessions_info_tb + "` (" +                                 
                                "`class_code`, " +  
                                "`class_title`, " +
                                "`class_description`" +
                            ") VALUES ( '" +                                 
                                 "default class code" + "', '" +
                                 "Untitled" + "', '" +
                                "Default description." + "'" +
                            "); " + 
                            "UPDATE " + class_sessions_info_tb + " " +
                            "INNER JOIN " + class_sessions_tb + 
                            " ON (" + class_sessions_info_tb + ".class_info_id = " + 
                                class_sessions_tb + ".class_id) " +
                            "SET " + class_sessions_info_tb + ".class_id = " + 
                                class_sessions_tb + ".class_id; " +
                        "END; "
                );



                conn.query(
                    "CREATE TABLE IF NOT EXISTS `" + class_sessions_contents_tb + "` ("+
                        "`class_id` int(11) NOT NULL DEFAULT 1, " + 
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
                        "`class_id` int(11) NOT NULL DEFAULT 1" +                         
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
                        "`course_title`, " +
                        "`course_description`, " + 
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
                        "`course_title`, " +
                        "`course_description`, " + 
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
                conn.query(
                    "INSERT INTO `" + courses_tb + "` (" +                        
                        "`course_code`, " +
                        "`course_title`, " +
                        "`course_description`, " + 
                        "`is_available`, " +  
                        "`user_id`" +                        
                    ") VALUES (" +                     
                        "'" + "3XT1NCT" + "', " + 
                        "'Cooking With Dinosaurs', " + 
                        "'Our high standards are difficult to satisfy.', " +
                        "'0', "+
                        "'3'"+
                    ");"
                );
                conn.query(
                    "INSERT INTO `" + courses_tb + "` (" +                        
                        "`course_code`, " +
                        "`course_title`, " +
                        "`course_description`, " + 
                        "`is_available`, " +  
                        "`user_id`" +                        
                    ") VALUES (" +                     
                        "'" + "SICP666" + "', " + 
                        "'Structure and Interpretation of Computer Programs', " + 
                        "'For all its power, the computer is a harsh taskmaster. Its programs must be correct, and what we wish to say must be said accurately in every detail.', " +
                        "'0', "+
                        "'1'"+
                    ");"
                );


                conn.query(
                    "INSERT INTO `" + class_sessions_tb + "` (" +                     
                        "`start_date`, " +
                        "`end_date`, " +
                        "`course_id`, " +
                        "`user_id`" +                      
                    ") VALUES (" +                     
                        "'" + "2020-01-09" + "', " + 
                        "'" + "2020-01-16" +"', " + 
                        2 + ", " +
                        1 +                        
                    ");"
                );
                conn.query(
                    "INSERT INTO `" + class_sessions_tb + "` (" +                     
                        "`start_date`, " +
                        "`end_date`, " +
                        "`course_id`, " +
                        "`user_id`" +                      
                    ") VALUES (" +                     
                        "'" + "2020-01-01" + "', " + 
                        "'" + "2020-01-11" +"', " + 
                        1 + ", " +
                        2 +                        
                    ");"
                );
                conn.query(
                    "INSERT INTO `" + class_sessions_tb + "` (" +                     
                        "`start_date`, " +
                        "`end_date`, " +
                        "`course_id`, " +
                        "`user_id`" +                      
                    ") VALUES (" +                     
                        "'" + "2020-01-07" + "', " + 
                        "'" + "2020-01-31" +"', " + 
                        3 + ", " +
                        3 +          
                    ");"
                );
            }
    });
    console.log("Database initialization has been completed!");

    return conn;
}

module.exports = initdb;