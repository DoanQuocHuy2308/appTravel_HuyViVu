"use client";

import { Chart } from 'primereact/chart';
import { Button } from 'primereact/button';
import { useState } from 'react';

interface RevenueChartProps {
  monthlyRevenue: number[];
  monthlyBookings: number[];
  loading?: boolean;
}

export const RevenueChart = ({ monthlyRevenue, monthlyBookings, loading = false }: RevenueChartProps) => {
  const [chartType, setChartType] = useState<'revenue' | 'bookings'>('revenue');

  const months = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'];
  
  const revenueData = {
    labels: months,
    datasets: [
      {
        label: 'Doanh thu (VNĐ)',
        data: monthlyRevenue,
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgba(34, 197, 94, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8
      }
    ]
  };

  const bookingsData = {
    labels: months,
    datasets: [
      {
        label: 'Số lượng booking',
        data: monthlyBookings,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: function(context: any) {
            if (chartType === 'revenue') {
              return `Doanh thu: ${context.parsed.y.toLocaleString('vi-VN')} VNĐ`;
            }
            return `Bookings: ${context.parsed.y}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          color: '#6b7280',
          callback: function(value: any) {
            if (chartType === 'revenue') {
              return `${value.toLocaleString('vi-VN')} VNĐ`;
            }
            return value;
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#6b7280'
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index' as const
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart' as const
    }
  };

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
        <h3 className="text-lg font-semibold text-gray-800">
          {chartType === 'revenue' ? 'Biểu đồ Doanh thu' : 'Biểu đồ Bookings'}
        </h3>
        <div className="flex gap-2">
          <Button
            label="Doanh thu"
            size="small"
            outlined={chartType !== 'revenue'}
            severity={chartType === 'revenue' ? 'success' : 'secondary'}
            onClick={() => setChartType('revenue')}
            className="text-xs"
          />
          <Button
            label="Bookings"
            size="small"
            outlined={chartType !== 'bookings'}
            severity={chartType === 'bookings' ? 'info' : 'secondary'}
            onClick={() => setChartType('bookings')}
            className="text-xs"
          />
        </div>
      </div>
      <div className="h-64">
        <Chart 
          type="line" 
          data={chartType === 'revenue' ? revenueData : bookingsData} 
          options={chartOptions} 
        />
      </div>
    </div>
  );
};
