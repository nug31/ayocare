import React from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import EscalationMatrix from '../components/EscalationMatrix';

export default function EscalationPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center space-x-4 mb-4">
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span>Kembali ke Admin Panel</span>
          </button>
        </div>
        
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Sistem Eskalasi Laporan</h1>
          <p className="text-gray-600">
            Panduan lengkap tentang tingkatan penanganan laporan dan sistem eskalasi otomatis
          </p>
        </div>
      </div>

      {/* Escalation Matrix */}
      <EscalationMatrix />

      {/* Additional Information */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Cara Kerja Sistem</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">🔄 Eskalasi Otomatis</h3>
            <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
              <li>Sistem akan otomatis menaikkan level handler jika laporan tidak ditangani dalam batas waktu</li>
              <li>Batas waktu berbeda untuk setiap prioritas dan level handler</li>
              <li>Eskalasi otomatis dapat dimatikan per laporan oleh admin</li>
              <li>Laporan emergency akan escalate lebih cepat (30 menit)</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-2">👥 Eskalasi Manual</h3>
            <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
              <li>Admin dapat melakukan eskalasi manual kapan saja</li>
              <li>Eskalasi manual akan tercatat dalam riwayat dengan alasan</li>
              <li>Tidak dapat menurunkan level handler (hanya naik)</li>
              <li>Ada batasan maksimal level berdasarkan prioritas laporan</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">💡 Tips Penggunaan</h3>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li><strong>User/Guru:</strong> Untuk masalah sederhana yang bisa diselesaikan sendiri</li>
            <li><strong>Wali Kelas:</strong> Untuk masalah yang memerlukan koordinasi antar kelas</li>
            <li><strong>General Affairs:</strong> Untuk masalah infrastruktur dan fasilitas</li>
            <li><strong>Top Management:</strong> Untuk keputusan strategis dan situasi kritis</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
