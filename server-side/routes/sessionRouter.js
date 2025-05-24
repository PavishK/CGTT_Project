import express from 'express';
import { sessionCheck, SessionLogOut, roleAuth } from '../controllers/sessionController.js';


const route=express.Router();

route.get('/session-check',sessionCheck);
route.post('/session-log-out',SessionLogOut);
route.post('/role-auth',roleAuth);

export default route;