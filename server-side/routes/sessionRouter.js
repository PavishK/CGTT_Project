import express from 'express';
import { sessionCheck } from '../controllers/sessionController.js';


const route=express.Router();

route.get('/session-check',sessionCheck);

export default route;