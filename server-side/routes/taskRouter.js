import express from 'express';
import {deleteSubmission, getUserSubmissions, sendCourseTasks, submissionStatus, submitTask} from '../controllers/TaskController.js';

const router=express.Router();

router.get('/get-course-tasks/:id',sendCourseTasks);

router.post('/submit-course-task',submitTask);
router.get('/get-submited-task/:user_id/:task_id',submissionStatus);
router.delete('/delete-submited-task/:id',deleteSubmission);

router.get('/get-user-submissions-data/:_id',getUserSubmissions)

export default router;