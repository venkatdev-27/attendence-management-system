import express from 'express';
import {
  markAttendance,
  getStudentAttendance,
  getAttendanceByDate,
  adminMarkAttendance,
  updateAttendance,
  deleteAttendance,
  getAllAttendance,
  getAttendanceStats
} from '../controllers/attendanceController.js';
import { protect } from '../middleware/auth.js';
import { adminOnly } from '../middleware/admin.js';

const router = express.Router();

router.post('/mark', protect, markAttendance);
router.get('/student', protect, getStudentAttendance);
router.get('/date/:date', protect, adminOnly, getAttendanceByDate);
router.post('/admin-mark', protect, adminOnly, adminMarkAttendance);
router.get('/all', protect, adminOnly, getAllAttendance);
router.get('/stats', protect, getAttendanceStats);
router.put('/:id', protect, adminOnly, updateAttendance);
router.delete('/:id', protect, adminOnly, deleteAttendance);

export default router;