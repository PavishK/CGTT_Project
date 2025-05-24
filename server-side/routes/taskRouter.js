import express from 'express';
import {sendCourseTasks} from '../controllers/TaskController.js';

const router=express.Router();

router.get('/get-course-tasks/:id',sendCourseTasks);

export default router;