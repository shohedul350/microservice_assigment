import mongoose from 'mongoose';

const connectDB = async () => {
  const { MONGO_URI_DEV} = process.env;
  const MONGO_URI = MONGO_URI_DEV;
  try {
    const conn = await mongoose.connect('mongodb://database:27017/student_service',{ useNewUrlParser: true });
    console.log(`MongoDB Connected to: ${conn.connection.host} student service`);
  } catch (err) {
    console.error(err); 
  }
};

export default connectDB;