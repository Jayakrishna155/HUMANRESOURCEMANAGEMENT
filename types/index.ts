export interface User {
  _id: string;
  email: string;
  fullName: string;
  role: 'employee' | 'hr';
  department: string;
  position: string;
  joinDate: string;
  avatar?: string;
  phone?: string;
  address?: string;
  reportingTo?: string;
  employeeId: string;
}

export interface LeaveRequest {
  _id: string;
  employeeId: string;
  employeeName: string;
  leaveType: 'annual' | 'sick' | 'personal' | 'emergency';
  fromDate: string;
  toDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface Employee {
  _id: string;
  employeeId: string;
  fullName: string;
  email: string;
  department: string;
  position: string;
  joinDate: string;
  phone?: string;
  address?: string;
  status: 'active' | 'inactive';
  reportingTo?: string;
  salary?: number;
}

export interface DashboardStats {
  totalEmployees: number;
  pendingLeaves: number;
  approvedLeaves: number;
  rejectedLeaves: number;
  totalDepartments: number;
  activeEmployees: number;
}
