import StudentRoutes from './studentRoutes.js';
import EnrollRoutes from './enrollRoute.js';

const configureAllRoutes = (app) => {
  StudentRoutes(app);
  EnrollRoutes(app)
};

export default configureAllRoutes;
