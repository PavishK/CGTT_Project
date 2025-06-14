import express from 'express';
import { changeUserPassword, checkValidPassword, deleteUserData, generateOTPForCP, getUserData, updateUserFullName } from '../controllers/profileController.js';

const router=express.Router();

router.post('/get-user-profile-data',getUserData);
router.put('/update-user-profile-data/:_id',updateUserFullName);
router.post('/delete-user-data',deleteUserData);

router.post("/check-password-valid",checkValidPassword);

router.post("/change-password-otp",generateOTPForCP);
router.put('/change-user-password/:_id',changeUserPassword);

export default router;