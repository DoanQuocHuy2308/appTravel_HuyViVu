import axios from 'axios';
import { API_URL } from '../types/url';
import { Booking, newBooking, BookingDetail } from '../types';

export const bookingAPI = {
    getAllBookings: async (): Promise<BookingDetail[]> => {
        const response = await axios.get(`${API_URL}/bookings/getAllBookings`);
        return response.data;
    },
    getBookingsById: async (id: number): Promise<Booking> => {
        const response = await axios.get(`${API_URL}/bookings/getBookingsById?id=${id}`);
        return response.data;
    },
    booking: async (booking: Omit<newBooking, 'id'>): Promise<newBooking> => {
        const response = await axios.post(`${API_URL}/bookings/booking`, booking);
        return response.data;
    },
    updateBooking: async (booking: Partial<newBooking>): Promise<newBooking> => {
        const response = await axios.put(`${API_URL}/bookings/updateBooking`, booking);
        return response.data;
    },
    deleteBooking: async (id: number): Promise<void> => {
        await axios.delete(`${API_URL}/bookings/deleteBooking`, { data: { id } });
    },
    getBookingsByUserId: async (user_id: number): Promise<BookingDetail[]> => {
        const response = await axios.get(`${API_URL}/bookings/getBookingsByUserId?user_id=${user_id}`);
        return response.data;
    },
    getBookingsByTourId: async (tour_id: number): Promise<BookingDetail[]> => {
        const response = await axios.get(`${API_URL}/bookings/getBookingsByTourId?tour_id=${tour_id}`);
        return response.data;
    },
    getBookingsByStatus: async (status: string): Promise<BookingDetail[]> => {
        const response = await axios.get(`${API_URL}/bookings/getBookingsByStatus?status=${status}`);
        return response.data;
    },
    getBookingsByDateRange: async (start_date: string, end_date: string): Promise<BookingDetail[]> => {
        const response = await axios.get(`${API_URL}/bookings/getBookingsByDateRange?start_date=${start_date}&end_date=${end_date}`);
        return response.data;
    },
}