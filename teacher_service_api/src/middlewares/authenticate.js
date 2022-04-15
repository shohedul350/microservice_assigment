

import jwt from 'jsonwebtoken';
import asyncHandler from '../utils/async.js';
import {
  findByIdService,
} from '../services/teacherServices.js';

const authenticateRequest = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization
    && req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Make sure token exits
  if (!token) {
    return res.status(401).json({ success: false, msg: 'Unauthenticated request' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await findByIdService(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, msg: 'Unauthenticated request' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, msg: 'Invalid token' });
  }
});

export default authenticateRequest;

