import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  HandlerLevel, 
  EscalationHistory, 
  shouldAutoEscalate, 
  getNextHandlerLevel,
  canEscalateTo,
  HANDLER_LEVELS
} from '../types/escalation';
import { Report } from '../context/ReportContext';

export function useEscalation() {
  
  // Fungsi untuk eskalasi manual
  const escalateReport = useCallback((
    report: Report, 
    targetLevel: HandlerLevel, 
    reason: string = '',
    escalatedBy?: string
  ): Partial<Report> => {
    
    if (!canEscalateTo(report.currentHandler, targetLevel, report.priority)) {
      throw new Error('Cannot escalate to this level');
    }

    const escalationRecord: EscalationHistory = {
      id: uuidv4(),
      fromLevel: report.currentHandler,
      toLevel: targetLevel,
      reason: 'manual',
      escalatedBy,
      escalatedAt: new Date(),
      notes: reason
    };

    return {
      currentHandler: targetLevel,
      escalationHistory: [...report.escalationHistory, escalationRecord],
      lastEscalatedAt: new Date(),
      updatedAt: new Date()
    };
  }, []);

  // Fungsi untuk eskalasi otomatis
  const checkAutoEscalation = useCallback((report: Report): Partial<Report> | null => {
    if (!report.autoEscalationEnabled || 
        report.status === 'resolved' || 
        report.status === 'closed') {
      return null;
    }

    const shouldEscalate = shouldAutoEscalate(
      report.createdAt,
      report.currentHandler,
      report.priority,
      report.lastEscalatedAt
    );

    if (!shouldEscalate) {
      return null;
    }

    const nextLevel = getNextHandlerLevel(report.currentHandler);
    if (!nextLevel || !canEscalateTo(report.currentHandler, nextLevel, report.priority)) {
      return null;
    }

    const escalationRecord: EscalationHistory = {
      id: uuidv4(),
      fromLevel: report.currentHandler,
      toLevel: nextLevel,
      reason: 'auto',
      escalatedAt: new Date(),
      notes: `Auto escalation due to timeout (${report.priority} priority)`
    };

    return {
      currentHandler: nextLevel,
      escalationHistory: [...report.escalationHistory, escalationRecord],
      lastEscalatedAt: new Date(),
      updatedAt: new Date()
    };
  }, []);

  // Fungsi untuk batch check semua reports
  const checkAllReportsForEscalation = useCallback((reports: Report[]): Report[] => {
    return reports.map(report => {
      const escalationUpdate = checkAutoEscalation(report);
      if (escalationUpdate) {
        return { ...report, ...escalationUpdate };
      }
      return report;
    });
  }, [checkAutoEscalation]);

  // Fungsi untuk assign laporan ke person tertentu
  const assignReport = useCallback((
    report: Report,
    assignedTo: string,
    assignedBy?: string
  ): Partial<Report> => {
    return {
      assignedTo,
      updatedAt: new Date()
    };
  }, []);

  // Fungsi untuk mendapatkan informasi handler saat ini
  const getHandlerInfo = useCallback((level: HandlerLevel) => {
    return HANDLER_LEVELS[level];
  }, []);

  // Fungsi untuk mendapatkan daftar level yang bisa dieskalasi
  const getAvailableEscalationLevels = useCallback((
    currentLevel: HandlerLevel, 
    priority: 'low' | 'medium' | 'high' | 'emergency'
  ): HandlerLevel[] => {
    const allLevels = Object.values(HandlerLevel);
    const currentIndex = allLevels.indexOf(currentLevel);
    
    return allLevels
      .slice(currentIndex + 1)
      .filter(level => canEscalateTo(currentLevel, level, priority));
  }, []);

  // Fungsi untuk mendapatkan time until next auto escalation
  const getTimeUntilAutoEscalation = useCallback((report: Report): number | null => {
    if (!report.autoEscalationEnabled || 
        report.status === 'resolved' || 
        report.status === 'closed') {
      return null;
    }

    const nextLevel = getNextHandlerLevel(report.currentHandler);
    if (!nextLevel) return null;

    const now = new Date();
    const baseTime = report.lastEscalatedAt || report.createdAt;
    const minutesSince = (now.getTime() - baseTime.getTime()) / (1000 * 60);
    
    const handlerInfo = HANDLER_LEVELS[report.currentHandler];
    const remainingMinutes = handlerInfo.escalationThreshold - minutesSince;
    
    return Math.max(0, remainingMinutes);
  }, []);

  // Fungsi untuk format waktu eskalasi
  const formatEscalationTime = useCallback((minutes: number): string => {
    if (minutes < 60) {
      return `${Math.round(minutes)} menit`;
    } else if (minutes < 1440) {
      const hours = Math.round(minutes / 60);
      return `${hours} jam`;
    } else {
      const days = Math.round(minutes / 1440);
      return `${days} hari`;
    }
  }, []);

  return {
    escalateReport,
    checkAutoEscalation,
    checkAllReportsForEscalation,
    assignReport,
    getHandlerInfo,
    getAvailableEscalationLevels,
    getTimeUntilAutoEscalation,
    formatEscalationTime
  };
}
