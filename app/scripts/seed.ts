import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectdb from '../lib/connectdb';
import User from '../models/User';
import LeaveApplication from '../models/LeaveApplication';

// Load environment variables
dotenv.config();

async function seed() {
  await connectdb();
  console.log('🚀 Connected to MongoDB');

  // Optional: clear previous data
  await User.deleteMany({});
  await LeaveApplication.deleteMany({});

  // Seed Users (HR and Employee)
  const [hr, employee] = await User.insertMany([
    {
      fullName: 'Jane Smith',
      email: 'jane.smith@company.com',
      phone: '+1234567891',
      employeeId: 'HR001',
      address: '456 Oak Ave, City, State',
      department: 'Human Resources',
      position: 'HR Manager',
      role: 'hr',
      joinDate: new Date('2022-03-10'),
      password: 'password123', // You can hash later
      status: 'Active'
    },
    {
      fullName: 'John Doe',
      email: 'john.doe@company.com',
      phone: '+1234567890',
      employeeId: 'EMP001',
      address: '123 Main St, City, State',
      department: 'Engineering',
      position: 'Software Engineer',
      role: 'employee',
      joinDate: new Date('2023-05-15'),
      password: 'password123',
      status: 'Active'
    }
  ]);

  // Seed Leave Applications
  // await LeaveApplication.insertMany([
  //   {
  //     employee: employee._id, // ✅ Correct field
  //     leaveType: 'Sick',
  //     fromDate: new Date('2025-07-21'),
  //     toDate: new Date('2025-07-22'),
  //     reason: 'Fever',
  //     status: 'Pending',
  //     appliedOn: new Date()
  //   },
  //   {
  //     employee: employee._id,
  //     leaveType: 'Casual',
  //     fromDate: new Date('2025-07-25'),
  //     toDate: new Date('2025-07-26'),
  //     reason: 'Personal Work',
  //     status: 'Approved',
  //     reviewedBy: hr._id,
  //     reviewedOn: new Date()
  //   }
  // ]);

  console.log('🌱 Seed data inserted successfully!');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('❌ Error during seeding:', err);
});
