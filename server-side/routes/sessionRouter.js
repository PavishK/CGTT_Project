import express from 'express';
import { sessionCheck, SessionLogOut } from '../controllers/sessionController.js';


const route=express.Router();

route.get('/session-check',sessionCheck);
route.post('/session-log-out',SessionLogOut);

export default route;