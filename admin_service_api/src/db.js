import mongoose from 'mongoose';

const connectDB = async () => {
  const { MONGO_URI } = process.env;
  try {
    const conn = await mongoose.connect('mongodb://database:27017/admin_service',{ useNewUrlParser: true });
    console.log(`MongoDB Connected to: ${conn.connection.host} admin service`);
  } catch (err) {
    console.error(err);
  }
};

export default connectDB;