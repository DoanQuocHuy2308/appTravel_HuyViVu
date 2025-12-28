import React from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BookingDetail } from '../../../../types';
import { router } from 'expo-router';

interface BookingDetailModalProps {
  visible: boolean;
  booking: BookingDetail | null;
  onClose: () => void;
  onCancel: (bookingId: number) => void;
  onDelete: (bookingId: number) => void;
  formatCurrency: (amount: number) => string;
  formatDate: (dateString: string) => string;
  getStatusColor: (status: string) => string;
  getStatusLabel: (status: string) => string;
  isCancelling?: boolean;
}

const BookingDetailModal: React.FC<BookingDetailModalProps> = ({
  visible,
  booking,
  onClose,
  onCancel,
  onDelete,
  formatCurrency,
  formatDate,
  getStatusColor,
  getStatusLabel,
  isCancelling = false,
}) => {
  const handleBookingAction = (bookingId: number, action: 'cancel') => {
    Alert.alert(
      'Xác nhận hủy đơn đặt tour',
      'Bạn có chắc chắn muốn hủy đơn đặt tour này?',
      [
        { text: 'Không', style: 'cancel' },
        {
          text: 'Có, hủy đơn đặt',
          style: 'destructive',
          onPress: () => {
            onCancel(bookingId);
          },
        },
      ]
    );
  };

  const handleDelete = (bookingId: number) => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc chắn muốn xóa đơn đặt tour này?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: () => onDelete(bookingId),
        },
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-white">
        {/* Header */}
        <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
          <Text className="text-xl font-bold text-gray-800">Chi tiết đơn đặt tour</Text>
          <TouchableOpacity onPress={onClose} className="p-2">
            <Ionicons name="close" size={24} color="#374151" />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 p-4">
          {booking && (
            <View className="space-y-4">
              {/* Tour info */}
              <View className="bg-gray-50 rounded-lg p-4">
                <Text className="text-lg font-bold text-gray-800 mb-2">
                  {booking.tour_name}
                </Text>
                <Text className="text-sm text-gray-600 mb-3">
                  Mã đặt tour: #{booking.booking_id}
                </Text>
                {booking.tour_description && (
                  <Text className="text-sm text-gray-700">
                    {booking.tour_description}
                  </Text>
                )}
              </View>

              {/* Customer info */}
              <View className="bg-blue-50 rounded-lg p-4">
                <Text className="text-lg font-bold text-blue-800 mb-3">Thông tin khách hàng</Text>
                <View className="space-y-2">
                  <View className="flex-row items-center">
                    <Ionicons name="person" size={20} color="#1E40AF" />
                    <Text className="text-gray-700 ml-3">{booking.user_name}</Text>
                  </View>
                  <View className="flex-row items-center">
                    <Ionicons name="mail" size={20} color="#1E40AF" />
                    <Text className="text-gray-700 ml-3">{booking.user_email}</Text>
                  </View>
                  <View className="flex-row items-center">
                    <Ionicons name="call" size={20} color="#1E40AF" />
                    <Text className="text-gray-700 ml-3">{booking.user_phone || 'Chưa có số điện thoại'}</Text>
                  </View>
                </View>
              </View>

              {/* Booking details */}
              <View className="bg-green-50 rounded-lg p-4">
                <Text className="text-lg font-bold text-green-800 mb-3">Chi tiết đặt tour</Text>
                <View className="space-y-2">
                  <View className="flex-row justify-between">
                    <Text className="text-gray-600">Số người lớn:</Text>
                    <Text className="text-gray-800 font-medium">{booking.adults}</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-gray-600">Số trẻ em:</Text>
                    <Text className="text-gray-800 font-medium">{booking.children}</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-gray-600">Số em bé:</Text>
                    <Text className="text-gray-800 font-medium">{booking.infants}</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-gray-600">Ngày đặt:</Text>
                    <Text className="text-gray-800 font-medium">
                      {booking.booking_date ? formatDate(booking.booking_date) : 'N/A'}
                    </Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-gray-600">Ngày khởi hành:</Text>
                    <Text className="text-gray-800 font-medium">
                      {booking.start_date ? formatDate(booking.start_date) : 'N/A'}
                    </Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-gray-600">Ngày kết thúc:</Text>
                    <Text className="text-gray-800 font-medium">
                      {booking.end_date ? formatDate(booking.end_date) : 'N/A'}
                    </Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-gray-600">Tổng tiền:</Text>
                    <Text className="text-lg font-bold text-green-600">
                      {booking.total_price ? formatCurrency(booking.total_price) : 'N/A'}
                    </Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-gray-600">Trạng thái:</Text>
                    <View className={`px-3 py-1 rounded-full ${getStatusColor(booking.status)}`}>
                      <Text className="text-white text-sm font-medium">
                        {getStatusLabel(booking.status)}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Notes */}
              {booking.notes && (
                <View className="bg-yellow-50 rounded-lg p-4">
                  <Text className="text-lg font-bold text-yellow-800 mb-2">Ghi chú</Text>
                  <Text className="text-gray-700">{booking.notes}</Text>
                </View>
              )}

              {/* Action buttons */}
              <View className="flex-row justify-between pt-4">
                {booking.status === 'pending' && (
                  <TouchableOpacity
                    className={`px-6 py-3 rounded-lg flex-1 mr-2 ${isCancelling ? 'bg-gray-400' : 'bg-red-500'}`}
                    onPress={() => {
                      if (!isCancelling) {
                        handleBookingAction(booking.booking_id, 'cancel');
                      }
                    }}
                    disabled={isCancelling}
                  >
                    <Text className="text-white text-center font-medium">
                      {isCancelling ? 'Đang hủy...' : 'Hủy đặt tour'}
                    </Text>
                  </TouchableOpacity>
                )}
                {booking.status === 'confirmed' && (
                  <TouchableOpacity
                    className="bg-green-500 px-6 py-3 rounded-lg flex-1 mr-2"
                    onPress={() => {
                      // TODO: Navigate to review screen
                      Alert.alert('Thông báo', 'Tính năng đánh giá sẽ được thêm trong phiên bản tiếp theo');
                    }}
                  >
                    <Text className="text-white text-center font-medium">Đánh giá tour</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  className="bg-blue-500 px-6 py-3 rounded-lg flex-1"
                  onPress={() => router.push({
                    pathname: '/screens/(tours)/[id]',
                    params: { id: booking.tour_id },
                  })}
                >
                  <Text className="text-white text-center font-medium">Xem tour</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};

export default BookingDetailModal;
