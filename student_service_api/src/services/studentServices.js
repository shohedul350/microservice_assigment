
import models from '../models/index.js';
const { StudentModel} = models


export const findByEmailService = async (email) => {
  const result = await StudentModel.findOne({ email })
  return result;
};


export const createService = async (data) => {
  const result = await StudentModel.create(data);
  return result;
};

export const findByIdService = async (id) => {
  const result = StudentModel.findById(id).select('-password -resetPasswordExpires -resetPasswordToken');
  return result;
};

export const updateService = async (id, data) => {
  const result = await StudentModel.findByIdAndUpdate(id, data, { new: true })
  return result
};

export const deleteStudentService = async (id) => {
    const result = StudentModel.findByIdAndRemove(id)
  return result;
};

export const changePasswordService = async (id, newPassword) => {
  const result = await StudentModel.findOneAndUpdate(
    { _id: id },
    { $set: { password: newPassword } },
  );
  return result;
};

export const getAllStudent = async () => {
  const result = await StudentModel.find().select('-password')
  return result;
};
