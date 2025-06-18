import express from 'express';
import { userRegistration, userLogin, resetPassword } from '../controllers/userController.js';

const route=express.Router();

route.post('/register',userRegistration);
route.post('/login',userLogin);

route.post('/reset-user-password',resetPassword);


export default route;