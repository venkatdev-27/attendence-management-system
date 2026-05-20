import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import studentRoutes from './routes/students.js';
import attendanceRoutes from './routes/attendance.js';
import adminRoutes from './routes/admin.js';
import { authLimiter, registerLimiter, apiLimiter, globalLimiter } from './middleware/rateLimiter.js';

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.set('trust proxy', 1);

app.use('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running', timestamp: new Date().toISOString() });
});

app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', registerLimiter);
app.use('/api', apiLimiter);

app.use(globalLimiter);

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/admin', adminRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : 'Internal server error';
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
const MODE = process.env.NODE_ENV || 'development';

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${MODE} mode`);
});