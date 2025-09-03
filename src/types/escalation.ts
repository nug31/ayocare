// Handler levels untuk sistem eskalasi laporan
export enum HandlerLevel {
  USER = 'user',           // Ditangani oleh user/guru yang bersangkutan
  WALAS = 'walas',         // Ditangani oleh Wali Kelas
  GA = 'ga',               // Ditangani oleh General Affairs
  TOP_MANAGEMENT = 'top'   // Ditangani oleh Top Management
}

// Mapping kategori ke handler level default
export const CATEGORY_HANDLER_MAPPING: Record<string, HandlerLevel> = {
  // Level User - Bisa ditangani sendiri
  'classroom': HandlerLevel.USER,
  'library': HandlerLevel.USER,
  'teacher-room': HandlerLevel.USER,
  
  // Level Walas - Perlu koordinasi kelas
  'corridor': HandlerLevel.WALAS,
  'toilet': HandlerLevel.WALAS,
  'canteen': HandlerLevel.WALAS,
  
  // Level GA - Fasilitas dan infrastruktur
  'workshop-tkr': HandlerLevel.GA,
  'workshop-elind': HandlerLevel.GA,
  'workshop-listrik': HandlerLevel.GA,
  'workshop-tsm': HandlerLevel.GA,
  'workshop-tki': HandlerLevel.GA,
  'podcast': HandlerLevel.GA,
  'yard': HandlerLevel.GA,
  'parking': HandlerLevel.GA,
  'other': HandlerLevel.GA,
};

// Eskalasi berdasarkan prioritas dan waktu
export const ESCALATION_RULES = {
  emergency: {
    autoEscalateAfter: 30, // menit
    maxLevel: HandlerLevel.TOP_MANAGEMENT
  },
  high: {
    autoEscalateAfter: 120, // menit (2 jam)
    maxLevel: HandlerLevel.TOP_MANAGEMENT
  },
  medium: {
    autoEscalateAfter: 480, // menit (8 jam)
    maxLevel: HandlerLevel.GA
  },
  low: {
    autoEscalateAfter: 1440, // menit (24 jam)
    maxLevel: HandlerLevel.GA
  }
};

// Interface untuk tracking eskalasi
export interface EscalationHistory {
  id: string;
  fromLevel: HandlerLevel;
  toLevel: HandlerLevel;
  reason: 'auto' | 'manual' | 'timeout';
  escalatedBy?: string;
  escalatedAt: Date;
  notes?: string;
}

// Interface untuk handler info
export interface HandlerInfo {
  level: HandlerLevel;
  name: string;
  description: string;
  capabilities: string[];
  escalationThreshold: number; // dalam menit
}

// Data handler levels
export const HANDLER_LEVELS: Record<HandlerLevel, HandlerInfo> = {
  [HandlerLevel.USER]: {
    level: HandlerLevel.USER,
    name: 'User/Guru',
    description: 'Penanganan mandiri oleh pelapor atau guru terkait',
    capabilities: [
      'Perbaikan sederhana',
      'Koordinasi dengan siswa',
      'Pembersihan ringan',
      'Penataan ulang'
    ],
    escalationThreshold: 480 // 8 jam
  },
  [HandlerLevel.WALAS]: {
    level: HandlerLevel.WALAS,
    name: 'Wali Kelas',
    description: 'Koordinasi tingkat kelas dan area umum',
    capabilities: [
      'Koordinasi antar kelas',
      'Manajemen fasilitas umum',
      'Pengaturan jadwal',
      'Komunikasi dengan orangtua'
    ],
    escalationThreshold: 240 // 4 jam
  },
  [HandlerLevel.GA]: {
    level: HandlerLevel.GA,
    name: 'General Affairs',
    description: 'Penanganan infrastruktur dan fasilitas sekolah',
    capabilities: [
      'Perbaikan infrastruktur',
      'Maintenance peralatan',
      'Procurement',
      'Vendor management',
      'Safety management'
    ],
    escalationThreshold: 120 // 2 jam
  },
  [HandlerLevel.TOP_MANAGEMENT]: {
    level: HandlerLevel.TOP_MANAGEMENT,
    name: 'Top Management',
    description: 'Keputusan strategis dan penanganan kritis',
    capabilities: [
      'Keputusan strategis',
      'Budget approval',
      'Policy changes',
      'Emergency response',
      'External coordination'
    ],
    escalationThreshold: 0 // No further escalation
  }
};

// Fungsi utility
export function getHandlerForCategory(category: string): HandlerLevel {
  return CATEGORY_HANDLER_MAPPING[category] || HandlerLevel.GA;
}

export function getNextHandlerLevel(currentLevel: HandlerLevel): HandlerLevel | null {
  const levels = Object.values(HandlerLevel);
  const currentIndex = levels.indexOf(currentLevel);
  
  if (currentIndex < levels.length - 1) {
    return levels[currentIndex + 1];
  }
  
  return null; // Already at top level
}

export function shouldAutoEscalate(
  createdAt: Date, 
  currentLevel: HandlerLevel, 
  priority: 'low' | 'medium' | 'high' | 'emergency',
  lastEscalatedAt?: Date
): boolean {
  const now = new Date();
  const baseTime = lastEscalatedAt || createdAt;
  const minutesSince = (now.getTime() - baseTime.getTime()) / (1000 * 60);
  
  const rule = ESCALATION_RULES[priority];
  const handlerInfo = HANDLER_LEVELS[currentLevel];
  
  return minutesSince >= Math.min(rule.autoEscalateAfter, handlerInfo.escalationThreshold);
}

export function canEscalateTo(
  currentLevel: HandlerLevel, 
  targetLevel: HandlerLevel,
  priority: 'low' | 'medium' | 'high' | 'emergency'
): boolean {
  const rule = ESCALATION_RULES[priority];
  const levels = Object.values(HandlerLevel);
  
  const currentIndex = levels.indexOf(currentLevel);
  const targetIndex = levels.indexOf(targetLevel);
  const maxIndex = levels.indexOf(rule.maxLevel);
  
  return targetIndex > currentIndex && targetIndex <= maxIndex;
}
