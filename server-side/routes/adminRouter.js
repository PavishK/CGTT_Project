import express from 'express';
import {
    acceptEnrollment,
    addNewCourse,
    addNewCourseTask,
    allowCourseCompletion,
    deleteCourse,
    deleteCourseTask,
    deleteEnrollmentData,
    deleteSubmissionData,
    deleteUser, 
    displayAllUsersInfo, 
    displayCoursesDatas,
    displayCourseTasks, 
    displayEnrollmentsData, 
    displayTablesCount, 
    getSubmissionDatas, 
    updateCourseData, 
    updateSubmissionData, 
    updateUser
} from '../controllers/adminController.js';


const router=express.Router();

router.get("/get-datas-count/:_id/:email",displayTablesCount);

router.get('/get-users-info/:_id/:email',displayAllUsersInfo);
router.get('/get-courses-info/:_id/:email',displayCoursesDatas);
router.get('/get-course-tasks/:course_id',displayCourseTasks);

router.delete('/delete-user-data/:_id',deleteUser);
router.put('/update-user-data/:_id',updateUser);

//Manage Course Router
router.delete('/delete-course-data/:id',deleteCourse);
router.put('/update-course-data/:id',updateCourseData);
router.post('/insert-course-data',addNewCourse);
// -x-

//Manage Course Task
router.delete('/delete-course-task-data/:id',deleteCourseTask);
router.post('/insert-course-task-data',addNewCourseTask);

//Manage Enrollments
router.get('/get-enrollments-data/:_id/:email',displayEnrollmentsData);
router.delete('/delete-enrollment-data/:id',deleteEnrollmentData);
router.put('/accept-enrollment-data',acceptEnrollment);
router.put('/allow-course-completion',allowCourseCompletion);

//Manage Submissions
router.get('/get-submissions-data/:_id/:email',getSubmissionDatas);
router.delete('/delete-submission-data/:id',deleteSubmissionData);
router.put('/update-submission-data/:id',updateSubmissionData);

export default router;