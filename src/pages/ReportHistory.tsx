import React, { useState } from 'react';
import { MagnifyingGlassIcon, FunnelIcon, EyeIcon } from '@heroicons/react/24/outline';
import { useReports } from '../context/ReportContext';

const statusColors = {
  pending: { bg: 'bg-yellow-50', text: 'text-yellow-800', border: 'border-yellow-200' },
  'in-progress': { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200' },
  resolved: { bg: 'bg-green-50', text: 'text-green-800', border: 'border-green-200' },
  closed: { bg: 'bg-gray-50', text: 'text-gray-800', border: 'border-gray-200' },
};

const priorityColors = {
  low: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  medium: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
  high: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  emergency: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
};

export default function ReportHistory() {
  const { state } = useReports();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  const filteredReports = state.reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || report.status === statusFilter;
    const matchesPriority = !priorityFilter || report.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Menunggu',
      'in-progress': 'Dalam Proses',
      resolved: 'Selesai',
      closed: 'Tutup'
    };
    return labels[status] || status;
  };

  const getPriorityLabel = (priority: string) => {
    const labels: Record<string, string> = {
      low: 'Rendah',
      medium: 'Sedang',
      high: 'Tinggi',
      emergency: 'Darurat'
    };
    return labels[priority] || priority;
  };

  const selectedReportData = selectedReport ? state.reports.find(r => r.id === selectedReport) : null;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Riwayat Laporan</h1>
        <p className="text-gray-600">
          Pantau status dan progres laporan yang telah Anda buat
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari laporan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <FunnelIcon className="h-5 w-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Semua Status</option>
                <option value="pending">Menunggu</option>
                <option value="in-progress">Dalam Proses</option>
                <option value="resolved">Selesai</option>
                <option value="closed">Tutup</option>
              </select>
            </div>
            
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Semua Prioritas</option>
              <option value="emergency">Darurat</option>
              <option value="high">Tinggi</option>
              <option value="medium">Sedang</option>
              <option value="low">Rendah</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {filteredReports.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
              <MagnifyingGlassIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada laporan ditemukan</h3>
              <p className="text-gray-600">Coba ubah filter atau buat laporan baru</p>
            </div>
          ) : (
            filteredReports.map((report) => (
              <div key={report.id} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{report.title}</h3>
                    <p className="text-gray-600">{report.location}</p>
                  </div>
                  <button
                    onClick={() => setSelectedReport(report.id)}
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <EyeIcon className="h-4 w-4" />
                    <span className="text-sm">Lihat</span>
                  </button>
                </div>
                
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[report.status].bg} ${statusColors[report.status].text} ${statusColors[report.status].border}`}>
                    {getStatusLabel(report.status)}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${priorityColors[report.priority].bg} ${priorityColors[report.priority].text} ${priorityColors[report.priority].border}`}>
                    {getPriorityLabel(report.priority)}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{report.description}</p>
                
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Dibuat: {formatDate(report.createdAt)}</span>
                  <span>Update: {formatDate(report.updatedAt)}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Detail Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-6">
            {selectedReportData ? (
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Detail Laporan</h3>
                  <p className="text-sm text-gray-600">ID: {selectedReportData.id}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900">{selectedReportData.title}</h4>
                  <p className="text-sm text-gray-600">{selectedReportData.location}</p>
                </div>
                
                <div className="space-y-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[selectedReportData.status].bg} ${statusColors[selectedReportData.status].text} ${statusColors[selectedReportData.status].border}`}>
                    {getStatusLabel(selectedReportData.status)}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ml-2 ${priorityColors[selectedReportData.priority].bg} ${priorityColors[selectedReportData.priority].text} ${priorityColors[selectedReportData.priority].border}`}>
                    {getPriorityLabel(selectedReportData.priority)}
                  </span>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-1">Deskripsi:</h5>
                  <p className="text-sm text-gray-600">{selectedReportData.description}</p>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-1">Pelapor:</h5>
                  <p className="text-sm text-gray-600">{selectedReportData.reporterName}</p>
                  <p className="text-sm text-gray-500">{selectedReportData.reporterPosition}</p>
                </div>
                
                {selectedReportData.adminResponse && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <h5 className="text-sm font-medium text-blue-900 mb-1">Respons Admin:</h5>
                    <p className="text-sm text-blue-800">{selectedReportData.adminResponse}</p>
                  </div>
                )}
                
                {selectedReportData.photos.length > 0 && (
                  <div>
                    <h5 className="text-sm font-medium text-gray-900 mb-2">Foto:</h5>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedReportData.photos.map((photo, index) => (
                        <img
                          key={index}
                          src={photo}
                          alt={`Foto ${index + 1}`}
                          className="w-full h-20 object-cover rounded border"
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="text-xs text-gray-500 pt-2 border-t">
                  <p>Dibuat: {formatDate(selectedReportData.createdAt)}</p>
                  <p>Diperbarui: {formatDate(selectedReportData.updatedAt)}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <EyeIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Pilih laporan untuk melihat detail</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}