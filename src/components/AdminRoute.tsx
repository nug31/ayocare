import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface AdminRouteProps {
  children: React.ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Tampilkan loading saat memeriksa status autentikasi
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Memverifikasi akses admin...</p>
        </div>
      </div>
    );
  }

  // Jika belum login, redirect ke halaman login akan ditangani oleh ProtectedRoute
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Akses Ditolak</h2>
          <p className="text-gray-600">Anda harus login terlebih dahulu.</p>
        </div>
      </div>
    );
  }

  // Jika bukan admin, tampilkan pesan akses ditolak
  if (user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center bg-white rounded-xl shadow-lg p-8">
          <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Akses Ditolak</h2>
          <p className="text-gray-600 mb-4">
            Halaman ini hanya dapat diakses oleh Administrator.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-left">
            <div className="text-sm">
              <p className="text-yellow-800 font-medium mb-1">Informasi Akun Anda:</p>
              <p className="text-yellow-700">Nama: {user.name}</p>
              <p className="text-yellow-700">Role: {user.role === 'guru' ? 'Guru' : 'User'}</p>
              {user.role === 'guru' && user.subject && (
                <p className="text-yellow-700">Mata Pelajaran: {user.subject}</p>
              )}
              {user.role === 'user' && user.department && (
                <p className="text-yellow-700">Departemen: {user.department}</p>
              )}
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            Hubungi administrator jika Anda memerlukan akses ke panel admin.
          </p>
        </div>
      </div>
    );
  }

  // Jika user adalah admin, tampilkan konten yang dilindungi
  return <>{children}</>;
}
