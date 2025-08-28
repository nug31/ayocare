import React, { useState } from 'react';
import {
  ChartBarIcon,
  CogIcon,
  UserGroupIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ChatBubbleLeftEllipsisIcon,
} from '@heroicons/react/24/outline';
import { useReports } from '../context/ReportContext';

const statusOptions = [
  { value: 'pending', label: 'Menunggu', color: 'yellow' },
  { value: 'in-progress', label: 'Dalam Proses', color: 'blue' },
  { value: 'resolved', label: 'Selesai', color: 'green' },
  { value: 'closed', label: 'Tutup', color: 'gray' },
];

export default function AdminPanel() {
  const { state, dispatch } = useReports();
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [responseText, setResponseText] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const filteredReports = filterStatus 
    ? state.reports.filter(report => report.status === filterStatus)
    : state.reports;

  const selectedReportData = selectedReport ? state.reports.find(r => r.id === selectedReport) : null;

  const updateReportStatus = (reportId: string, status: 'pending' | 'in-progress' | 'resolved' | 'closed') => {
    dispatch({
      type: 'UPDATE_REPORT',
      payload: {
        id: reportId,
        updates: { status }
      }
    });
  };

  const addResponse = (reportId: string) => {
    if (responseText.trim()) {
      dispatch({
        type: 'UPDATE_REPORT',
        payload: {
          id: reportId,
          updates: { adminResponse: responseText }
        }
      });
      setResponseText('');
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('id-ID', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      low: 'text-green-600 bg-green-50 border-green-200',
      medium: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      high: 'text-orange-600 bg-orange-50 border-orange-200',
      emergency: 'text-red-600 bg-red-50 border-red-200',
    };
    return colors[priority] || 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      'in-progress': 'text-blue-600 bg-blue-50 border-blue-200',
      resolved: 'text-green-600 bg-green-50 border-green-200',
      closed: 'text-gray-600 bg-gray-50 border-gray-200',
    };
    return colors[status] || 'text-gray-600 bg-gray-50 border-gray-200';
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-citrus-gradient rounded-xl p-6 text-white">
        <div className="flex items-center space-x-3 mb-2">
          <CogIcon className="h-8 w-8" />
          <h1 className="text-2xl font-bold">Panel Administrasi</h1>
        </div>
        <p className="text-white/80">
          Kelola dan tangani semua laporan dari pengguna
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Laporan</p>
              <p className="text-3xl font-bold text-gray-900">{state.stats.total}</p>
            </div>
            <ChartBarIcon className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Menunggu</p>
              <p className="text-3xl font-bold text-yellow-600">{state.stats.pending}</p>
            </div>
            <ClockIcon className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Dalam Proses</p>
              <p className="text-3xl font-bold text-blue-600">{state.stats.inProgress}</p>
            </div>
            <ExclamationTriangleIcon className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Selesai</p>
              <p className="text-3xl font-bold text-green-600">{state.stats.resolved}</p>
            </div>
            <CheckCircleIcon className="h-8 w-8 text-green-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Reports List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Daftar Laporan</h2>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Semua Status</option>
                {statusOptions.map(status => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-3">
              {filteredReports.map((report) => (
                <div
                  key={report.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-sm ${
                    selectedReport === report.id ? 'ring-2 ring-blue-500 border-blue-200' : 'border-gray-200'
                  }`}
                  onClick={() => setSelectedReport(report.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">{report.title}</h3>
                      <p className="text-sm text-gray-600">{report.location}</p>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(report.priority)}`}>
                        {report.priority === 'emergency' ? 'Darurat' : 
                         report.priority === 'high' ? 'Tinggi' : 
                         report.priority === 'medium' ? 'Sedang' : 'Rendah'}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(report.status)}`}>
                        {report.status === 'pending' ? 'Menunggu' : 
                         report.status === 'in-progress' ? 'Proses' : 
                         report.status === 'resolved' ? 'Selesai' : 'Tutup'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{report.reporterName} ({report.reporterPosition})</span>
                    <span>{formatDate(report.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
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
                  <h4 className="font-medium text-gray-900 mb-1">{selectedReportData.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">{selectedReportData.location}</p>
                  <p className="text-sm text-gray-700">{selectedReportData.description}</p>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-1">Pelapor:</h5>
                  <p className="text-sm text-gray-600">{selectedReportData.reporterName}</p>
                  <p className="text-sm text-gray-500">{selectedReportData.reporterPosition}</p>
                </div>
                
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
                
                {/* Status Update */}
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-2">Update Status:</h5>
                  <div className="grid grid-cols-2 gap-2">
                    {statusOptions.map(status => (
                      <button
                        key={status.value}
                        onClick={() => updateReportStatus(selectedReportData.id, status.value as any)}
                        className={`p-2 text-xs font-medium rounded border transition-colors ${
                          selectedReportData.status === status.value
                            ? getStatusColor(status.value)
                            : 'text-gray-600 bg-gray-50 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        {status.label}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Admin Response */}
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-2">Respons Admin:</h5>
                  {selectedReportData.adminResponse && (
                    <div className="bg-blue-50 p-3 rounded border mb-2">
                      <p className="text-sm text-blue-800">{selectedReportData.adminResponse}</p>
                    </div>
                  )}
                  <div className="space-y-2">
                    <textarea
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                      placeholder="Tulis respons atau update..."
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                      rows={3}
                    />
                    <button
                      onClick={() => addResponse(selectedReportData.id)}
                      disabled={!responseText.trim()}
                      className="w-full px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Kirim Respons
                    </button>
                  </div>
                </div>
                
                <div className="text-xs text-gray-500 pt-4 border-t">
                  <p>Dibuat: {formatDate(selectedReportData.createdAt)}</p>
                  <p>Diperbarui: {formatDate(selectedReportData.updatedAt)}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <UserGroupIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Pilih laporan untuk melihat detail dan mengelola</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}