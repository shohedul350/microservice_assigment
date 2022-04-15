import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import winston from 'winston';
import expressWinston from 'express-winston';
import winstonMongodb from 'winston-mongodb';

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


const mongoInfoTransport = new winston.transports.MongoDB({
  db: 'mongodb://database:27017/admin_service',
  metaKey: 'meta',
});

const getMessage = (req, res) => {
  const obj = {
    req_user: req.user,
    req_body: req.body
  };
  return JSON.stringify(obj);
};

// info logger
const infoLogger = expressWinston.logger({
  transports: [
    mongoInfoTransport,
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json(),
  ),
  meta: true,
  msg: getMessage,
  expressFormat: false,
});

// use info log
app.use(infoLogger);

// all routes
configureAllRoutes(app);

// Handle unmatched routes
app.all('*', (req, res) => {
  return res.status(404).json({ success: false, msg: 'Route not found' });
});


export default app;
