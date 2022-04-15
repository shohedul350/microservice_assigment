import express from 'express';
import {
     signUpController,
     signInController,
     detailsController,
     updateController,
     changePasswordController,
} from '../controllers/teacherController.js';
import authenticate from '../middlewares/authenticate.js'
import authorization from '../middlewares/authorization.js';

const router = express.Router();

router.route('/register').post(signUpController);
router.route('/login').post(signInController);
router.route('/change_password').put(authenticate, authorization, changePasswordController);
router.route('/details/:id').get(authenticate, authorization,  detailsController);
router.route('/update/:id').put(authenticate, authorization, updateController);
const configure = (app) => {
  app.use('/api/teacher', router);
};

export default configure;
