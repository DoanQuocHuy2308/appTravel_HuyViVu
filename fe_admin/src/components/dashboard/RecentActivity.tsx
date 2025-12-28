"use client";

import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { useRouter } from 'next/navigation';

interface RecentActivityProps {
  recentBookings: any[];
  loading?: boolean;
}

export const RecentActivity = ({ recentBookings, loading = false }: RecentActivityProps) => {
  const router = useRouter();
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'canceled':
        return 'danger';
      default:
        return 'info';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Đã xác nhận';
      case 'pending':
        return 'Chờ xác nhận';
      case 'canceled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Vừa xong';
    } else if (diffInHours < 24) {
      return `${diffInHours} giờ trước`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} ngày trước`;
    }
  };

  const formatPrice = (price: number) => {
    // Xử lý trường hợp price là NaN hoặc không hợp lệ
    if (isNaN(price) || price === null || price === undefined) {
      return '0 ₫';
    }
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-green-50 to-green-100 border-b border-green-200 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
            <div>
              <div className="h-6 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg animate-pulse">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-green-50 to-green-100 border-b border-green-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <i className="pi pi-clock text-green-600 text-xl"></i>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Hoạt động gần đây</h3>
              <p className="text-sm text-gray-600">Các booking mới nhất trong hệ thống</p>
            </div>
          </div>
          <Button
            icon="pi pi-refresh"
            rounded
            outlined
            size="small"
            className="text-green-600 border-green-300 hover:bg-green-50"
            tooltip="Làm mới"
          />
        </div>
      </div>
      <div className="p-6">
        {recentBookings.length === 0 ? (
          <div className="text-center py-8">
            <i className="pi pi-inbox text-4xl text-gray-300 mb-4"></i>
            <p className="text-gray-500">Chưa có hoạt động nào</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentBookings.map((booking, index) => (
              <div 
                key={booking.booking_id || index} 
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
              >
                <Avatar 
                  label={getInitials(booking.user_name || 'U')}
                  className="bg-gradient-to-br from-green-400 to-green-600 text-white font-semibold"
                  size="large"
                  shape="circle"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {booking.user_name || 'Người dùng không xác định'}
                    </p>
                    <Badge 
                      value={getStatusText(booking.status)}
                      severity={getStatusColor(booking.status)}
                      className="text-xs"
                    />
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    Đặt tour: {booking.tour_name || 'Không xác định'}
                  </p>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-xs text-gray-500">
                      {formatDate(booking.booking_date || new Date().toISOString())}
                    </span>
                    {booking.total_price && (
                      <span className="text-xs font-medium text-green-600">
                        {formatPrice(booking.total_price)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="text-xs text-gray-500">
                    {booking.adults} người lớn
                    {booking.children > 0 && `, ${booking.children} trẻ em`}
                    {booking.infants > 0 && `, ${booking.infants} em bé`}
                  </div>
                  <Button
                    icon="pi pi-eye"
                    size="small"
                    outlined
                    rounded
                    onClick={() => router.push(`/admin/bookings`)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    tooltip="Xem chi tiết"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {recentBookings.length > 0 && (
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
          <Button
            label="Xem tất cả hoạt động"
            icon="pi pi-arrow-right"
            size="small"
            outlined
            className="w-full text-gray-600 border-gray-300 hover:bg-gray-100"
          />
        </div>
      )}
    </div>
  );
};
