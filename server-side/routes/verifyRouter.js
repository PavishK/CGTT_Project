import express from 'express';
import { verifyCertificate } from '../controllers/verifyController.js';

const router=express.Router();

router.get('/verify-certificate/:cid',verifyCertificate);

export default router;