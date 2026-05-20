import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  mobile: {
    type: String,
    required: [true, 'Mobile number is required'],
    trim: true
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer-not-to-say'],
    required: [true, 'Gender is required']
  },
  emergencyContact: {
    type: String,
    required: [true, 'Emergency contact is required'],
    trim: true
  },
  designation: {
    type: String,
    required: [true, 'Designation is required'],
    trim: true
  },
  workType: {
    type: String,
    enum: ['wfh', 'hybrid', 'onsite'],
    required: [true, 'Work type is required']
  },
  phone: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student'
  },
  course: {
    type: String,
    required: [true, 'Course is required'],
    trim: true
  }
}, {
  timestamps: true
});

userSchema.virtual('name').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;