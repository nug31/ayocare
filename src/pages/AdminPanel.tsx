import React, { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  CogIcon,
  UserGroupIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ChatBubbleLeftEllipsisIcon,
  UserIcon,
  BuildingOfficeIcon,
  ChartBarSquareIcon,
  ArrowUpIcon,
  InformationCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useReports } from '../context/ReportContext';
import { useEscalation } from '../hooks/useEscalation';
import { HandlerLevel, HANDLER_LEVELS, getNextHandlerLevel } from '../types/escalation';
import EscalationMatrix from '../components/EscalationMatrix';

const statusOptions = [
  { value: 'pending', label: 'Menunggu', color: 'yellow' },
  { value: 'in-progress', label: 'Dalam Proses', color: 'blue' },
  { value: 'resolved', label: 'Selesai', color: 'green' },
  { value: 'closed', label: 'Tutup', color: 'gray' },
];

export default function AdminPanel() {
  const { state, dispatch } = useReports();
  const { 
    escalateReport, 
    getHandlerInfo, 
    getAvailableEscalationLevels,
    getTimeUntilAutoEscalation,
    formatEscalationTime 
  } = useEscalation();
  
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [responseText, setResponseText] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterHandler, setFilterHandler] = useState('');
  const [showEscalationMatrix, setShowEscalationMatrix] = useState(false);

  let filteredReports = state.reports;
  
  if (filterStatus) {
    filteredReports = filteredReports.filter(report => report.status === filterStatus);
  }
  
  if (filterHandler) {
    filteredReports = filteredReports.filter(report => report.currentHandler === filterHandler);
  }

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

  const handleEscalateReport = (reportId: string, targetLevel: HandlerLevel) => {
    const report = state.reports.find(r => r.id === reportId);
    if (!report) return;
    
    try {
      const updates = escalateReport(report, targetLevel, 'Manual escalation by admin', 'Admin');
      dispatch({
        type: 'UPDATE_REPORT',
        payload: {
          id: reportId,
          updates
        }
      });
    } catch (error) {
      alert('Tidak dapat melakukan eskalasi: ' + error.message);
    }
  };

  const getHandlerLevelColor = (level: HandlerLevel) => {
    const colors: Record<HandlerLevel, string> = {
      [HandlerLevel.USER]: 'bg-blue-50 border-blue-200 text-blue-800',
      [HandlerLevel.WALAS]: 'bg-green-50 border-green-200 text-green-800',
      [HandlerLevel.GA]: 'bg-orange-50 border-orange-200 text-orange-800',
      [HandlerLevel.TOP_MANAGEMENT]: 'bg-red-50 border-red-200 text-red-800',
    };
    return colors[level];
  };

  const getHandlerIcon = (level: HandlerLevel) => {
    const icons: Record<HandlerLevel, React.ComponentType<{ className?: string }>> = {
      [HandlerLevel.USER]: UserIcon,
      [HandlerLevel.WALAS]: UserGroupIcon,
      [HandlerLevel.GA]: BuildingOfficeIcon,
      [HandlerLevel.TOP_MANAGEMENT]: ChartBarSquareIcon,
    };
    return icons[level];
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
              <div className="flex space-x-2">
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
                
                <select
                  value={filterHandler}
                  onChange={(e) => setFilterHandler(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Semua Handler</option>
                  <option value={HandlerLevel.USER}>User/Guru</option>
                  <option value={HandlerLevel.WALAS}>Wali Kelas</option>
                  <option value={HandlerLevel.GA}>General Affairs</option>
                  <option value={HandlerLevel.TOP_MANAGEMENT}>Top Management</option>
                </select>
                
                <button
                  onClick={() => setShowEscalationMatrix(true)}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1"
                >
                  <InformationCircleIcon className="h-4 w-4" />
                  <span>Matriks</span>
                </button>
              </div>
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
                
                {selectedReportData.photos && selectedReportData.photos.length > 0 && (
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
                
                {/* Current Handler */}
                {selectedReportData.currentHandler && (
                  <div>
                    <h5 className="text-sm font-medium text-gray-900 mb-2">Handler Saat Ini:</h5>
                    <div className={`p-3 rounded border ${getHandlerLevelColor(selectedReportData.currentHandler)}`}>
                      <div className="flex items-center space-x-2 mb-1">
                        {(() => {
                          const HandlerIcon = getHandlerIcon(selectedReportData.currentHandler);
                          return <HandlerIcon className="h-4 w-4" />;
                        })()}
                        <span className="font-medium text-sm">
                          {getHandlerInfo(selectedReportData.currentHandler).name}
                        </span>
                      </div>
                      
                      {selectedReportData.assignedTo && (
                        <p className="text-xs">Ditugaskan: {selectedReportData.assignedTo}</p>
                      )}
                      
                      {(() => {
                        const timeUntilEscalation = getTimeUntilAutoEscalation(selectedReportData);
                        if (timeUntilEscalation !== null && timeUntilEscalation > 0) {
                          return (
                            <div className="flex items-center space-x-1 text-xs mt-1">
                              <ClockIcon className="h-3 w-3" />
                              <span>Auto escalation dalam: {formatEscalationTime(timeUntilEscalation)}</span>
                            </div>
                          );
                        }
                        return null;
                      })()} 
                    </div>
                  </div>
                )}
                
                {/* Escalation Actions */}
                {selectedReportData.currentHandler && selectedReportData.status !== 'resolved' && selectedReportData.status !== 'closed' && (
                  <div>
                    <h5 className="text-sm font-medium text-gray-900 mb-2">Eskalasi Handler:</h5>
                    <div className="space-y-2">
                      {getAvailableEscalationLevels(selectedReportData.currentHandler, selectedReportData.priority).map(level => {
                        const handlerInfo = getHandlerInfo(level);
                        const HandlerIcon = getHandlerIcon(level);
                        
                        return (
                          <button
                            key={level}
                            onClick={() => handleEscalateReport(selectedReportData.id, level)}
                            className="w-full flex items-center space-x-2 p-2 border border-gray-300 rounded text-left hover:bg-gray-50 transition-colors text-sm"
                          >
                            <ArrowUpIcon className="h-4 w-4 text-gray-400" />
                            <HandlerIcon className="h-4 w-4 text-gray-500" />
                            <span>Eskalasi ke {handlerInfo.name}</span>
                          </button>
                        );
                      })}
                      
                      {getAvailableEscalationLevels(selectedReportData.currentHandler, selectedReportData.priority).length === 0 && (
                        <p className="text-xs text-gray-500 italic">Sudah di level tertinggi untuk prioritas ini</p>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Escalation History */}
                {selectedReportData.escalationHistory && selectedReportData.escalationHistory.length > 0 && (
                  <div>
                    <h5 className="text-sm font-medium text-gray-900 mb-2">Riwayat Eskalasi:</h5>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {selectedReportData.escalationHistory.map((escalation, index) => (
                        <div key={escalation.id} className="bg-gray-50 p-2 rounded text-xs">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium">
                              {getHandlerInfo(escalation.fromLevel).name} → {getHandlerInfo(escalation.toLevel).name}
                            </span>
                            <span className="text-gray-500">
                              {escalation.reason === 'auto' ? 'Auto' : 'Manual'}
                            </span>
                          </div>
                          <p className="text-gray-600">{formatDate(escalation.escalatedAt)}</p>
                          {escalation.notes && (
                            <p className="text-gray-600 mt-1">{escalation.notes}</p>
                          )}
                        </div>
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
      
      {/* Escalation Matrix Modal */}
      {showEscalationMatrix && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">Matriks Eskalasi</h3>
              <button
                onClick={() => setShowEscalationMatrix(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-4">
              <EscalationMatrix />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
