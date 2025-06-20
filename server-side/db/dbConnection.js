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
    multipleStatements:true,
    ssl:{
        rejectUnauthorized:process.env.SSLSTATE=="true"?true:false,
    }
});

db.connect((err)=>{
    if(err){
        console.log("Error Connecting MySqL DataBase!");
        console.log(err);
    }
    else{
        console.log("\x1b[32m"+"MySqL DataBase Connected Successfully!"+"\x1b[0m");
        createUserTable();
    }
        
});


export default db;