import User from '../models/User.js';
import Attendance from '../models/Attendance.js';

export const getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const presentToday = await Attendance.countDocuments({
      date: {
        $gte: today,
        $lt: tomorrow
      },
      status: 'present'
    });

    const absentToday = totalStudents - presentToday;

    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const present = await Attendance.countDocuments({
        date: { $gte: date, $lt: nextDate },
        status: 'present'
      });

      last7Days.push({
        date: date.toISOString().split('T')[0],
        present,
        total: totalStudents
      });
    }

    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    const monthlyAttendance = await Attendance.find({
      date: { $gte: last30Days }
    });

    const presentCount = monthlyAttendance.filter(a => a.status === 'present').length;
    const totalCount = monthlyAttendance.length;
    const attendanceRate = totalCount > 0 ? ((presentCount / totalCount) * 100).toFixed(1) : 0;

    res.json({
      success: true,
      stats: {
        totalStudents,
        presentToday,
        absentToday,
        attendanceRate,
        last7Days,
        recentStudents: await User.find({ role: 'student' })
          .select('name email course createdAt')
          .sort({ createdAt: -1 })
          .limit(5)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getTodayAttendance = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const students = await User.find({ role: 'student' }).select('name email course');

    const attendance = await Attendance.find({
      date: {
        $gte: today,
        $lt: tomorrow
      }
    });

    const attendanceMap = {};
    attendance.forEach(a => {
      attendanceMap[a.studentId.toString()] = a;
    });

    const result = students.map(student => {
      const record = attendanceMap[student._id.toString()];
      return {
        student,
        status: record ? record.status : 'absent',
        attendanceId: record ? record._id : null
      };
    });

    res.json({
      success: true,
      attendance: result,
      date: today.toISOString().split('T')[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const createDefaultAdmin = async (req, res) => {
  try {
    const existingAdmin = await User.findOne({ role: 'admin' });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Admin already exists'
      });
    }

    const admin = await User.create({
      name: 'Admin',
      email: 'admin@ams.com',
      phone: '1234567890',
      course: 'Administration',
      password: 'admin123',
      role: 'admin'
    });

    res.status(201).json({
      success: true,
      message: 'Default admin created',
      admin: {
        id: admin._id,
        email: admin.email,
        password: 'admin123'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};