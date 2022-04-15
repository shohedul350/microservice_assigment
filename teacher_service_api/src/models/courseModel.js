
import mongoose from 'mongoose';

const { Schema } = mongoose;

const courseSchema = new Schema({
  courseName: {
    type: String,
  },
  courseDetails: {
    type: String,
  },
  teacher : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'course',
  }
}, { timestamps: true });

const Course = mongoose.model('course', courseSchema);
export default Course;
