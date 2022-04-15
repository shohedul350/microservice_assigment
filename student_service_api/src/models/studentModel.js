
import mongoose from 'mongoose';

const { Schema } = mongoose;

const studentSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
  },
  studentId: {
    type: Number,
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'course',
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
  isBan: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    default: 'student'
  }
}, { timestamps: true });

const Student = mongoose.model('student', studentSchema);
export default Student;
