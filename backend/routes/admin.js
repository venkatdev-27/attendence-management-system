import express from 'express';
import { getDashboardStats, getTodayAttendance, createDefaultAdmin } from '../controllers/adminController.js';
import { protect } from '../middleware/auth.js';
import { adminOnly } from '../middleware/admin.js';

const router = express.Router();

router.use(protect);
router.use(adminOnly);

router.get('/stats', getDashboardStats);
router.get('/today', getTodayAttendance);
router.post('/create-admin', createDefaultAdmin);

export default router;