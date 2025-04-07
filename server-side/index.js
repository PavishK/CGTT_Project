import express from 'express';
import cors from 'cors';

//DB Handler
import db from './db/dbConnection.js'

import dotenv from 'dotenv';

dotenv.config();

const app=express();
app.use(cors());
app.use(express.json());

const port=process.env.PORT;

app.get('/',(req,res)=>{
    res.send("<h1>Server is running... :)</h1>");
});

app.listen(port,()=>{
    console.log("Server is running on http://localhost:"+port);
});

//User Handeling

import userRouter from './routes/userRouter.js';
app.use('/api/user',userRouter);