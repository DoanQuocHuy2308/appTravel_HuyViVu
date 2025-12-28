"use client";

import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { Avatar } from 'primereact/avatar';
import { Divider } from 'primereact/divider';
import { BookingDetail } from '@/lib/types';

interface BookingDetailModalProps {
  visible: boolean;
  onHide: () => void;
  booking: BookingDetail | null;
  onEdit?: (booking: BookingDetail) => void;
  onSendEmail?: (booking: BookingDetail) => void;
  onDelete?: (booking: BookingDetail) => void;
}

export const BookingDetailModal = ({ 
  visible, 
  onHide, 
  booking, 
  onEdit, 
  onSendEmail, 
  onDelete 
}: BookingDetailModalProps) => {
  if (!booking) return null;

  const formatPrice = (price: number | undefined) => {
    if (!price || isNaN(price)) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Chưa cập nhật';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header="Chi tiết đơn hàng"
      modal
      className="w-11/12 max-w-6xl"
      style={{ width: '90vw', maxWidth: '1200px' }}
    >
      <div className="p-6">
        {/* Header với thông tin cơ bản */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex items-center gap-4">
              <Avatar 
                label={getInitials(booking.user_name || 'U')}
                className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold"
                size="large"
                shape="circle"
              />
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  Đơn hàng #{booking.booking_id}
                </h3>
                <p className="text-gray-600">
                  Khách hàng: <span className="font-semibold">{booking.user_name}</span>
                </p>
                <p className="text-gray-600">
                  Tour: <span className="font-semibold">{booking.tour_name}</span>
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge 
                value={getStatusText(booking.status)}
                severity={getStatusColor(booking.status)}
                className="text-sm px-3 py-1"
              />
              <div className="text-right">
                <p className="text-sm text-gray-500">Tổng giá trị</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatPrice(booking.total_price)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Thông tin khách hàng */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <i className="pi pi-user text-blue-600 text-xl"></i>
              <h4 className="text-lg font-semibold text-gray-800">Thông tin khách hàng</h4>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Họ tên</label>
                <p className="text-gray-800">{booking.user_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-gray-800">{booking.user_email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">ID người dùng</label>
                <p className="text-gray-800">#{booking.user_id}</p>
              </div>
            </div>
          </div>

          {/* Thông tin tour */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <i className="pi pi-map text-green-600 text-xl"></i>
              <h4 className="text-lg font-semibold text-gray-800">Thông tin tour</h4>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Tên tour</label>
                <p className="text-gray-800">{booking.tour_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Mô tả</label>
                <p className="text-gray-800">{booking.tour_description || 'Không có mô tả'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">ID tour</label>
                <p className="text-gray-800">#{booking.tour_id}</p>
              </div>
            </div>
          </div>

          {/* Thông tin đặt tour */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <i className="pi pi-calendar text-purple-600 text-xl"></i>
              <h4 className="text-lg font-semibold text-gray-800">Thông tin đặt tour</h4>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Ngày đặt</label>
                <p className="text-gray-800">{formatDate(booking.booking_date)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Ngày bắt đầu</label>
                <p className="text-gray-800">{formatDate(booking.start_date)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Ngày kết thúc</label>
                <p className="text-gray-800">{formatDate(booking.end_date)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Trạng thái</label>
                <div className="mt-1">
                  <Badge 
                    value={getStatusText(booking.status)}
                    severity={getStatusColor(booking.status)}
                    className="text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Thông tin khách */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <i className="pi pi-users text-orange-600 text-xl"></i>
              <h4 className="text-lg font-semibold text-gray-800">Thông tin khách</h4>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{booking.adults}</p>
                  <p className="text-sm text-gray-500">Người lớn</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{booking.children}</p>
                  <p className="text-sm text-gray-500">Trẻ em</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">{booking.infants}</p>
                  <p className="text-sm text-gray-500">Em bé</p>
                </div>
              </div>
              <Divider />
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-800">
                  {booking.adults + booking.children + booking.infants}
                </p>
                <p className="text-sm text-gray-500">Tổng số khách</p>
              </div>
            </div>
          </div>
        </div>

        {/* Thông tin giá */}
        {booking.ticket_prices && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 mt-6">
            <div className="flex items-center gap-3 mb-4">
              <i className="pi pi-dollar text-green-600 text-xl"></i>
              <h4 className="text-lg font-semibold text-gray-800">Chi tiết giá</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-500">Giá người lớn</p>
                <p className="text-lg font-semibold text-blue-600">
                  {formatPrice(booking.ticket_prices.adult_price)}
                </p>
                <p className="text-sm text-gray-500">× {booking.adults} người</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-500">Giá trẻ em</p>
                <p className="text-lg font-semibold text-green-600">
                  {formatPrice(booking.ticket_prices.child_price)}
                </p>
                <p className="text-sm text-gray-500">× {booking.children} người</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-500">Giá em bé</p>
                <p className="text-lg font-semibold text-purple-600">
                  {formatPrice(booking.ticket_prices.infant_price)}
                </p>
                <p className="text-sm text-gray-500">× {booking.infants} người</p>
              </div>
            </div>
          </div>
        )}

        {/* Ghi chú */}
        {booking.notes && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 mt-6">
            <div className="flex items-center gap-3 mb-4">
              <i className="pi pi-comment text-gray-600 text-xl"></i>
              <h4 className="text-lg font-semibold text-gray-800">Ghi chú</h4>
            </div>
            <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
              {booking.notes}
            </p>
          </div>
        )}

        {/* Điểm thưởng */}
        {booking.points_earned && booking.points_earned > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 mt-6">
            <div className="flex items-center gap-3 mb-4">
              <i className="pi pi-star text-yellow-600 text-xl"></i>
              <h4 className="text-lg font-semibold text-gray-800">Điểm thưởng</h4>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-yellow-600">
                +{booking.points_earned}
              </span>
              <span className="text-gray-600">điểm</span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
          <Button
            label="Đóng"
            icon="pi pi-times"
            outlined
            onClick={onHide}
            className="text-gray-600 border-gray-300 hover:bg-gray-50"
          />
          {onEdit && (
            <Button
              label="Chỉnh sửa"
              icon="pi pi-pencil"
              onClick={() => onEdit(booking)}
              className="text-amber-600 border-amber-300 hover:bg-amber-50"
            />
          )}
          {onSendEmail && (
            <Button
              label="Gửi email"
              icon="pi pi-envelope"
              onClick={() => onSendEmail(booking)}
              className="text-blue-600 border-blue-300 hover:bg-blue-50"
            />
          )}
          {onDelete && booking.status !== 'confirmed' && (
            <Button
              label="Xóa"
              icon="pi pi-trash"
              severity="danger"
              outlined
              onClick={() => onDelete(booking)}
            />
          )}
        </div>
      </div>
    </Dialog>
  );
};
