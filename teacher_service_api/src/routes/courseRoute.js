import express from 'express';
import {
  createCourseController,
  getAllCourseController
} from '../controllers/teacherController.js';

import authenticate from '../middlewares/authenticate.js';
import authorization from '../middlewares/authorization.js';

const router = express.Router();

router.route('/create').post(authenticate, authorization, createCourseController);
router.route('/all_course').get(authenticate, getAllCourseController);
const configure = (app) => {
  app.use('/api/course', router);
};

export default configure;
