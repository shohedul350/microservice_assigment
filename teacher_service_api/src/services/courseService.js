
import models from '../models/index.js';
const { CourseModel } = models


export const findByNameService = async (name) => {
  const result = await CourseModel.findOne({ courseName: name })
  return result;
};

export const allListService = async () => {
  const result = await CourseModel.find()
  return result;
};

export const createService = async (data) => {
  const result = await CourseModel.create(data);
  return result;
};

export const findByIdService = async (id) => {
  const result = TeacherModel.findById(id)
  return result;
};