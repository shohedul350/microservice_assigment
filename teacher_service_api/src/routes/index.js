import TeacherRoutes from './teacherRoutes.js';
import CourseRoute from './courseRoute.js';

const configureAllRoutes = (app) => {
  TeacherRoutes(app);
  CourseRoute(app)
};

export default configureAllRoutes;
