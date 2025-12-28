import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
    RefreshControl,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useBookings } from '../../../hooks/useBookings';
import { BookingDetail } from '../../../types';
import { BookingCard, BookingDetailModal } from './components';
import useUser from '../../../hooks/useUser';
import Back from '@/components/back';
// Date formatting utility functions

const { width, height } = Dimensions.get('window');

const TourManagerScreen = () => {
    const { user } = useUser();
    const {
        bookings,
        loading,
        error,
        fetchBookingsByUserId,
        filterBookingsByStatus,
        searchBookings,
        sortBookings,
        updateBooking,
        deleteBooking,
        clearError,
    } = useBookings();

    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [searchKeyword, setSearchKeyword] = useState<string>('');
    const [sortField, setSortField] = useState<keyof BookingDetail>('booking_date');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [selectedBooking, setSelectedBooking] = useState<BookingDetail | null>(null);
    const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [cancellingBookingId, setCancellingBookingId] = useState<number | null>(null);

    const statusOptions = [
        { value: 'all', label: 'Tất cả', color: 'bg-gray-500' },
        { value: 'pending', label: 'Chờ xác nhận', color: 'bg-yellow-500' },
        { value: 'confirmed', label: 'Đã xác nhận', color: 'bg-green-500' },
        { value: 'canceled', label: 'Đã hủy', color: 'bg-red-500' },
    ];

    useEffect(() => {
        if (user?.id) {
            fetchBookingsByUserId(user.id);
        }
    }, [user?.id]);

    const handleRefresh = async () => {
        setRefreshing(true);
        if (user?.id) {
            await fetchBookingsByUserId(user.id);
        }
        setRefreshing(false);
    };

    const handleStatusFilter = (status: string) => {
        setSelectedStatus(status);
    };

    const handleSearch = (keyword: string) => {
        setSearchKeyword(keyword);
    };

    const handleSort = (field: keyof BookingDetail) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('desc');
        }
        sortBookings(field, sortOrder);
    };

    const handleBookingAction = async (bookingId: number, action: 'cancel') => {
        // Kiểm tra xem có thể hủy đơn đặt không
        const currentBooking = bookings.find(b => b.booking_id === bookingId);
        if (currentBooking?.booking_date) {
            const bookingDate = new Date(currentBooking.booking_date);
            const now = new Date();
            const hoursDiff = (now.getTime() - bookingDate.getTime()) / (1000 * 60 * 60);
            
            if (hoursDiff > 24) {
                Alert.alert(
                    '❌ Không thể hủy',
                    'Bạn chỉ có thể hủy đơn đặt tour trong vòng 24 giờ kể từ khi đặt tour.\n\nThời gian đặt tour: ' + formatDate(currentBooking.booking_date),
                    [{ text: 'Đã hiểu', style: 'default' }]
                );
                return;
            }
        }

        Alert.alert(
            'Xác nhận hủy đơn đặt tour',
            'Bạn có chắc chắn muốn hủy đơn đặt tour này?\n\nLưu ý: Hành động này không thể hoàn tác.',
            [
                { text: 'Không', style: 'cancel' },
                {
                    text: 'Có, hủy đơn đặt',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            setCancellingBookingId(bookingId);
                            
                            // Tìm booking hiện tại để lấy thông tin
                            const currentBooking = bookings.find(b => b.booking_id === bookingId);
                            if (!currentBooking) {
                                Alert.alert('Lỗi', 'Không tìm thấy thông tin đơn đặt tour');
                                return;
                            }

                            // Gọi API update với đầy đủ thông tin
                            await updateBooking({
                                id: bookingId,
                                adults: currentBooking.adults,
                                children: currentBooking.children,
                                infants: currentBooking.infants,
                                notes: currentBooking.notes || '',
                                status: 'canceled'
                            });

                            // Hiển thị thông báo thành công
                            Alert.alert(
                                '✅ Thành công',
                                'Đơn đặt tour đã được hủy thành công!\n\nTrạng thái đã được cập nhật thành "Đã hủy".',
                                [{ text: 'OK', style: 'default' }]
                            );

                            // Refresh data
                            if (user?.id) {
                                await fetchBookingsByUserId(user.id);
                            }

                            setShowDetailModal(false);
                            setSelectedBooking(null);
                        } catch (error) {
                            console.error('Cancel booking error:', error);
                            Alert.alert('Lỗi', 'Có lỗi xảy ra khi hủy đơn đặt tour');
                        } finally {
                            setCancellingBookingId(null);
                        }
                    },
                },
            ]
        );
    };

    const handleDeleteBooking = async (bookingId: number) => {
        Alert.alert(
            'Xác nhận xóa',
            'Bạn có chắc chắn muốn xóa đơn đặt tour này?',
            [
                { text: 'Hủy', style: 'cancel' },
                {
                    text: 'Xóa',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteBooking(bookingId);
                            Alert.alert('Thành công', 'Đơn đặt tour đã được xóa thành công!');
                        } catch (error) {
                            Alert.alert('Lỗi', 'Có lỗi xảy ra khi xóa đơn đặt tour');
                        }
                    },
                },
            ]
        );
    };

    const getFilteredBookings = () => {
        let filtered = bookings;

        // Filter by status
        if (selectedStatus !== 'all') {
            filtered = filterBookingsByStatus(selectedStatus);
        }

        // Search filter
        if (searchKeyword.trim()) {
            filtered = searchBookings(searchKeyword.trim());
        }

        return filtered;
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            return `${day}/${month}/${year} ${hours}:${minutes}`;
        } catch {
            return dateString;
        }
    };

    const getStatusColor = (status: string) => {
        const statusConfig = statusOptions.find(opt => opt.value === status);
        return statusConfig?.color || 'bg-gray-500';
    };

    const getStatusLabel = (status: string) => {
        const statusConfig = statusOptions.find(opt => opt.value === status);
        return statusConfig?.label || status;
    };

     const renderBookingCard = (booking: BookingDetail) => (
         <BookingCard
             key={booking.booking_id}
             booking={booking}
             onPress={() => {
                 setSelectedBooking(booking);
                 setShowDetailModal(true);
             }}
             onCancel={() => handleBookingAction(booking.booking_id, 'cancel')}
             onViewDetail={() => {
                 setSelectedBooking(booking);
                 setShowDetailModal(true);
             }}
             formatCurrency={formatCurrency}
             formatDate={formatDate}
             getStatusColor={getStatusColor}
             getStatusLabel={getStatusLabel}
             isCancelling={cancellingBookingId === booking.booking_id}
         />
     );

    const renderDetailModal = () => (
        <BookingDetailModal
            visible={showDetailModal}
            booking={selectedBooking}
            onClose={() => {
                setShowDetailModal(false);
                setSelectedBooking(null);
            }}
            onCancel={(bookingId) => handleBookingAction(bookingId, 'cancel')}
            onDelete={handleDeleteBooking}
            formatCurrency={formatCurrency}
            formatDate={formatDate}
            getStatusColor={getStatusColor}
            getStatusLabel={getStatusLabel}
            isCancelling={selectedBooking ? cancellingBookingId === selectedBooking.booking_id : false}
        />
    );

    const filteredBookings = getFilteredBookings();

    return (
        <View className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="bg-white shadow-sm border-b border-gray-200 pt-12 pb-4">
                <View className="absolute top-8 z-10">
                    <Back />
                </View>
                <View className="px-4">
                    <Text className="text-2xl font-bold text-center text-gray-800 mb-2">Đơn đặt tour của tôi</Text>
                    <Text className="text-sm text-center text-gray-600">
                        Xin chào {user?.name || 'User'}! Bạn có {filteredBookings.length} đơn đặt tour
                    </Text>
                </View>
            </View>

            {/* Search and Filter */}
            <View className="bg-white p-4 border-b border-gray-200">
                {/* Search */}
                <View className="mb-4">
                    <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2">
                        <Ionicons name="search" size={20} color="#6B7280" />
                        <TextInput
                            className="flex-1 ml-2 text-gray-700"
                            placeholder="Tìm kiếm theo tên tour, khách hàng, email..."
                            value={searchKeyword}
                            onChangeText={handleSearch}
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>
                </View>

                {/* Status Filter */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-2">
                    <View className="flex-row space-x-2">
                        {statusOptions.map((option) => (
                            <TouchableOpacity
                                key={option.value}
                                className={`px-4 py-2 rounded-full ${selectedStatus === option.value
                                        ? `${option.color}`
                                        : 'bg-gray-200'
                                    }`}
                                onPress={() => handleStatusFilter(option.value)}
                            >
                                <Text
                                    className={`text-sm font-medium ${selectedStatus === option.value ? 'text-white' : 'text-gray-700'
                                        }`}
                                >
                                    {option.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>

                {/* Sort */}
                <View className="flex-row items-center justify-between">
                    <Text className="text-sm text-gray-600">Sắp xếp theo:</Text>
                    <TouchableOpacity
                        className="flex-row items-center"
                        onPress={() => handleSort('booking_date')}
                    >
                        <Text className="text-sm text-blue-600 mr-1">Ngày đặt</Text>
                        <Ionicons
                            name={sortOrder === 'asc' ? 'arrow-up' : 'arrow-down'}
                            size={16}
                            color="#2563EB"
                        />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Content */}
            <ScrollView
                className="flex-1"
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                }
                showsVerticalScrollIndicator={false}
            >
                {loading && !refreshing ? (
                    <View className="flex-1 justify-center items-center py-20">
                        <Text className="text-gray-600">Đang tải dữ liệu...</Text>
                    </View>
                ) : error ? (
                    <View className="flex-1 justify-center items-center py-20 px-4">
                        <Ionicons name="alert-circle" size={48} color="#EF4444" />
                        <Text className="text-red-600 text-center mt-4 mb-4">{error}</Text>
                        <TouchableOpacity
                            className="bg-blue-500 px-6 py-3 rounded-lg"
                            onPress={clearError}
                        >
                            <Text className="text-white font-medium">Thử lại</Text>
                        </TouchableOpacity>
                    </View>
                ) : filteredBookings.length === 0 ? (
                    <View className="flex-1 justify-center items-center py-20 px-4">
                        <Ionicons name="document-outline" size={48} color="#9CA3AF" />
                        <Text className="text-gray-600 text-center mt-4">
                            {searchKeyword || selectedStatus !== 'all'
                                ? 'Không tìm thấy đơn đặt tour phù hợp'
                                : 'Chưa có đơn đặt tour nào'}
                        </Text>
                    </View>
                ) : (
                    <View className="pb-20">
                        {filteredBookings.map(renderBookingCard)}
                    </View>
                )}
            </ScrollView>
            {renderDetailModal()}
        </View>
    );
};

export default TourManagerScreen;
