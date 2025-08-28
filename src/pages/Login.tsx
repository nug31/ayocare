import React, { useState } from 'react';
import { ShieldCheckIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showDemo, setShowDemo] = useState(false);
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Email dan password harus diisi');
      return;
    }

    const success = await login(email, password);
    if (!success) {
      setError('Email atau password salah. Pastikan akun Anda terdaftar dalam sistem.');
    }
  };

  const adminAccounts = [
    { name: 'Super Admin', email: 'admin@ayocare.com', role: 'Administrator' },
    { name: 'Safety Manager', email: 'safety.admin@smk.edu', role: 'Safety Admin' }
  ];

  const userAccounts = [
    { name: 'Andi Setiawan (Elektronika)', email: 'andi.user@smk.edu', role: 'User' },
    { name: 'Sari Indah (Teknik Mesin)', email: 'sari.user@smk.edu', role: 'User' },
    { name: 'Roni Pratama (Otomotif)', email: 'roni.user@smk.edu', role: 'User' }
  ];

  const guruAccounts = [
    { name: 'Siti Nurhaliza (Guru Elektronika)', email: 'siti.guru@smk.edu', role: 'Guru' },
    { name: 'Ahmad Rizki (Guru Teknik Mesin)', email: 'ahmad.guru@smk.edu', role: 'Guru' },
    { name: 'Budi Santoso (Guru Otomotif)', email: 'budi.guru@smk.edu', role: 'Guru' },
    { name: 'Maria Dewi (Guru Administrasi)', email: 'maria.guru@smk.edu', role: 'Guru' }
  ];

  const loginWithDemo = (email: string, role: string) => {
    setEmail(email);
    // Set password berdasarkan role
    if (role === 'Administrator' || role === 'Safety Admin') {
      setPassword('admin123');
    } else if (role === 'User') {
      setPassword('user123');
    } else {
      setPassword('guru123');
    }
    setShowDemo(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-mint-50 to-pool-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto h-16 w-16 bg-pool-gradient rounded-full flex items-center justify-center mb-4">
              <ShieldCheckIcon className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Ayo Care</h1>
            <h2 className="text-xl font-semibold text-gray-700 mb-1">Login Sistem</h2>
            <p className="text-sm text-gray-600">
              Sistem pelaporan upnormal
            </p>
          </div>

          {/* Demo Info */}
          <div className="mb-6 p-4 bg-turquoise-50 border border-turquoise-200 rounded-lg">
            <p className="text-sm text-turquoise-800 mb-2">
              <span className="font-semibold">Akses Multi-Role:</span> Sistem mendukung Administrator, User, dan Guru dengan hak akses berbeda.
            </p>
            <button
              type="button"
              onClick={() => setShowDemo(!showDemo)}
              className="text-sm text-pool-600 hover:text-pool-800 font-medium underline"
            >
              Lihat akun demo untuk semua role
            </button>
          </div>

          {/* Demo Accounts */}
          {showDemo && (
            <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg max-h-96 overflow-y-auto">
              {/* Admin Accounts */}
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-purple-700 mb-2 uppercase tracking-wide">Administrator (Password: admin123)</h4>
                <div className="space-y-2">
                  {adminAccounts.map((account, index) => (
                    <button
                      key={`admin-${index}`}
                      onClick={() => loginWithDemo(account.email, account.role)}
                      className="w-full text-left p-2 text-sm bg-white border border-purple-200 rounded hover:bg-purple-50 hover:border-purple-300 transition-colors"
                    >
                      <div className="font-medium text-gray-800">{account.name}</div>
                      <div className="text-gray-600 text-xs">{account.email}</div>
                      <div className="text-purple-600 text-xs font-medium">{account.role}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* User Accounts */}
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-green-700 mb-2 uppercase tracking-wide">User (Password: user123)</h4>
                <div className="space-y-2">
                  {userAccounts.map((account, index) => (
                    <button
                      key={`user-${index}`}
                      onClick={() => loginWithDemo(account.email, account.role)}
                      className="w-full text-left p-2 text-sm bg-white border border-green-200 rounded hover:bg-green-50 hover:border-green-300 transition-colors"
                    >
                      <div className="font-medium text-gray-800">{account.name}</div>
                      <div className="text-gray-600 text-xs">{account.email}</div>
                      <div className="text-green-600 text-xs font-medium">{account.role}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Guru Accounts */}
              <div>
                <h4 className="text-xs font-semibold text-blue-700 mb-2 uppercase tracking-wide">Guru (Password: guru123)</h4>
                <div className="space-y-2">
                  {guruAccounts.map((account, index) => (
                    <button
                      key={`guru-${index}`}
                      onClick={() => loginWithDemo(account.email, account.role)}
                      className="w-full text-left p-2 text-sm bg-white border border-blue-200 rounded hover:bg-blue-50 hover:border-blue-300 transition-colors"
                    >
                      <div className="font-medium text-gray-800">{account.name}</div>
                      <div className="text-gray-600 text-xs">{account.email}</div>
                      <div className="text-blue-600 text-xs font-medium">{account.role}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-turquoise-500 focus:border-transparent transition-all"
                placeholder="Masukkan email Anda"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-turquoise-500 focus:border-transparent transition-all"
                  placeholder="Masukkan password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-pool-gradient text-white font-semibold rounded-lg hover:bg-pool-600 focus:ring-2 focus:ring-pool-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  Memverifikasi...
                </div>
              ) : (
                'Login ke Sistem'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              Sistem Pelaporan Keselamatan SMK dengan Multi-Role Access
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Admin: Kelola sistem | User & Guru: Buat & kelola laporan
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
