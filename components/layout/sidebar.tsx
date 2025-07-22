'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Home,
  Calendar,
  Users,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  FileText,
  Shield
} from 'lucide-react';
import { User as UserType } from '@/types';

interface SidebarProps {
  user: UserType;
  onLogout: () => void;
}

// Utility to extract initials from name
function getInitials(name?: string): string {
  if (!name) return 'NA';
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();
}

export function Sidebar({ user, onLogout }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const employeeNavItems = [
    { href: '/dashboard/employee', label: 'Dashboard', icon: Home },
    { href: '/leave/apply', label: 'Apply Leave', icon: Calendar },
    { href: '/leave/history', label: 'Leave History', icon: FileText },
    { href: '/profile', label: 'Profile', icon: User },
    { href: '/settings/password', label: 'Change Password', icon: Settings },
  ];

  const hrNavItems = [
    { href: '/dashboard/hr', label: 'HR Dashboard', icon: Shield },
    { href: '/leave/manage', label: 'Manage Leaves', icon: Calendar },
    { href: '/employees', label: 'Employees', icon: Users },
    { href: '/profile', label: 'Profile', icon: User },
    { href: '/settings/password', label: 'Change Password', icon: Settings },
  ];

  const navItems = user.role === 'hr' ? hrNavItems : employeeNavItems;

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                  {getInitials(user?.fullName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-gray-900">{user?.fullName || 'No Name'}</h3>
                <p className="text-sm text-gray-500 capitalize">{user?.role || 'role'}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-200">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={onLogout}
            >
              <LogOut className="h-5 w-5 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
