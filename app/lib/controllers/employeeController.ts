import User from '@/app/models/User';
import LeaveApplication from '@/app/models/LeaveApplication';

// Get employee(s)
export async function getEmployees(id?: string) {
  if (id) {
    const user = await User.findById(id);
    return { success: true, data: user };
  }
  const users = await User.find();
  return { success: true, data: users };
}


// Add new employee
export async function addEmployee(data: any) {
  const existing = await User.findOne({ email: data.email });
  if (existing) throw new Error('User already exists');
  return await User.create(data);
}

// Apply for leave
export const applyLeave = async (data: any) => {
  const { email, leaveType, fromDate, toDate, reason } = data;

  const user = await User.findOne({ email });
  if (!user) throw new Error('User not found');


  const leave = await LeaveApplication.create({
    employee: user._id,
    leaveType, 
    fromDate,
    toDate,
    reason,
  });

  return {
    message: 'Leave application submitted successfully',
    leave,
  };
};

// Change password
export async function changePassword(id: string, currentPassword: string, newPassword: string) {
  const user = await User.findById(id);
  if (!user) throw new Error('User not found');

  if (user.password!==currentPassword) throw new Error('Current password is incorrect');
  user.password = newPassword;
  await user.save();
  return { message: 'Password changed' };
}

// Approve/Reject leave
export async function updateLeaveStatus(leaveId: string, status: string) {
  const leave = await LeaveApplication.findById(leaveId);
  if (!leave) throw new Error('Leave not found');

  leave.status = status;
  await leave.save();
  return { message: 'Leave status updated' };
}

// 🔹 Get leave requests of a specific user
export async function getUserLeaves(userId: string) {
  return await LeaveApplication.find({ employee: userId }).sort({ createdAt: -1 });
}
export const updateUserProfile = async (id: string, data: any) => {
  const updated = await User.findByIdAndUpdate(id, data, { new: true });
  return updated;
};

// 🔹 Get all leave requests (for admin/HR)
export async function getAllLeaveRequests() {
  return await LeaveApplication.find()
    .populate('employee', 'fullName email position')
    .sort({ createdAt: -1 });
}

// 🔹 (Optional) Get current logged-in user (depends on auth method)
export async function getCurrentUser() {
  // If you use a session/token-based auth, extract user from context
  // Here's just a placeholder
  return await User.findOne(); // Replace with actual session-based logic
}
