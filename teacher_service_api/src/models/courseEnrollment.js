
import mongoose from 'mongoose';

const { Schema } = mongoose;

const courseEnrollmentSchema = new Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'student',
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'course',
  },
}, { timestamps: true });

const CourseEnrollment = mongoose.model('courseEnrollment', courseEnrollmentSchema);
export default CourseEnrollment;