
import models from '../models/index.js';
const { AdminModel} = models


export const findByEmailService = async (email) => {
  const result = await AdminModel.findOne({ email })
  return result;
};


export const createService = async (data) => {
  const result = await AdminModel.create(data);
  return result;
};

export const findByIdService = async (id) => {
  const result = AdminModel.findById(id).select('-password -resetPasswordExpires -resetPasswordToken');
  return result;
};

export const updateService = async (id, data) => {
  const result = await AdminModel.findByIdAndUpdate(id, data, { new: true })
  return result
};

export const deleteService = async (id) => {
    const result = AdminModel.findIdAndRemove(id)
  return result;
};

export const changePasswordService = async (id, newPassword) => {
  const result = await AdminModel.findOneAndUpdate(
    { _id: id },
    { $set: { password: newPassword } },
  );
  return result;
};
