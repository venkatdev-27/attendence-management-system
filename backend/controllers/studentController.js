import User from '../models/User.js';

export const getAllStudents = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;

    const query = { role: 'student' };
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { course: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await User.countDocuments(query);
    const students = await User.find(query)
      .select('-password')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      students,
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

export const getStudent = async (req, res) => {
  try {
    const student = await User.findOne({ _id: req.params.id, role: 'student' }).select('-password');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.json({
      success: true,
      student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const createStudent = async (req, res) => {
  try {
    const { firstName, lastName, email, mobile, gender, emergencyContact, designation, workType, course, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }

    const student = await User.create({
      firstName,
      lastName,
      email,
      mobile,
      gender,
      emergencyContact,
      designation,
      workType,
      course,
      password,
      role: 'student'
    });

    res.status(201).json({
      success: true,
      student: {
        id: student._id,
        firstName: student.firstName,
        lastName: student.lastName,
        name: student.name,
        email: student.email,
        mobile: student.mobile,
        gender: student.gender,
        emergencyContact: student.emergencyContact,
        designation: student.designation,
        workType: student.workType,
        role: student.role,
        course: student.course
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const { firstName, lastName, mobile, gender, emergencyContact, designation, workType, course } = req.body;

    const student = await User.findById(req.params.id);

    if (!student || student.role !== 'student') {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    student.firstName = firstName || student.firstName;
    student.lastName = lastName || student.lastName;
    student.mobile = mobile || student.mobile;
    student.gender = gender || student.gender;
    student.emergencyContact = emergencyContact || student.emergencyContact;
    student.designation = designation || student.designation;
    student.workType = workType || student.workType;
    student.course = course || student.course;

    await student.save();

    res.json({
      success: true,
      student: {
        id: student._id,
        firstName: student.firstName,
        lastName: student.lastName,
        name: student.name,
        email: student.email,
        mobile: student.mobile,
        gender: student.gender,
        emergencyContact: student.emergencyContact,
        designation: student.designation,
        workType: student.workType,
        role: student.role,
        course: student.course
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const student = await User.findOne({ _id: req.params.id, role: 'student' });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    await student.deleteOne();

    res.json({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};