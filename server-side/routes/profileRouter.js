import express from 'express';
import { getUserData, updateUserFullName } from '../controllers/profileController.js';

const router=express.Router();

router.post('/get-user-profile-data',getUserData);
router.put('/update-user-profile-data/:_id',updateUserFullName);

export default router;