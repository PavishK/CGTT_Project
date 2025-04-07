import express from 'express';
import { userRegistration, userLogin } from '../controllers/userController.js';

const route=express.Router();

route.post('/register',userRegistration);
route.post('/login',userLogin);

export default route;