
import models from '../models/index.js';
const { CourseEnrollModel } = models


export const findByNameService = async (studentId, courseId) => {
  const result = await CourseEnrollModel.findOne({ student: studentId, courseId })
  return result;
};


export const createService = async (data) => {
  const result = await CourseEnrollModel.create(data);
  return result;
};


const populateQuery = [
  {
    path: 'student',
    model: 'student',
  },
  {
    path: 'courseId',
    model: 'course',
  },
];


export const findByIdService = async (id) => {
  const result =await CourseEnrollModel.findById(id).populate(populateQuery)
  return result;
};