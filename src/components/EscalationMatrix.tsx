import React, { useState } from 'react';
import {
  UserIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  ChartBarSquareIcon,
  InformationCircleIcon,
  ChevronRightIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { 
  HandlerLevel, 
  HANDLER_LEVELS, 
  CATEGORY_HANDLER_MAPPING,
  ESCALATION_RULES,
  getHandlerForCategory 
} from '../types/escalation';

const categories = [
  { value: 'classroom', label: 'Ruang Kelas' },
  { value: 'workshop-tkr', label: 'Workshop TKR' },
  { value: 'workshop-elind', label: 'Workshop ELIND' },
  { value: 'workshop-listrik', label: 'Workshop Listrik' },
  { value: 'workshop-tsm', label: 'Workshop TSM' },
  { value: 'workshop-tki', label: 'Workshop TKI' },
  { value: 'library', label: 'Perpustakaan' },
  { value: 'teacher-room', label: 'Ruang Guru' },
  { value: 'podcast', label: 'Podcast' },
  { value: 'canteen', label: 'Kantin' },
  { value: 'toilet', label: 'Toilet' },
  { value: 'corridor', label: 'Koridor' },
  { value: 'yard', label: 'Halaman' },
  { value: 'parking', label: 'Parkiran' },
  { value: 'other', label: 'Lainnya' },
];

const HandlerLevelIcons: Record<HandlerLevel, React.ComponentType<{ className?: string }>> = {
  [HandlerLevel.USER]: UserIcon,
  [HandlerLevel.WALAS]: UserGroupIcon,
  [HandlerLevel.GA]: BuildingOfficeIcon,
  [HandlerLevel.TOP_MANAGEMENT]: ChartBarSquareIcon,
};

const HandlerLevelColors: Record<HandlerLevel, string> = {
  [HandlerLevel.USER]: 'bg-blue-50 border-blue-200 text-blue-800',
  [HandlerLevel.WALAS]: 'bg-green-50 border-green-200 text-green-800',
  [HandlerLevel.GA]: 'bg-orange-50 border-orange-200 text-orange-800',
  [HandlerLevel.TOP_MANAGEMENT]: 'bg-red-50 border-red-200 text-red-800',
};

interface EscalationMatrixProps {
  showCategoryMapping?: boolean;
  showEscalationRules?: boolean;
  selectedCategory?: string;
}

export default function EscalationMatrix({ 
  showCategoryMapping = true, 
  showEscalationRules = true,
  selectedCategory 
}: EscalationMatrixProps) {
  const [activeTab, setActiveTab] = useState<'levels' | 'categories' | 'rules'>('levels');

  const formatTime = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes} menit`;
    } else if (minutes < 1440) {
      return `${Math.round(minutes / 60)} jam`;
    } else {
      return `${Math.round(minutes / 1440)} hari`;
    }
  };

  const getPriorityColor = (priority: string): string => {
    const colors: Record<string, string> = {
      low: 'bg-green-50 border-green-200 text-green-800',
      medium: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      high: 'bg-orange-50 border-orange-200 text-orange-800',
      emergency: 'bg-red-50 border-red-200 text-red-800',
    };
    return colors[priority] || 'bg-gray-50 border-gray-200 text-gray-800';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border">
      {/* Header */}
      <div className="border-b p-6">
        <div className="flex items-center space-x-3 mb-2">
          <InformationCircleIcon className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Matriks Eskalasi Laporan</h2>
        </div>
        <p className="text-gray-600">
          Sistem tingkatan penanganan laporan berdasarkan kategori dan prioritas
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <nav className="flex space-x-8 px-6">
          <button
            onClick={() => setActiveTab('levels')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'levels'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Handler Levels
          </button>
          {showCategoryMapping && (
            <button
              onClick={() => setActiveTab('categories')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'categories'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Mapping Kategori
            </button>
          )}
          {showEscalationRules && (
            <button
              onClick={() => setActiveTab('rules')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'rules'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Aturan Eskalasi
            </button>
          )}
        </nav>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Handler Levels Tab */}
        {activeTab === 'levels' && (
          <div className="space-y-4">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Tingkatan Handler</h3>
              <p className="text-sm text-gray-600">
                Sistem eskalasi berlevel untuk menangani laporan sesuai kompleksitas dan urgency
              </p>
            </div>
            
            <div className="grid gap-4">
              {Object.values(HandlerLevel).map((level, index) => {
                const handlerInfo = HANDLER_LEVELS[level];
                const IconComponent = HandlerLevelIcons[level];
                
                return (
                  <div key={level} className="relative">
                    <div className={`border rounded-lg p-4 ${HandlerLevelColors[level]}`}>
                      <div className="flex items-start space-x-3">
                        <IconComponent className="h-6 w-6 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">{handlerInfo.name}</h4>
                            <span className="text-xs px-2 py-1 bg-white/20 rounded-full">
                              Level {index + 1}
                            </span>
                          </div>
                          <p className="text-sm mb-3">{handlerInfo.description}</p>
                          
                          <div className="space-y-2">
                            <div>
                              <h5 className="text-xs font-medium mb-1">Kemampuan:</h5>
                              <div className="flex flex-wrap gap-1">
                                {handlerInfo.capabilities.map((capability, idx) => (
                                  <span key={idx} className="text-xs px-2 py-0.5 bg-white/30 rounded">
                                    {capability}
                                  </span>
                                ))}
                              </div>
                            </div>
                            
                            {handlerInfo.escalationThreshold > 0 && (
                              <div className="flex items-center space-x-1 text-xs">
                                <ClockIcon className="h-3 w-3" />
                                <span>Auto escalation: {formatTime(handlerInfo.escalationThreshold)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Arrow to next level */}
                    {index < Object.values(HandlerLevel).length - 1 && (
                      <div className="flex justify-center mt-2 mb-2">
                        <ChevronRightIcon className="h-5 w-5 text-gray-400 transform rotate-90" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Category Mapping Tab */}
        {activeTab === 'categories' && showCategoryMapping && (
          <div className="space-y-4">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Mapping Kategori ke Handler</h3>
              <p className="text-sm text-gray-600">
                Setiap kategori lokasi memiliki handler default berdasarkan kompleksitas penanganan
              </p>
            </div>

            <div className="grid gap-3">
              {categories.map((category) => {
                const handlerLevel = getHandlerForCategory(category.value);
                const handlerInfo = HANDLER_LEVELS[handlerLevel];
                const IconComponent = HandlerLevelIcons[handlerLevel];
                const isSelected = selectedCategory === category.value;
                
                return (
                  <div 
                    key={category.value} 
                    className={`border rounded-lg p-3 transition-all ${
                      isSelected ? 'ring-2 ring-blue-500 border-blue-200 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="font-medium text-gray-900">{category.label}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <IconComponent className="h-4 w-4 text-gray-500" />
                        <span className={`text-xs px-2 py-1 rounded-full border font-medium ${
                          HandlerLevelColors[handlerLevel]
                        }`}>
                          {handlerInfo.name}
                        </span>
                      </div>
                    </div>
                    
                    {isSelected && (
                      <div className="mt-2 p-2 bg-blue-100 rounded text-xs text-blue-800">
                        <strong>Handler:</strong> {handlerInfo.description}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Escalation Rules Tab */}
        {activeTab === 'rules' && showEscalationRules && (
          <div className="space-y-4">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aturan Eskalasi Otomatis</h3>
              <p className="text-sm text-gray-600">
                Sistem akan otomatis menaikkan level handler berdasarkan prioritas dan waktu tunggu
              </p>
            </div>

            <div className="grid gap-4">
              {Object.entries(ESCALATION_RULES).map(([priority, rule]) => {
                const priorityLabel = {
                  low: 'Rendah',
                  medium: 'Sedang', 
                  high: 'Tinggi',
                  emergency: 'Darurat'
                }[priority];

                const maxHandlerInfo = HANDLER_LEVELS[rule.maxLevel];
                const MaxHandlerIcon = HandlerLevelIcons[rule.maxLevel];

                return (
                  <div key={priority} className={`border rounded-lg p-4 ${getPriorityColor(priority)}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        {priority === 'emergency' && <ExclamationTriangleIcon className="h-5 w-5" />}
                        <h4 className="font-semibold">Prioritas {priorityLabel}</h4>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-sm">
                        <ClockIcon className="h-4 w-4" />
                        <span>Auto escalation: {formatTime(rule.autoEscalateAfter)}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span>Maksimal level:</span>
                      <div className="flex items-center space-x-2">
                        <MaxHandlerIcon className="h-4 w-4" />
                        <span className="font-medium">{maxHandlerInfo.name}</span>
                      </div>
                    </div>
                    
                    <div className="mt-2 text-xs opacity-75">
                      Laporan dengan prioritas ini akan otomatis naik level setiap {formatTime(rule.autoEscalateAfter)} 
                      sampai mencapai {maxHandlerInfo.name}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Catatan Penting:</h4>
              <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                <li>Eskalasi otomatis dapat dimatikan per laporan oleh admin</li>
                <li>Admin dapat melakukan eskalasi manual kapan saja</li>
                <li>Laporan yang sudah resolved/closed tidak akan dieskalasi</li>
                <li>Waktu eskalasi dihitung dari waktu pembuatan atau eskalasi terakhir</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
