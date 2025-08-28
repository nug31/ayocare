import React from 'react';
import { Report } from '../context/ReportContext';
import { ClockIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface RecentReportsProps {
  reports: Report[];
}

const priorityColors = {
  low: 'text-green-600 bg-green-50',
  medium: 'text-yellow-600 bg-yellow-50',
  high: 'text-orange-600 bg-orange-50',
  emergency: 'text-red-600 bg-red-50',
};

const statusColors = {
  pending: 'text-yellow-600 bg-yellow-50',
  'in-progress': 'text-blue-600 bg-blue-50',
  resolved: 'text-green-600 bg-green-50',
  closed: 'text-gray-600 bg-gray-50',
};

export default function RecentReports({ reports }: RecentReportsProps) {
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Baru saja';
    if (hours < 24) return `${hours} jam lalu`;
    return `${Math.floor(hours / 24)} hari lalu`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Laporan Terbaru</h3>
        <ClockIcon className="h-5 w-5 text-gray-400" />
      </div>
      
      <div className="space-y-4">
        {reports.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Belum ada laporan</p>
        ) : (
          reports.map((report) => (
            <div key={report.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="flex-shrink-0">
                {report.priority === 'emergency' ? (
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
                ) : (
                  <div className="h-2 w-2 bg-blue-500 rounded-full mt-2"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{report.title}</p>
                <p className="text-sm text-gray-600">{report.location}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${priorityColors[report.priority]}`}>
                    {report.priority === 'low' && 'Rendah'}
                    {report.priority === 'medium' && 'Sedang'}
                    {report.priority === 'high' && 'Tinggi'}
                    {report.priority === 'emergency' && 'Darurat'}
                  </span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusColors[report.status]}`}>
                    {report.status === 'pending' && 'Menunggu'}
                    {report.status === 'in-progress' && 'Proses'}
                    {report.status === 'resolved' && 'Selesai'}
                    {report.status === 'closed' && 'Tutup'}
                  </span>
                </div>
              </div>
              <div className="flex-shrink-0 text-xs text-gray-500">
                {formatTime(report.createdAt)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}