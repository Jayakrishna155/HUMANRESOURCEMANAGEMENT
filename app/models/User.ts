// models/User.ts
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  employeeId: { type: String, unique: true },
  address: String,
  department: String,
  position: String,
  role: { type: String, enum: ['employee', 'hr', 'admin'], default: 'employee' },
  joinDate: { type: Date, required: true },
  salary: Number,
  reportingTo: String,
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  password: { type: String, required: true }, // hashed password
}, {
  timestamps: true
});

export default mongoose.models.User || mongoose.model('User', userSchema);
