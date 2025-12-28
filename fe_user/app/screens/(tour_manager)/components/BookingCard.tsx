import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BookingDetail } from '../../../../types';

interface BookingCardProps {
  booking: BookingDetail;
  onPress: () => void;
  onCancel: () => void;
  onViewDetail: () => void;
  formatCurrency: (amount: number) => string;
  formatDate: (dateString: string) => string;
  getStatusColor: (status: string) => string;
  getStatusLabel: (status: string) => string;
  isCancelling?: boolean;
}

const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  onPress,
  onCancel,
  onViewDetail,
  formatCurrency,
  formatDate,
  getStatusColor,
  getStatusLabel,
  isCancelling = false,
}) => {
  return (
    <TouchableOpacity
      className="bg-white rounded-xl shadow-lg mb-4 mx-4 p-4 border border-gray-100"
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Header with status */}
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-800 mb-1" numberOfLines={2}>
            {booking.tour_name}
          </Text>
          <Text className="text-sm text-gray-600">
            Mã đặt tour: #{booking.booking_id}
          </Text>
        </View>
        <View className={`px-3 py-1 rounded-full ${getStatusColor(booking.status)}`}>
          <Text className="text-white text-xs font-medium">
            {getStatusLabel(booking.status)}
          </Text>
        </View>
      </View>

      {/* Customer info */}
      <View className="mb-3">
        <View className="flex-row items-center mb-1">
          <Ionicons name="person" size={16} color="#6B7280" />
          <Text className="text-sm text-gray-700 ml-2 font-medium">
            {booking.user_name}
          </Text>
        </View>
        <View className="flex-row items-center">
          <Ionicons name="mail" size={16} color="#6B7280" />
          <Text className="text-sm text-gray-600 ml-2" numberOfLines={1}>
            {booking.user_email}
          </Text>
        </View>
        <View className="flex-row items-center">
          <Ionicons name="call" size={16} color="#6B7280" />
          <Text className="text-sm text-gray-600 ml-2" numberOfLines={1}>
            {booking.user_phone || 'Chưa có số điện thoại'}
          </Text>
        </View>
      </View>

      {/* Tour details */}
      <View className="mb-3">
        <View className="flex-row items-center mb-1">
          <Ionicons name="people" size={16} color="#6B7280" />
          <Text className="text-sm text-gray-700 ml-2">
            {booking.adults} người lớn
            {booking.children > 0 && `, ${booking.children} trẻ em`}
            {booking.infants > 0 && `, ${booking.infants} em bé`}
          </Text>
        </View>
        {booking.start_date && (
          <View className="flex-row items-center">
            <Ionicons name="calendar" size={16} color="#6B7280" />
            <Text className="text-sm text-gray-600 ml-2">
              {formatDate(booking.start_date)}
              {booking.end_date && ` - ${formatDate(booking.end_date)}`}
            </Text>
          </View>
        )}
      </View>

      {/* Price and booking date */}
      <View className="flex-row justify-between items-center pt-3 border-t border-gray-100">
        <View>
          <Text className="text-sm text-gray-600">Ngày đặt:</Text>
          <Text className="text-sm font-medium text-gray-800">
            {booking.booking_date ? formatDate(booking.booking_date) : 'N/A'}
          </Text>
        </View>
        <View className="items-end">
          <Text className="text-sm text-gray-600">Tổng tiền:</Text>
          <Text className="text-lg font-bold text-blue-600">
            {booking.total_price ? formatCurrency(booking.total_price) : 'N/A'}
          </Text>
        </View>
      </View>

      {/* Action buttons */}
      <View className="flex-row justify-end mt-3 space-x-2">
        {booking.status === 'pending' && (
          (() => {
            // Kiểm tra xem có thể hủy không (trong vòng 24 giờ)
            const canCancel = (() => {
              if (booking.booking_date) {
                const bookingDate = new Date(booking.booking_date);
                const now = new Date();
                const hoursDiff = (now.getTime() - bookingDate.getTime()) / (1000 * 60 * 60);
                return hoursDiff <= 24;
              }
              return true; // Nếu không có booking_date, cho phép hủy
            })();

            return canCancel ? (
              <TouchableOpacity
                className={`px-4 py-2 rounded-lg ${isCancelling ? 'bg-gray-400' : 'bg-red-500'}`}
                onPress={(e) => {
                  e.stopPropagation();
                  if (!isCancelling) {
                    onCancel();
                  }
                }}
                disabled={isCancelling}
              >
                <Text className="text-white text-sm font-medium">
                  {isCancelling ? 'Đang hủy...' : 'Hủy đơn đặt'}
                </Text>
              </TouchableOpacity>
            ) : (
              <View className="px-4 py-2 rounded-lg bg-gray-300">
                <Text className="text-gray-600 text-sm font-medium">
                  Không thể hủy
                </Text>
              </View>
            );
          })()
        )}
        <TouchableOpacity
          className="bg-blue-500 px-4 py-2 rounded-lg"
          onPress={(e) => {
            e.stopPropagation();
            onViewDetail();
          }}
        >
          <Text className="text-white text-sm font-medium">Xem chi tiết</Text>
        </TouchableOpacity>
        {booking.status === 'confirmed' && (
          <TouchableOpacity
            className="bg-green-500 px-4 py-2 rounded-lg"
            onPress={(e) => {
              e.stopPropagation();
              // TODO: Navigate to review screen
            }}
          >
            <Text className="text-white text-sm font-medium">Đánh giá</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default BookingCard;
