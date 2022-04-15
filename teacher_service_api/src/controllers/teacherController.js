import bcrypt from 'bcryptjs';
import amqp from 'amqplib'
import asyncHandler from '../utils/async.js';
import { BadRequest, NotFound } from '../utils/error.js';
import sendTokenResponse from '../utils/sendTokenResponse.js';
import {
    allListService,
    findByEmailService,
    createService,
    findByIdService,
    updateService,
    changePasswordService,
    deleteService
} from '../services/teacherServices.js';

import  {createService as createCourseService, allListService as allCourseListService, findByNameService as courseFind} from '../services/courseService.js';
import {createService as createEnrollService, findByIdService as enrollDetailsService} from '../services/enrollService.js';



let channel = null;

const con = async()=>{
  try {
      const amqpServer = "amqp://rabbitmq:5672";
      const connection = await amqp.connect(amqpServer);
      console.log('connection created teacher server')
      channel = await connection.createChannel();
         // student list
         await channel.assertQueue("GET_TEACHER_LIST");
         await channel.consume("GET_ME_STUDENT_LIST", async(data)=>{
          // const rec =  JSON.parse(data.content.toString())
          const result = await allListService()
          channel.sendToQueue("TEACHER_LIST",Buffer.from(JSON.stringify(result)));
          channel.ack(data);
         });

     // ban teacher
      await channel.assertQueue("TEACHER_BAN_REQ");
      await channel.consume("TEACHER_BAN_REQ", async(data)=>{
      const Id =  JSON.parse(data.content.toString())
      const result = await updateService(Id, {isBan: true})
      channel.sendToQueue("TEACHER_BAN_SUCCESS",Buffer.from(JSON.stringify(result)));
      channel.ack(data);
     });

      // create enroll
      await channel.assertQueue("CREATE_ENROLL");
      await channel.consume("CREATE_ENROLL", async(data)=>{
      const enrollData =  JSON.parse(data.content.toString())
      const result = await createEnrollService(enrollData)
      channel.sendToQueue("ENROLL_CREATE_SUCCESS",Buffer.from(JSON.stringify(result)));
        channel.ack(data);
      });
  


       // get enroll
       await channel.assertQueue("GET_ENROLL_DETAILS");
       await channel.consume("GET_ENROLL_DETAILS", async(data)=>{
       const id =  JSON.parse(data.content.toString())
       const created = await enrollDetailsService(id)
       channel.sendToQueue("GET_ENROLL",Buffer.from(JSON.stringify(created)));
         channel.ack(data);
       });

  } catch (error) {
     console.log(error, 'error')

  }

}
con()


// register  
export const signUpController = asyncHandler(async (req, res) => {
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



// login 
export const signInController= asyncHandler(async (req, res) => {
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
export const detailsController = asyncHandler(async (req, res) => {
  const result = await findByIdService(req.params.id);
  if (!result) {
    throw new NotFound('Not Found');
  }
  res.status(200).json({ success: true, details: result, msg: 'Details fetch'});
});

// update 
export const updateController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await findByIdService(req.params.id);
  // check
  if (!result) {
    throw new NotFound('Not found');
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
export const changePasswordController = asyncHandler(async (req, res) => {
  const {
    email,
    oldPassword,
    newPassword,
  } = req.body;

  const result = await findByEmailService(email);
  if (!result) {
    throw new NotFound('Email doesn\'t exists');
  }
  const isMatch = await bcrypt.compare(oldPassword, result.password);
  if (!isMatch) {
    throw new BadRequest('Current password doesn\'t match');
  }
  const hash = await bcrypt.hash(newPassword, 11);
  await changePasswordService(result._id, hash);
  return res.status(200).json({ success: true, msg: 'Password successfully changed, please log back in to take effect' });
});  


export const createCourseController = asyncHandler(async (req, res) => {
    const result = await courseFind(req.body.courseName);
    // check
    if (result) {
      throw new BadRequest('Already Exits');
    }
   const created = await createCourseService({...req.body, teacher: req.user.id});
    res.status(200).json({ success: true, details: created, msg: 'Create Course' });
});

export const getAllCourseController = asyncHandler(async (req, res) => {
  const result = await allCourseListService();
  res.status(200).json({ success: true, details: result, msg: 'All Course List' });
});
