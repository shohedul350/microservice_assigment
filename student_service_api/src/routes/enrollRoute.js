import express from 'express';
import {
      enrollCreateController,
      getEnrollController,
} from '../controllers/studentController.js';
import authenticate from '../middlewares/authenticate.js'

const router = express.Router();
router.route('/create').post(authenticate, enrollCreateController);
router.route('/details/:id').get(authenticate, getEnrollController);
const configure = (app) => {
  app.use('/api/enroll', router);
};

export default configure;
