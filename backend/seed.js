import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const seedData = async () => {
  await connectDB();

  try {
    // Check if admin exists
    const adminExists = await User.findOne({ role: 'admin' });
    
    if (!adminExists) {
      // Create default admin
      await User.create({
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@ams.com',
        password: 'admin123',
        mobile: '1234567890',
        gender: 'prefer-not-to-say',
        emergencyContact: '1234567890',
        designation: 'Administrator',
        workType: 'onsite',
        course: 'Administration',
        role: 'admin'
      });
      console.log('Default admin created: admin@ams.com / admin123');
    } else {
      console.log('Admin already exists');
    }

    // Create sample students
    const sampleStudents = [
      {
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@example.com',
        password: 'password123',
        mobile: '9876543210',
        gender: 'male',
        emergencyContact: '9876543211',
        designation: 'Trainee',
        workType: 'wfh',
        course: 'Web Development',
        role: 'student'
      },
      {
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.j@example.com',
        password: 'password123',
        mobile: '9876543212',
        gender: 'female',
        emergencyContact: '9876543213',
        designation: 'Junior Developer',
        workType: 'hybrid',
        course: 'Data Science',
        role: 'student'
      },
      {
        firstName: 'Mike',
        lastName: 'Williams',
        email: 'mike.w@example.com',
        password: 'password123',
        mobile: '9876543214',
        gender: 'male',
        emergencyContact: '9876543215',
        designation: 'Intern',
        workType: 'onsite',
        course: 'Machine Learning',
        role: 'student'
      }
    ];

    for (const student of sampleStudents) {
      const exists = await User.findOne({ email: student.email });
      if (!exists) {
        await User.create(student);
        console.log(`Created student: ${student.email}`);
      }
    }

    console.log('Seed completed successfully!');
  } catch (error) {
    console.error('Seed error:', error.message);
  }

  process.exit();
};

seedData();