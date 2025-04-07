import db from './dbConnection.js';

export const createUserTable=()=>{
    db.query(`
        CREATE TABLE IF NOT EXISTS users(
        _id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(225) NOT NULL,
        email VARCHAR(225) UNIQUE,
        password_hash VARCHAR(225) NOT NULL,
        phone_number INT(10),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `,(err,result)=>{
        if(err)
            console.log("Error creating user Table!");
        else
            console.log("User Table Created!");
    });

} 