import { useState, useEffect } from 'react';
import { bookingAPI } from '../services/bookingAPI';
import { emailAPI } from '../services/emailAPI';
import { newBooking, Booking, BookingDetail, EmailData } from '../types';

export const useBookings = () => {
    const [bookings, setBookings] = useState<BookingDetail[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Lấy tất cả bookings
    const fetchAllBookings = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await bookingAPI.getAllBookings();
            setBookings(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch bookings');
        } finally {
            setLoading(false);
        }
    };

    // Lấy booking theo ID
    const fetchBookingById = async (id: number) => {
        try {
            setLoading(true);
            setError(null);
            const data = await bookingAPI.getBookingsById(id);
            return data;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch booking');
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Lấy bookings theo user ID
    const fetchBookingsByUserId = async (user_id: number) => {
        try {
            setLoading(true);
            setError(null);
            const data = await bookingAPI.getBookingsByUserId(user_id);
            setBookings(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch user bookings');
        } finally {
            setLoading(false);
        }
    };

    // Lấy bookings theo tour ID
    const fetchBookingsByTourId = async (tour_id: number) => {
        try {
            setLoading(true);
            setError(null);
            const data = await bookingAPI.getBookingsByTourId(tour_id);
            setBookings(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch tour bookings');
        } finally {
            setLoading(false);
        }
    };

    // Lấy bookings theo trạng thái
    const fetchBookingsByStatus = async (status: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await bookingAPI.getBookingsByStatus(status);
            setBookings(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch bookings by status');
        } finally {
            setLoading(false);
        }
    };

    // Lấy bookings theo khoảng thời gian
    const fetchBookingsByDateRange = async (start_date: string, end_date: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await bookingAPI.getBookingsByDateRange(start_date, end_date);
            setBookings(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch bookings by date range');
        } finally {
            setLoading(false);
        }
    };

    // Tạo booking mới
    const createBooking = async (bookingData: Omit<newBooking, 'id'>) => {
        try {
            setLoading(true);
            setError(null);
            const newBookingResult = await bookingAPI.booking(bookingData);
            await fetchAllBookings();
            return newBookingResult;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create booking');
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Cập nhật booking
    const updateBooking = async (bookingData: Partial<newBooking>) => {
        try {
            setLoading(true);
            setError(null);
            const updatedBooking = await bookingAPI.updateBooking(bookingData);
            await fetchAllBookings();
            return updatedBooking;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update booking');
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Xóa booking
    const deleteBooking = async (id: number) => {
        try {
            setLoading(true);
            setError(null);
            await bookingAPI.deleteBooking(id);
            setBookings(prev => prev.filter(booking => booking.booking_id !== id));
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete booking');
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Lọc bookings theo trạng thái
    const filterBookingsByStatus = (status: string) => {
        return bookings.filter(booking => booking.status === status);
    };

    // Tìm kiếm bookings theo từ khóa
    const searchBookings = (keyword: string) => {
        const lowerKeyword = keyword.toLowerCase();
        return bookings.filter(booking => 
            booking.notes?.toLowerCase().includes(lowerKeyword) ||
            booking.user_name?.toLowerCase().includes(lowerKeyword) ||
            booking.user_email?.toLowerCase().includes(lowerKeyword) ||
            booking.tour_name?.toLowerCase().includes(lowerKeyword) ||
            booking.user_id?.toString().includes(lowerKeyword) ||
            booking.tour_id?.toString().includes(lowerKeyword)
        );
    };

    // Sắp xếp bookings
    const sortBookings = (field: keyof BookingDetail, order: 'asc' | 'desc' = 'asc') => {
        const sorted = [...bookings].sort((a, b) => {
            const aValue = a[field];
            const bValue = b[field];
            
            // Handle undefined values
            if (aValue === undefined && bValue === undefined) return 0;
            if (aValue === undefined) return order === 'asc' ? 1 : -1;
            if (bValue === undefined) return order === 'asc' ? -1 : 1;
            
            if (aValue < bValue) return order === 'asc' ? -1 : 1;
            if (aValue > bValue) return order === 'asc' ? 1 : -1;
            return 0;
        });
        
        setBookings(sorted);
    };

    // Reset error
    const clearError = () => {
        setError(null);
    };

    // Reset bookings
    const resetBookings = () => {
        setBookings([]);
        setError(null);
    };

    // Gửi email booking
    const sendBookingEmail = async (booking: BookingDetail, type: 'booking_confirmation' | 'booking_update' | 'booking_cancellation') => {
        try {
            // Thêm delay 2 giây trước khi gửi email
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const emailData: EmailData = {
                to: booking.user_email,
                subject: type === 'booking_confirmation' ? 'Xác nhận đặt tour' : 
                        type === 'booking_update' ? 'Cập nhật thông tin tour' : 'Hủy tour',
                template: type,
                data: {
                    user_name: booking.user_name,
                    tour_name: booking.tour_name,
                    booking_id: booking.booking_id,
                    booking_date: booking.booking_date || '',
                    adults: booking.adults,
                    children: booking.children,
                    infants: booking.infants,
                    start_date: booking.start_date,
                    end_date: booking.end_date,
                    total_price: booking.total_price,
                    status: booking.status,
                    notes: booking.notes
                }
            };

            if (type === 'booking_confirmation') {
                await emailAPI.sendBookingConfirmation(emailData);
            } else if (type === 'booking_update') {
                await emailAPI.sendBookingUpdate(emailData);
            } else if (type === 'booking_cancellation') {
                await emailAPI.sendBookingCancellation(emailData);
            }
        } catch (err) {
            console.error('Failed to send booking email:', err);
            throw err;
        }
    };

    return {
        // State
        bookings,
        loading,
        error,
        
        // Actions
        fetchAllBookings,
        fetchBookingById,
        fetchBookingsByUserId,
        fetchBookingsByTourId,
        fetchBookingsByStatus,
        fetchBookingsByDateRange,
        createBooking,
        updateBooking,
        deleteBooking,
        
        // Utilities
        filterBookingsByStatus,
        searchBookings,
        sortBookings,
        clearError,
        resetBookings,
        sendBookingEmail,
    };
};
