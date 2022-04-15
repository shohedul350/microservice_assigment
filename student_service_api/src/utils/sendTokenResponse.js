// Get token from model, create cookie and send response
import jwt from 'jsonwebtoken';

const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = jwt.sign({
    id: user._id}, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_LOGIN,
  });
  let resUser = user;
  resUser.password = null
  res
    .status(statusCode)
    .json({ success: true, token, details: resUser });
};

export default sendTokenResponse;
