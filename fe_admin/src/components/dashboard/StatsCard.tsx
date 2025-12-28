"use client";

import { Card } from 'primereact/card';
import { Badge } from 'primereact/badge';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: string;
  bgColor: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  loading?: boolean;
}

export const StatsCard = ({ 
  title, 
  value, 
  icon, 
  color, 
  bgColor, 
  change, 
  changeType = 'neutral',
  loading = false 
}: StatsCardProps) => {
  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      if (val >= 1000000) {
        return `${(val / 1000000).toFixed(1)}M`;
      } else if (val >= 1000) {
        return `${(val / 1000).toFixed(1)}K`;
      }
      return val.toLocaleString();
    }
    return val;
  };

  if (loading) {
    return (
      <div className="stat-card p-6 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-8 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
          </div>
          <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <Card className="stat-card h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-center justify-between h-full">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mb-2">{formatValue(value)}</p>
          {change && (
            <div className="flex items-center">
              <Badge 
                value={change}
                severity={changeType === 'positive' ? 'success' : changeType === 'negative' ? 'danger' : 'info'}
                className="text-xs"
              />
              <span className="text-xs text-gray-500 ml-2">so với tháng trước</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${bgColor} shadow-sm`}>
          <i className={`${icon} ${color} text-xl`}></i>
        </div>
      </div>
    </Card>
  );
};
