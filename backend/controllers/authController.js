import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, mobile, gender, emergencyContact, designation, workType, course, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    const user = await User.create({
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

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        gender: user.gender,
        emergencyContact: user.emergencyContact,
        designation: user.designation,
        workType: user.workType,
        role: user.role,
        course: user.course
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        gender: user.gender,
        emergencyContact: user.emergencyContact,
        designation: user.designation,
        workType: user.workType,
        role: user.role,
        course: user.course
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.json({
      success: true,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        gender: user.gender,
        emergencyContact: user.emergencyContact,
        designation: user.designation,
        workType: user.workType,
        role: user.role,
        course: user.course
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};