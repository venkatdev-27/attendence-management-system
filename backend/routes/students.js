import express from 'express';
import {
  getAllStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent
} from '../controllers/studentController.js';
import { protect } from '../middleware/auth.js';
import { adminOnly } from '../middleware/admin.js';

const router = express.Router();

router.use(protect);
router.use(adminOnly);

router.get('/', getAllStudents);
router.get('/:id', getStudent);
router.post('/', createStudent);
router.put('/:id', updateStudent);
router.delete('/:id', deleteStudent);

export default router;