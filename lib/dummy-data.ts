import { User, LeaveRequest, Employee, DashboardStats } from '@/types';

export const dummyUsers: User[] = [
  {
    id: '1',
    email: 'john.doe@company.com',
    name: 'John Doe',
    role: 'employee',
    department: 'Engineering',
    position: 'Software Developer',
    joinDate: '2023-01-15',
    phone: '+1234567890',
    address: '123 Main St, City, State',
    reportingTo: 'Jane Smith',
    employeeId: 'EMP001'
  },
  {
    id: '2',
    email: 'jane.smith@company.com',
    name: 'Jane Smith',
    role: 'hr',
    department: 'Human Resources',
    position: 'HR Manager',
    joinDate: '2022-03-10',
    phone: '+1234567891',
    address: '456 Oak Ave, City, State',
    employeeId: 'HR001'
  },
  {
    id: '3',
    email: 'mike.wilson@company.com',
    name: 'Mike Wilson',
    role: 'employee',
    department: 'Marketing',
    position: 'Marketing Specialist',
    joinDate: '2023-06-20',
    phone: '+1234567892',
    address: '789 Pine Rd, City, State',
    reportingTo: 'Sarah Johnson',
    employeeId: 'EMP002'
  },
];

export const dummyLeaveRequests: LeaveRequest[] = [
  {
    id: '1',
    employeeId: '1',
    employeeName: 'John Doe',
    type: 'annual',
    startDate: '2024-02-15',
    endDate: '2024-02-18',
    days: 4,
    reason: 'Family vacation',
    status: 'pending',
    appliedDate: '2024-01-15'
  },
  {
    id: '2',
    employeeId: '3',
    employeeName: 'Mike Wilson',
    type: 'sick',
    startDate: '2024-01-10',
    endDate: '2024-01-12',
    days: 3,
    reason: 'Medical treatment',
    status: 'approved',
    appliedDate: '2024-01-08',
    approvedBy: 'Jane Smith',
    approvedDate: '2024-01-09'
  },
  {
    id: '3',
    employeeId: '1',
    employeeName: 'John Doe',
    type: 'personal',
    startDate: '2024-01-05',
    endDate: '2024-01-05',
    days: 1,
    reason: 'Personal work',
    status: 'rejected',
    appliedDate: '2024-01-02',
    approvedBy: 'Jane Smith',
    approvedDate: '2024-01-03',
    comments: 'Insufficient notice period'
  }
];

export const dummyEmployees: Employee[] = [
  {
    id: '1',
    employeeId: 'EMP001',
    name: 'John Doe',
    email: 'john.doe@company.com',
    department: 'Engineering',
    position: 'Software Developer',
    joinDate: '2023-01-15',
    phone: '+1234567890',
    address: '123 Main St, City, State',
    status: 'active',
    reportingTo: 'Jane Smith',
    salary: 75000
  },
  {
    id: '3',
    employeeId: 'EMP002',
    name: 'Mike Wilson',
    email: 'mike.wilson@company.com',
    department: 'Marketing',
    position: 'Marketing Specialist',
    joinDate: '2023-06-20',
    phone: '+1234567892',
    address: '789 Pine Rd, City, State',
    status: 'active',
    reportingTo: 'Sarah Johnson',
    salary: 65000
  },
  {
    id: '4',
    employeeId: 'EMP003',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    department: 'Marketing',
    position: 'Marketing Manager',
    joinDate: '2022-08-01',
    phone: '+1234567893',
    address: '321 Elm St, City, State',
    status: 'active',
    salary: 85000
  },
  {
    id: '5',
    employeeId: 'EMP004',
    name: 'Robert Brown',
    email: 'robert.brown@company.com',
    department: 'Finance',
    position: 'Accountant',
    joinDate: '2023-03-12',
    phone: '+1234567894',
    address: '654 Maple Ave, City, State',
    status: 'active',
    reportingTo: 'Jennifer Davis',
    salary: 60000
  }
];

export const dummyStats: DashboardStats = {
  totalEmployees: 4,
  pendingLeaves: 1,
  approvedLeaves: 1,
  rejectedLeaves: 1,
  totalDepartments: 3,
  activeEmployees: 4
};

// Mock authentication functions
export const mockAuth = {
  login: (email: string, password: string) => {
    const user = dummyUsers.find(u => u.email === email);
    if (user && password === 'password') {
      return { success: true, user };
    }
    return { success: false, error: 'Invalid credentials' };
  },
  
  getCurrentUser: () => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  },
  
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
    }
  }
};