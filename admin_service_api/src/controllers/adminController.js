import bcrypt from 'bcryptjs';
import amqp from 'amqplib'
import asyncHandler from '../utils/async.js';
import { BadRequest, NotFound } from '../utils/error.js';
import sendTokenResponse from '../utils/sendTokenResponse.js';
import {
    findByEmailService,
    createService,
    findByIdService,
    updateService,
    changePasswordService,
} from '../services/adminServices.js';

let channel = null;


// rabbitmqconnection
const con = async()=>{
  try {
    const amqpServer = "amqp://rabbitmq:5672";
    const connection = await amqp.connect(amqpServer);
    console.log('rabbitmq connection created from admin server')
    channel = await connection.createChannel();
    console.log('chanel created from admin service')
  } catch (error) {
  }
}
con()



// admin register controller
export const signUpUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // check duplicate
  const result = await findByEmailService(email);
  if (result) {
    throw new BadRequest('Email already Exits');
  }
  // create hash
  const hasPassword = await bcrypt.hash(password, 11);
  const dataWithHash = { ...req.body, password: hasPassword };
  const registered = await createService(dataWithHash);
  delete registered.password;
  res.status(200).json({ success: true, details: registered, msg: 'Register Success' });
});


// admin login controller
export const signInUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const admin = await findByEmailService(email);
    if (!admin) {
      throw new NotFound('Invalid credentials');
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      throw new BadRequest('Invalid credentials');
    }
    sendTokenResponse(admin, 200, res);
  });


  //  admin details controller
export const adminDetails = asyncHandler(async (req, res) => {
  const result = await findByIdService(req.params.id);
  if (!result) {
    throw new NotFound('Not Found');
  }
  res.status(200).json({ success: true, details: result, msg: 'Details fetch'});
});


// admin info update  controller
export const updateUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const admin = await findByIdService(req.params.id);
  // admin check
  if (!admin) {
    throw new NotFound('Admin not found');
  }

  if(!password){
    const updated = await updateService(req.params.id, req.body);
    res.status(200).json({ success: true, details: updated, msg: 'Update Success' });
  }else{
    const hasPassword = await bcrypt.hash(password, 11);
    const dataWithHash = { ...req.body, password: hasPassword }
    const updated= await updateService(req.params.id, dataWithHash);
    res.status(200).json({ success: true, details: updated, msg: 'Update Success' });
  }
 
});




// admin password change controller
export const changePassword = asyncHandler(async (req, res) => {
  const {
    email,
    oldPassword,
    newPassword,
  } = req.body;

  const user = await findByEmailService(email);
  if (!user) {
    throw new NotFound('Email doesn\'t exists');
  }
  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    throw new BadRequest('Current password doesn\'t match');
  }
  const hash = await bcrypt.hash(newPassword, 11);
  await changePasswordService(user._id, hash);
  return res.status(200).json({ success: true, msg: 'Password successfully changed, please log back in to take effect' });
});  




let sendResponse;

// get all student controller
export const getAllStudent = asyncHandler(async (req, res) => {
  await channel.assertQueue("GET_ME_STUDENT_LIST");
  await channel.sendToQueue("GET_ME_STUDENT_LIST",Buffer.from(JSON.stringify('hello')));
  await channel.assertQueue("LIST_SEND")
  await channel.consume("LIST_SEND", async(data) => {
    sendResponse =  JSON.parse(data.content.toString())
    channel.ack(data);
  })
   return res.status(200).json({ success: true, details: sendResponse, msg: 'Student List' });

})


// student ban controller
export const banStudent = asyncHandler(async (req, res) => {
  await channel.sendToQueue("BAN_STUDENT_REQ",Buffer.from(JSON.stringify(req.params.id)));
  await channel.assertQueue("BAN_SUCCESS");
  await channel.consume("BAN_SUCCESS", async(data) => {
    sendResponse =  JSON.parse(data.content.toString())
    channel.ack(data);
  })
  return res.status(200).json({ success: true, details: sendResponse, msg: 'BAN Success' });
})


// student delete controller
export const deleteStudentController = asyncHandler(async (req, res) => {
  await channel.sendToQueue("DELETE_STUDENT_REQ",Buffer.from(JSON.stringify(req.params.id)));
  await channel.assertQueue("DELETE_SUCCESS");
  await channel.consume("DELETE_SUCCESS", async(data) => {
    sendResponse =  JSON.parse(data.content.toString())
    channel.ack(data);
  })
  return res.status(200).json({ success: true, details: sendResponse, msg: 'Delete Success' });
})



// // get all teacher controller

export const getAllTeacherController = asyncHandler(async (req, res) => {
  await channel.assertQueue("GET_TEACHER_LIST");
  await channel.sendToQueue("GET_TEACHER_LIST",Buffer.from(JSON.stringify('hello')));
  await channel.assertQueue("TEACHER_LIST")
  await channel.consume("TEACHER_LIST", async(data) => {
    sendResponse =  JSON.parse(data.content.toString())
    channel.ack(data);
  })
   return res.status(200).json({ success: true, details: sendResponse, msg: 'Teacher List' });

})


// teacher ban controller
export const teacherBanController = asyncHandler(async (req, res) => {
  await channel.assertQueue("TEACHER_BAN_REQ");
  await channel.sendToQueue("TEACHER_BAN_REQ",Buffer.from(JSON.stringify(req.params.id)));
  await channel.assertQueue("TEACHER_BAN_SUCCESS");
  await channel.consume("TEACHER_BAN_SUCCESS", async(data) => {
    sendResponse =  JSON.parse(data.content.toString())
    channel.ack(data);
  })
  return res.status(200).json({ success: true, details: sendResponse, msg: 'BAN Success' });
})



// teacher delete controller
export const teacherDeleteController = asyncHandler(async (req, res) => {
  await channel.assertQueue("TEACHER_DELETE_REQ");
  await channel.sendToQueue("TEACHER_DELETE_REQ",Buffer.from(JSON.stringify(req.params.id)));
  await channel.assertQueue("TEACHER_DELETE_SUCCESS");
  await channel.consume("TEACHER_DELETE_SUCCESS", async(data) => {
    sendResponse =  JSON.parse(data.content.toString())
    channel.ack(data);
  })
  return res.status(200).json({ success: true, details: sendResponse, msg: 'Delete Success' });
})

