
import asyncHandler from '../utils/async.js';
import {
  findByIdService,
} from '../services/adminServices.js';

const authorization = asyncHandler(async (req, res, next) => {
  
  try {
    const user = await findByIdService(req.user.id);
    if (user.role  !== 'admin') {
      return res.status(401).json({ success: false, msg: 'Unauthenticated request' });
    }
    next();
  } catch (err) {
    return res.status(401).json({ success: false, msg: 'Unauthenticated request' });
  }
});

export default authorization;

