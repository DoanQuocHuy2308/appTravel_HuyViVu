"use client";

import { Chart } from 'primereact/chart';
import { Button } from 'primereact/button';

interface ToursDistributionChartProps {
  toursByType: { [key: string]: number };
  loading?: boolean;
}

export const ToursDistributionChart = ({ toursByType, loading = false }: ToursDistributionChartProps) => {
  const chartData = {
    labels: Object.keys(toursByType),
    datasets: [
      {
        data: Object.values(toursByType),
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(14, 165, 233, 0.8)',
          'rgba(34, 211, 238, 0.8)'
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(168, 85, 247, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(236, 72, 153, 1)',
          'rgba(14, 165, 233, 1)',
          'rgba(34, 211, 238, 1)'
        ],
        borderWidth: 2,
        hoverOffset: 10
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} tours (${percentage}%)`;
          }
        }
      }
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1000,
      easing: 'easeInOutQuart' as const
    },
    cutout: '50%'
  };

  const totalTours = Object.values(toursByType).reduce((sum, count) => sum + count, 0);

  if (loading) {
    return (
      <div className="chart-container p-6 animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 bg-gray-200 rounded w-48"></div>
          <div className="h-8 bg-gray-200 rounded w-24"></div>
        </div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="chart-container p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Phân bố Tours theo loại</h3>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">{totalTours}</div>
          <div className="text-sm text-gray-500">Tổng tours</div>
        </div>
      </div>
      <div className="h-64">
        <Chart type="doughnut" data={chartData} options={chartOptions} />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {Object.entries(toursByType).map(([type, count], index) => {
          const percentage = ((count / totalTours) * 100).toFixed(1);
          const colors = [
            'bg-green-500', 'bg-blue-500', 'bg-purple-500', 'bg-yellow-500',
            'bg-red-500', 'bg-pink-500', 'bg-sky-500', 'bg-cyan-500'
          ];
          return (
            <div key={type} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50">
              <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]}`}></div>
              <span className="text-sm text-gray-600 flex-1 truncate">{type}</span>
              <span className="text-sm font-medium text-gray-900">{count}</span>
              <span className="text-xs text-gray-500">({percentage}%)</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
