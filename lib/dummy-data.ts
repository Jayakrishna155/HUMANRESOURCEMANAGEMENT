import { User, LeaveRequest, Employee, DashboardStats } from '@/types';

export const dummyUsers: User[] = [
  {
    _id: '1',
    email: 'john.doe@company.com',
    fullName: 'John Doe',
    role: 'employee',
    department: 'Engineering',
    position: 'Software Developer',
    joinDate: '2023-01-15',
    phone: '+1234567890',
    address: '123 Main St, City, State',
    reportingTo: 'Jane Smith',
    employeeId: 'EMP001'
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