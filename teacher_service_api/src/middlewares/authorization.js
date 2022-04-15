
import asyncHandler from '../utils/async.js';
import {
  findByIdService,
} from '../services/teacherServices.js';

const authorization = asyncHandler(async (req, res, next) => {
  
  try {
    const user = await findByIdService(req.user.id);
    console.log(user)
    if (user.role  !== 'teacher') {
      return res.status(401).json({ success: false, msg: 'Unauthorize request' });
    }
    next();
  } catch (err) {
    return res.status(401).json({ success: false, msg: 'Unauthorize request..' });
  }
});

export default authorization;

