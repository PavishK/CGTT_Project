import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import timestamp from './time_stamp.js';
//DB Handler
import db from './db/dbConnection.js'

import dotenv from 'dotenv';

dotenv.config();

const app=express();

app.use(cors({
    origin:'http://localhost:5173',
    credentials:true,
}));

app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(express.json());

const port=process.env.PORT;

app.get('/',(req,res)=>{
    res.send("<h1>Server is running... :)</h1>");
});

app.listen(port,()=>{
    timestamp(port);
});

//User Handeling

import userRouter from './routes/userRouter.js';
app.use('/api/user',userRouter);

//Session Handler

import sessionRouter from './routes/sessionRouter.js';
app.use('/api/protect',sessionRouter);

//Course Handeler

import courseHandler from './routes/courseRouter.js';
app.use('/api/course',courseHandler);

//Task Handler

import taskRouter from './routes/taskRouter.js'
app.use('/api/task',taskRouter);

//Admin Handler

import adminRouter from './routes/adminRouter.js';
app.use('/api/admin',adminRouter);

//Verify Handler

import verifyCRouter from './routes/verifyRouter.js';
app.use('/api/certificate',verifyCRouter);