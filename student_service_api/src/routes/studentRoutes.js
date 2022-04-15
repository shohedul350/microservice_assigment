import express from 'express';
import {
        signUpUser,
        signInUser,
        studentDetails,
        updateUser,
        changePassword,
} from '../controllers/studentController.js';
import authenticate from '../middlewares/authenticate.js'

const router = express.Router();

router.route('/register').post(signUpUser);
router.route('/login').post(signInUser);
router.route('/change_password').put(authenticate, changePassword);
router.route('/details/:id').get(authenticate, studentDetails);
router.route('/update/:id').put(authenticate, updateUser);

const configure = (app) => {
  app.use('/api/student', router);
};

export default configure;
