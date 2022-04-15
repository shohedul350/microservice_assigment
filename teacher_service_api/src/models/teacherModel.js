
import mongoose from 'mongoose';

const { Schema } = mongoose;

const teacherSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'teacher'
  },
  isBan: {
    type: Boolean,
    default: false
  },
}, { timestamps: true });

const Teacher = mongoose.model('teacher', teacherSchema);
export default Teacher;
