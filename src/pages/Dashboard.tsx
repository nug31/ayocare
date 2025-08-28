import React from 'react';
import { Link } from 'react-router-dom';
import {
  PlusIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  CheckCircleIcon,
  ChartBarIcon,
  CogIcon,
} from '@heroicons/react/24/outline';
import { useReports } from '../context/ReportContext';
import { useAuth } from '../context/AuthContext';
import StatsCard from '../components/StatsCard';
import RecentReports from '../components/RecentReports';
import PriorityChart from '../components/PriorityChart';

export default function Dashboard() {
  const { state } = useReports();
  const { user } = useAuth();
  const { stats, reports } = state;

  const recentReports = reports
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const emergencyReports = reports.filter(r => r.priority === 'emergency' && r.status === 'pending');

  // Role-specific header content
  const getHeaderContent = () => {
    switch (user?.role) {
      case 'admin':
        return {
          title: 'Dashboard Admin',
          subtitle: 'Panel kontrol administratif untuk mengelola sistem pelaporan keselamatan'
        };
      case 'user':
        return {
          title: 'Dashboard User',
          subtitle: 'Platform pelaporan keselamatan - Laporkan kondisi berbahaya di sekitar Anda'
        };
      case 'guru':
        return {
          title: 'Dashboard Guru',
          subtitle: 'Platform pelaporan keselamatan sekolah teknik - Pantau kondisi kelas dan bengkel'
        };
      default:
        return {
          title: 'Dashboard Ayo Care',
          subtitle: 'Platform pelaporan keamanan sekolah teknik yang terintegrasi'
        };
    }
  };

  const headerContent = getHeaderContent();

  // Quick actions berdasarkan role
  const getQuickActions = () => {
    const baseActions = [
      {
        to: '/report',
        icon: PlusIcon,
        title: 'Buat Laporan',
        description: 'Laporkan kondisi berbahaya',
        bgColor: 'bg-turquoise-50',
        hoverColor: 'hover:bg-turquoise-100',
        iconColor: 'text-turquoise-600'
      },
      {
        to: '/history',
        icon: ClockIcon,
        title: 'Lihat Riwayat',
        description: 'Track status laporan',
        bgColor: 'bg-mint-50',
        hoverColor: 'hover:bg-mint-100',
        iconColor: 'text-mint-600'
      }
    ];

    if (user?.role === 'admin') {
      return [
        {
          to: '/admin',
          icon: CogIcon,
          title: 'Panel Admin',
          description: 'Kelola semua laporan',
          bgColor: 'bg-citrus-50',
          hoverColor: 'hover:bg-citrus-100',
          iconColor: 'text-citrus-600'
        },
        ...baseActions
      ];
    }

    return baseActions;
  };

  const quickActions = getQuickActions();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-fresh-gradient rounded-xl p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">{headerContent.title}</h1>
            <p className="text-white/80">
              {headerContent.subtitle}
            </p>
          </div>
          {user?.role !== 'admin' && (
            <div className="mt-4 sm:mt-0">
              <Link
                to="/report"
                className="inline-flex items-center px-6 py-3 bg-white text-pool-600 font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Buat Laporan Baru
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Emergency Alerts */}
      {emergencyReports.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-6 w-6 text-red-400 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-red-800">
                Peringatan: {emergencyReports.length} Laporan Darurat Menunggu Penanganan
              </h3>
              <div className="mt-2 text-sm text-red-700">
                {emergencyReports.slice(0, 2).map(report => (
                  <div key={report.id}>• {report.title} - {report.location}</div>
                ))}
                {emergencyReports.length > 2 && (
                  <div>• Dan {emergencyReports.length - 2} laporan darurat lainnya...</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Laporan"
          value={stats.total}
          icon={ChartBarIcon}
          color="blue"
          description="Semua laporan"
        />
        <StatsCard
          title="Menunggu"
          value={stats.pending}
          icon={ClockIcon}
          color="yellow"
          description="Belum ditangani"
        />
        <StatsCard
          title="Dalam Proses"
          value={stats.inProgress}
          icon={ExclamationTriangleIcon}
          color="orange"
          description="Sedang ditangani"
        />
        <StatsCard
          title="Selesai"
          value={stats.resolved}
          icon={CheckCircleIcon}
          color="green"
          description="Sudah diselesaikan"
        />
      </div>

      {/* Charts and Recent Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PriorityChart reports={reports} />
        <RecentReports reports={recentReports} />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Aksi Cepat</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <Link
                key={index}
                to={action.to}
                className={`flex items-center p-4 ${action.bgColor} rounded-lg ${action.hoverColor} transition-colors group`}
              >
                <IconComponent className={`h-8 w-8 ${action.iconColor} mr-3 group-hover:scale-110 transition-transform`} />
                <div>
                  <h4 className="font-medium text-gray-900">{action.title}</h4>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}