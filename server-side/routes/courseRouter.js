import express from 'express';
import { displayCoursesDatas, displayEnrolledCourseDatas } from '../controllers/courseController.js';

const router=express.Router();

router.get('/list-courses',displayCoursesDatas);
router.get('/list-enrolled-courses/:id',displayEnrolledCourseDatas)

export default router;