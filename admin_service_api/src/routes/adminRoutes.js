import express from 'express';
import {
        signUpUser,
        signInUser,
        adminDetails,
        updateUser,
        changePassword,
        getAllStudent,
        banStudent,
        deleteStudentController,
        getAllTeacherController
} from '../controllers/adminController.js';
import authenticate from '../middlewares/authenticate.js';
import authorization from '../middlewares/authorization.js';

const router = express.Router();

router.route('/register').post(signUpUser);
router.route('/login').post(signInUser);
router.route('/change_password').put(authenticate, authorization, changePassword);
router.route('/get_all_student').get(authenticate, authorization, getAllStudent);
router.route('/details/:id').get(authenticate, adminDetails);
router.route('/update/:id').put(authenticate,authorization,  updateUser);
router.route('/ban_student/:id').put(authenticate, authorization, banStudent);
router.route('/delete_student/:id').delete(authenticate, authorization, deleteStudentController);
router.route('/get_all_teacher').get(authenticate, authorization,  getAllTeacherController);
const configure = (app) => {
  app.use('/api/admin', router);
};

export default configure;
