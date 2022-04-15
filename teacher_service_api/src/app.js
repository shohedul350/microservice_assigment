import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import configureAllRoutes from './routes/index.js';

dotenv.config();

// limit handle
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
});


const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(limiter);

// all routes
configureAllRoutes(app);

// Handle unmatched routes
app.all('*', (req, res) => {
  return res.status(404).json({ success: false, msg: 'Route not found' });
});


export default app;
