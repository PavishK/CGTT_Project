import db from './dbConnection.js';

export const createUserTable=()=>{

    // User Table

    db.query(`
        CREATE TABLE IF NOT EXISTS users(
        _id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(225) NOT NULL,
        email VARCHAR(225) UNIQUE,
        role ENUM('user','admin') DEFAULT 'user',
        password_hash VARCHAR(225) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `,(err,result)=>{
        if(err)
            console.log("Error creating user Table!");
        else
            console.log("User Table Created!");
    });

    //Courses table

    db.query(`
        CREATE TABLE IF NOT EXISTS courses (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(100),
        image_url TEXT,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`,(err,result)=>{
            if(err)
                console.log("Unable to create Courses table.");
            else
                console.log("Courses table created successfully!");
        });

        db.query(`
            CREATE TABLE IF NOT EXISTS enrollments (
                id INT PRIMARY KEY AUTO_INCREMENT,
                user_id INT,
                course_id INT,
                enrollment_status BOOLEAN DEFAULT FALSE,
                enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                course_completed BOOLEAN DEFAULT FALSE,
                completed_at TIMESTAMP DEFAULT NULL,
                UNIQUE (user_id, course_id),
                FOREIGN KEY (user_id) REFERENCES users(_id),
                FOREIGN KEY (course_id) REFERENCES courses(id)
            );
        `, (err, result) => {
            if (err)
                console.log("Unable to create Enrolled table!");
            else
                console.log("Enrollments table created successfully!");
        });

                db.query(`
            CREATE TABLE IF NOT EXISTS tasks (
                id INT PRIMARY KEY AUTO_INCREMENT,
                course_id INT,
                title VARCHAR(100),
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (course_id) REFERENCES courses(id)
            );
        `, (err, result) => {
            if (err)
                console.log("Unable to create Tasks table!");
            else
                console.log("Tasks table created successfully!");
        });

        db.query(`
            CREATE TABLE IF NOT EXISTS certificates (
            ref INT PRIMARY KEY AUTO_INCREMENT,
            user_id INT,
            course_id INT,
            enrollment_id INT,
            is_valid BOOLEAN DEFAULT TRUE,
            issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            cid VARCHAR(25) UNIQUE, 
            FOREIGN KEY (user_id) REFERENCES users(_id),
            FOREIGN KEY (course_id) REFERENCES courses(id),
            FOREIGN KEY (enrollment_id) REFERENCES enrollments(id)
            );
            `,(err,result)=>{
            if (err)
                console.log("Unable to create Certificates table!");
            else
                console.log("Certificates table created successfully!");
            });
} 
