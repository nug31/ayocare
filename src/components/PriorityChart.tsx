import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Report } from '../context/ReportContext';

interface PriorityChartProps {
  reports: Report[];
}

const COLORS = {
  low: '#10B981', // green-500
  medium: '#F59E0B', // yellow-500
  high: '#F97316', // orange-500
  emergency: '#EF4444', // red-500
};

const priorityLabels = {
  low: 'Rendah',
  medium: 'Sedang',
  high: 'Tinggi',
  emergency: 'Darurat',
};

export default function PriorityChart({ reports }: PriorityChartProps) {
  const priorityData = Object.entries(
    reports.reduce((acc, report) => {
      acc[report.priority] = (acc[report.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([priority, count]) => ({
    name: priorityLabels[priority as keyof typeof priorityLabels] || priority,
    value: count,
    color: COLORS[priority as keyof typeof COLORS] || '#6B7280',
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border">
          <p className="font-medium">{`${payload[0].name}: ${payload[0].value} laporan`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Distribusi Prioritas</h3>
      
      {priorityData.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-gray-500">
          Belum ada data laporan
        </div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={priorityData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {priorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="mt-4 grid grid-cols-2 gap-4">
        {priorityData.map((item) => (
          <div key={item.name} className="flex items-center">
            <div
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm text-gray-600">{item.name}: {item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}