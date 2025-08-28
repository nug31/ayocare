import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface Report {
  id: string;
  title: string;
  location: string;
  category: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'emergency';
  reporterName: string;
  reporterPosition: string;
  photos: string[];
  status: 'pending' | 'in-progress' | 'resolved' | 'closed';
  createdAt: Date;
  updatedAt: Date;
  adminResponse?: string;
}

interface ReportState {
  reports: Report[];
  stats: {
    total: number;
    pending: number;
    inProgress: number;
    resolved: number;
    highPriority: number;
  };
}

type ReportAction =
  | { type: 'ADD_REPORT'; payload: Omit<Report, 'id' | 'status' | 'createdAt' | 'updatedAt'> }
  | { type: 'UPDATE_REPORT'; payload: { id: string; updates: Partial<Report> } }
  | { type: 'DELETE_REPORT'; payload: string };

const initialState: ReportState = {
  reports: [
    {
      id: '1',
      title: 'Mesin Bubut Tidak Normal',
      location: 'Bengkel Mesin',
      category: 'workshop-machine',
      description: 'Suara mesin bubut sangat berisik dan bergetar tidak normal. Kemungkinan ada masalah pada bearing. Saya khawatir ini berbahaya untuk siswa yang praktikum.',
      priority: 'high',
      reporterName: 'Ahmad Rizki',
      reporterPosition: 'Guru Teknik Mesin',
      photos: ['https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg'],
      status: 'pending',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: '2',
      title: 'Kabel Listrik Terkelupas',
      location: 'Laboratorium Elektronika',
      category: 'laboratory',
      description: 'Ditemukan kabel listrik dengan isolasi terkelupas di dekat meja praktikum. Sangat berbahaya untuk keselamatan siswa. Perlu segera diperbaiki.',
      priority: 'emergency',
      reporterName: 'Siti Nurhaliza',
      reporterPosition: 'Guru Elektronika',
      photos: ['https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg'],
      status: 'in-progress',
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      adminResponse: 'Tim maintenance sudah diberitahu dan sedang menuju lokasi.',
    },
    {
      id: '3',
      title: 'Lantai Licin di Area Kerja',
      location: 'Bengkel Otomotif',
      category: 'workshop-automotive',
      description: 'Lantai bengkel sangat licin akibat tumpahan oli. Sudah beberapa siswa hampir terpeleset. Perlu segera dibersihkan untuk mencegah kecelakaan.',
      priority: 'medium',
      reporterName: 'Budi Santoso',
      reporterPosition: 'Guru Otomotif',
      photos: ['https://images.pexels.com/photos/279949/pexels-photo-279949.jpeg'],
      status: 'resolved',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      adminResponse: 'Lantai sudah dibersihkan dan diberi tanda peringatan.',
    },
  ],
  stats: { total: 0, pending: 0, inProgress: 0, resolved: 0, highPriority: 0 },
};

// Calculate initial stats
initialState.stats = calculateStats(initialState.reports);

function calculateStats(reports: Report[]) {
  return {
    total: reports.length,
    pending: reports.filter(r => r.status === 'pending').length,
    inProgress: reports.filter(r => r.status === 'in-progress').length,
    resolved: reports.filter(r => r.status === 'resolved' || r.status === 'closed').length,
    highPriority: reports.filter(r => r.priority === 'high' || r.priority === 'emergency').length,
  };
}

function reportReducer(state: ReportState, action: ReportAction): ReportState {
  switch (action.type) {
    case 'ADD_REPORT': {
      const newReport: Report = {
        ...action.payload,
        id: uuidv4(),
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const newReports = [...state.reports, newReport];
      return {
        reports: newReports,
        stats: calculateStats(newReports),
      };
    }
    case 'UPDATE_REPORT': {
      const newReports = state.reports.map(report =>
        report.id === action.payload.id
          ? { ...report, ...action.payload.updates, updatedAt: new Date() }
          : report
      );
      return {
        reports: newReports,
        stats: calculateStats(newReports),
      };
    }
    case 'DELETE_REPORT': {
      const newReports = state.reports.filter(report => report.id !== action.payload);
      return {
        reports: newReports,
        stats: calculateStats(newReports),
      };
    }
    default:
      return state;
  }
}

const ReportContext = createContext<{
  state: ReportState;
  dispatch: React.Dispatch<ReportAction>;
} | null>(null);

export function ReportProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reportReducer, initialState);

  return (
    <ReportContext.Provider value={{ state, dispatch }}>
      {children}
    </ReportContext.Provider>
  );
}

export function useReports() {
  const context = useContext(ReportContext);
  if (!context) {
    throw new Error('useReports must be used within a ReportProvider');
  }
  return context;
}