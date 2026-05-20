import Attendance from '../models/Attendance.js';
import User from '../models/User.js';

export const markAttendance = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingAttendance = await Attendance.findOne({
      studentId: req.user.id,
      date: {
        $gte: today,
        $lt: tomorrow
      }
    });

    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        message: 'Attendance already marked for today'
      });
    }

    const attendance = await Attendance.create({
      studentId: req.user.id,
      date: today,
      status: 'present',
      markedBy: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Attendance marked successfully',
      attendance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getStudentAttendance = async (req, res) => {
  try {
    const { page = 1, limit = 30 } = req.query;

    const total = await Attendance.countDocuments({ studentId: req.user.id });
    const attendance = await Attendance.find({ studentId: req.user.id })
      .populate('studentId', 'name email course')
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const presentCount = await Attendance.countDocuments({
      studentId: req.user.id,
      status: 'present'
    });

    const percentage = total > 0 ? ((presentCount / total) * 100).toFixed(1) : 0;

    res.json({
      success: true,
      attendance,
      stats: {
        total,
        present: presentCount,
        absent: total - presentCount,
        percentage
      },
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getAttendanceByDate = async (req, res) => {
  try {
    const date = new Date(req.params.date);
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);

    const attendance = await Attendance.find({
      date: {
        $gte: new Date(date.setHours(0, 0, 0, 0)),
        $lt: new Date(nextDate.setHours(0, 0, 0, 0))
      }
    }).populate('studentId', 'name email course');

    res.json({
      success: true,
      attendance,
      date: req.params.date
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const adminMarkAttendance = async (req, res) => {
  try {
    const { studentId, status, date } = req.body;

    const student = await User.findById(studentId);
    if (!student || student.role !== 'student') {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    const attendanceDate = date ? new Date(date) : new Date();
    attendanceDate.setHours(0, 0, 0, 0);

    const nextDate = new Date(attendanceDate);
    nextDate.setDate(nextDate.getDate() + 1);

    const existingAttendance = await Attendance.findOne({
      studentId,
      date: {
        $gte: attendanceDate,
        $lt: nextDate
      }
    });

    if (existingAttendance) {
      existingAttendance.status = status;
      existingAttendance.markedBy = req.user.id;
      await existingAttendance.save();

      return res.json({
        success: true,
        message: 'Attendance updated',
        attendance: existingAttendance
      });
    }

    const attendance = await Attendance.create({
      studentId,
      date: attendanceDate,
      status,
      markedBy: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Attendance marked',
      attendance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const updateAttendance = async (req, res) => {
  try {
    const { status } = req.body;

    const attendance = await Attendance.findById(req.params.id);

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Attendance not found'
      });
    }

    attendance.status = status;
    await attendance.save();

    res.json({
      success: true,
      message: 'Attendance updated',
      attendance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const deleteAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id);

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Attendance not found'
      });
    }

    await attendance.deleteOne();

    res.json({
      success: true,
      message: 'Attendance deleted'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getAllAttendance = async (req, res) => {
  try {
    const { page = 1, limit = 50, search, date, status } = req.query;

    let query = {};

    if (date) {
      const searchDate = new Date(date);
      const nextDate = new Date(searchDate);
      nextDate.setDate(nextDate.getDate() + 1);
      query.date = {
        $gte: new Date(searchDate.setHours(0, 0, 0, 0)),
        $lt: new Date(nextDate.setHours(0, 0, 0, 0))
      };
    }

    if (status) {
      query.status = status;
    }

    const total = await Attendance.countDocuments(query);
    const attendance = await Attendance.find(query)
      .populate('studentId', 'name email course')
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      success: true,
      attendance,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getAttendanceStats = async (req, res) => {
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

    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    const attendanceLast30Days = await Attendance.find({
      date: { $gte: last30Days }
    });

    const presentLast30 = attendanceLast30Days.filter(a => a.status === 'present').length;
    const totalLast30 = attendanceLast30Days.length;
    const percentage30Days = totalLast30 > 0 ? ((presentLast30 / totalLast30) * 100).toFixed(1) : 0;

    res.json({
      success: true,
      stats: {
        totalStudents,
        presentToday,
        absentToday,
        percentageLast30Days: percentage30Days
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};