import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  PlusIcon,
  ClockIcon,
  CogIcon,
  ShieldCheckIcon,
  ArrowRightOnRectangleIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';

// Navigation untuk role yang berbeda
const adminNavigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Panel Admin', href: '/admin', icon: CogIcon },
  { name: 'Riwayat Laporan', href: '/history', icon: ClockIcon },
];

const userNavigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Buat Laporan', href: '/report', icon: PlusIcon },
  { name: 'Riwayat Laporan', href: '/history', icon: ClockIcon },
];

const guruNavigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Buat Laporan', href: '/report', icon: PlusIcon },
  { name: 'Riwayat Laporan', href: '/history', icon: ClockIcon },
];

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  // Pilih navigasi berdasarkan role user
  const getNavigation = () => {
    switch (user?.role) {
      case 'admin':
        return adminNavigation;
      case 'user':
        return userNavigation;
      case 'guru':
        return guruNavigation;
      default:
        return userNavigation;
    }
  };

  const navigation = getNavigation();

  // Get role display name
  const getRoleDisplayName = () => {
    switch (user?.role) {
      case 'admin':
        return 'Administrator';
      case 'user':
        return `User - ${user.department || 'Staff'}`;
      case 'guru':
        return `Guru ${user.subject || ''}`;
      default:
        return 'User';
    }
  };

  const roleDisplay = getRoleDisplayName();

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <div className="flex items-center h-16 px-6 bg-pool-gradient">
            <ShieldCheckIcon className="h-8 w-8 text-white mr-3" />
            <h1 className="text-xl font-bold text-white">Ayo Care</h1>
          </div>
          <div className="flex flex-col flex-grow overflow-y-auto">
            <nav className="flex-1 px-4 py-6 space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-turquoise-100 text-turquoise-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon
                      className={`mr-3 h-5 w-5 ${
                        isActive ? 'text-turquoise-600' : 'text-gray-400 group-hover:text-gray-500'
                      }`}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            
            {/* User Profile & Logout */}
            <div className="px-4 py-4 border-t border-gray-200">
              <div className="flex items-center mb-3">
                <div className="h-8 w-8 bg-turquoise-100 rounded-full flex items-center justify-center mr-3">
                  <UserIcon className="h-5 w-5 text-turquoise-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {roleDisplay}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-700 rounded-md transition-colors"
              >
                <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Top bar for mobile */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ShieldCheckIcon className="h-8 w-8 text-pool-600" />
              <h1 className="text-xl font-bold text-gray-900">Ayo Care</h1>
            </div>
            {/* User profile for mobile top bar */}
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-turquoise-100 rounded-full flex items-center justify-center">
                <UserIcon className="h-4 w-4 text-turquoise-600" />
              </div>
              <span className="text-sm font-medium text-gray-700 truncate max-w-20">
                {user?.name?.split(' ')[0]}
              </span>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 pb-20 lg:pb-6">
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>

        {/* Bottom Navigation for Mobile */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 z-40 shadow-lg">
          <nav className="px-2 py-2">
            <div className="flex justify-around items-center max-w-sm mx-auto">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex flex-col items-center py-2 px-2 min-w-0 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'text-turquoise-600 bg-turquoise-50 scale-105'
                        : 'text-gray-600 hover:text-gray-900 hover:scale-105'
                    }`}
                  >
                    <IconComponent className={`h-5 w-5 mb-1 transition-colors ${
                      isActive ? 'text-turquoise-600' : 'text-gray-400'
                    }`} />
                    <span className={`text-xs font-medium text-center leading-tight ${
                      isActive ? 'text-turquoise-700' : 'text-gray-600'
                    }`}>
                      {item.name === 'Buat Laporan' ? 'Laporan' :
                       item.name === 'Riwayat Laporan' ? 'Riwayat' :
                       item.name === 'Panel Admin' ? 'Admin' :
                       item.name}
                    </span>
                  </Link>
                );
              })}
              {/* Logout button in bottom nav */}
              <button
                onClick={handleLogout}
                className="flex flex-col items-center py-2 px-2 min-w-0 rounded-lg text-red-600 hover:bg-red-50 hover:scale-105 transition-all duration-200"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium">Keluar</span>
              </button>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}