import bcrypt from 'bcryptjs';
import amqp from 'amqplib';
import asyncHandler from '../utils/async.js';
import { BadRequest, NotFound } from '../utils/error.js';
import sendTokenResponse from '../utils/sendTokenResponse.js';
import {
    findByEmailService,
    createService,
    findByIdService,
    updateService,
    changePasswordService,
    getAllStudent,
    deleteStudentService
} from '../services/studentServices.js';

let channel = null;

const con = async()=>{
  try {

    const amqpServer = "amqp://rabbitmq:5672";
    const connection = await amqp.connect(amqpServer);
    console.log('connection created studenr server')
    channel = await connection.createChannel();

    // student list
     await channel.assertQueue("GET_ME_STUDENT_LIST");
     await channel.consume("GET_ME_STUDENT_LIST", async(data)=>{
      // const rec =  JSON.parse(data.content.toString())
      const result = await getAllStudent()
      channel.sendToQueue("LIST_SEND",Buffer.from(JSON.stringify(result)));
       channel.ack(data);
     });


     // ban student 
     await channel.assertQueue("BAN_STUDENT_REQ");
     await channel.consume("BAN_STUDENT_REQ", async(data)=>{
     const Id =  JSON.parse(data.content.toString())
     const result = await updateService(Id, {isBan: true})
      channel.sendToQueue("BAN_SUCCESS",Buffer.from(JSON.stringify(result)));
       channel.ack(data);
     });


  // delete student
     await channel.assertQueue("DELETE_STUDENT_REQ");
     await channel.consume("DELETE_STUDENT_REQ", async(data)=>{
     const Id =  JSON.parse(data.content.toString())
     const result = await deleteStudentService(Id)
      channel.sendToQueue("DELETE_SUCCESS",Buffer.from(JSON.stringify(result)));
       channel.ack(data);
     });

  } catch (error) {
     console.log(error)
  }

}
con()


// register  
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


// login user
export const signInUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const result = await findByEmailService(email);
    if (!result) {
      throw new NotFound('Invalid credentials');
    }
    const isMatch = await bcrypt.compare(password, result.password);
    if (!isMatch) {
      throw new BadRequest('Invalid credentials');
    }
    sendTokenResponse(result, 200, res);
  });


  // details
export const studentDetails = asyncHandler(async (req, res) => {
  const result = await findByIdService(req.params.id);
  if (!result) {
    throw new NotFound('Not Found');
  }
  res.status(200).json({ success: true, details: result, msg: 'Details fetch'});
});

// update 
export const updateUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const student = await findByIdService(req.params.id);
  // student check
  if (!student) {
    throw new NotFound('Student not found');
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


// change password
export const changePassword = asyncHandler(async (req, res) => {
  const {
    email,
    oldPassword,
    newPassword,
  } = req.body;

  const student = await findByEmailService(email);
  if (!student) {
    throw new NotFound('Email doesn\'t exists');
  }
  const isMatch = await bcrypt.compare(oldPassword, student.password);
  if (!isMatch) {
    throw new BadRequest('Current password doesn\'t match');
  }
  const hash = await bcrypt.hash(newPassword, 11);
  await changePasswordService(student._id, hash);
  return res.status(200).json({ success: true, msg: 'Password successfully changed, please log back in to take effect' });
});  


// create enroll
let sendResponse;
export const enrollCreateController = asyncHandler(async (req, res) => {
  await channel.sendToQueue("CREATE_ENROLL",Buffer.from(JSON.stringify(req.body)));
  await channel.assertQueue("ENROLL_CREATE_SUCCESS");
  await channel.consume("ENROLL_CREATE_SUCCESS", async(data) => {
    sendResponse =  JSON.parse(data.content.toString())
    channel.ack(data);
  })
  return res.status(200).json({ success: true, details: createdEnroll, msg: 'Create Success' });
})

// get enroll 
export const getEnrollController = asyncHandler(async (req, res) => {
  await channel.assertQueue("GET_ENROLL_DETAILS");
  await channel.sendToQueue("GET_ENROLL_DETAILS",Buffer.from(JSON.stringify('hello')));
  await channel.assertQueue("GET_ENROLL")
  await channel.consume("GET_ENROLL", async(data) => {
    sendResponse =  JSON.parse(data.content.toString())
    channel.ack(data);
  })
   return res.status(200).json({ success: true, details: sendResponse, msg: 'Enroll List' });
});