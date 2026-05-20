import rateLimit from 'express-rate-limit';
import { TooManyRequestsError } from './customErrors.js';

const standardHeaders = true;
const legacyHeaders = false;

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many login attempts. Please try again after 15 minutes.' },
  standardHeaders,
  legacyHeaders,
  skipSuccessfulRequests: true,
  keyGenerator: (req) => req.ip,
});

export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: { success: false, message: 'Too many registration attempts. Please try again after an hour.' },
  standardHeaders,
  legacyHeaders,
  keyGenerator: (req) => req.ip,
});

export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests. Please slow down.' },
  standardHeaders,
  legacyHeaders,
  keyGenerator: (req) => req.ip,
});

export const studentLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: { success: false, message: 'Too many requests. Please wait a minute.' },
  standardHeaders,
  legacyHeaders,
  keyGenerator: (req) => req.user?.id || req.ip,
});

export const adminLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: { success: false, message: 'Too many admin requests. Please wait.' },
  standardHeaders,
  legacyHeaders,
  keyGenerator: (req) => req.user?.id || req.ip,
});

export const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 200,
  message: { success: false, message: 'Server is busy. Please try again later.' },
  standardHeaders,
  legacyHeaders,
  skip: (req) => req.path === '/api/health',
});