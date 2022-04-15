
import models from '../models/index.js';
const { TeacherModel} = models


export const findByEmailService = async (email) => {
  const result = await TeacherModel.findOne({ email })
  return result;
};

export const allListService = async () => {
  const result = await TeacherModel.find({ ban: false })
  return result;
};

export const createService = async (data) => {
  const result = await TeacherModel.create(data);
  return result;
};

export const findByIdService = async (id) => {
  const result = TeacherModel.findById(id).select('-password -resetPasswordExpires -resetPasswordToken');
  return result;
};

export const updateService = async (id, data) => {
  const result = await TeacherModel.findByIdAndUpdate(id, data, { new: true })
  return result
};

export const deleteService = async (id) => {
    const result = TeacherModel.findByIdAndDelete(id)
  return result;
};

export const changePasswordService = async (id, newPassword) => {
  const result = await TeacherModel.findOneAndUpdate(
    { _id: id },
    { $set: { password: newPassword } },
  );
  return result;
};
