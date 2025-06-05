import express from 'express';
import { displayCoursesDatas, displayEnrolledCourseDatas, getCertificateData, requestEnrollment } from '../controllers/courseController.js';

const router=express.Router();

router.get('/list-courses',displayCoursesDatas);
router.get('/list-enrolled-courses/:id',displayEnrolledCourseDatas);
router.post('/enollment-request',requestEnrollment);
router.post('/get-certificate-data',getCertificateData);

export default router;