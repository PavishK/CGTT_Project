import mysql from 'mysql2';
import { createUserTable } from './tableCreation.js';

import dotenv from 'dotenv';

dotenv.config();

const db=mysql.createConnection({
    host:process.env.HOST,
    user:process.env.USER,
    password:process.env.PASSWORD,
    database:process.env.DATABASE,
    port:process.env.DBPORT,
});

db.connect((err)=>{
    if(err)
        console.log("Error Connecting MySqL DataBase!");
    else{
        console.log("MySqL DataBase Connected Successfully!");
        createUserTable();
    }
        
});


export default db;