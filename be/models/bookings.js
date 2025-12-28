const db = require('../config/db');

class Bookings {
    // Lấy tất cả bookings
    static async getAllBookings() {
        try {
            const [result] = await db.query('CALL GetAllBookings()');
            return result[0]; // Trả về danh sách bookings
        } catch (error) {
            console.error('Error fetching all bookings:', error);
            throw new Error(`Failed to fetch bookings: ${error.message}`);
        }
    }

    // Lấy bookings theo user_id
    static async getBookingsByUserId(user_id) {
        try {
            const [result] = await db.query('CALL GetBookingsByUserId(?)', [user_id]);
            return result[0]; // Trả về danh sách bookings của user
        } catch (error) {
            console.error('Error fetching bookings by user_id:', error);
            throw new Error(`Failed to fetch bookings for user ${user_id}: ${error.message}`);
        }
    }

    // Lấy booking theo id
    static async getBookingsById(id) {
        try {
            const [result] = await db.query('CALL GetBookingById(?)', [id]);
            return result[0]; // Trả về thông tin booking
        } catch (error) {
            console.error('Error fetching booking by id:', error);
            throw new Error(`Failed to fetch booking ${id}: ${error.message}`);
        }
    }

    // Lấy bookings theo tour_id
    static async getBookingsByTourId(tour_id) {
        try {
            const [result] = await db.query('CALL GetBookingsByTourId(?)', [tour_id]);
            return result[0]; // Trả về danh sách bookings của tour
        } catch (error) {
            console.error('Error fetching bookings by tour_id:', error);
            throw new Error(`Failed to fetch bookings for tour ${tour_id}: ${error.message}`);
        }
    }

    // Lấy bookings theo trạng thái
    static async getBookingsByStatus(status) {
        try {
            const [result] = await db.query('CALL GetBookingsByStatus(?)', [status]);
            return result[0]; // Trả về danh sách bookings theo trạng thái
        } catch (error) {
            console.error('Error fetching bookings by status:', error);
            throw new Error(`Failed to fetch bookings with status ${status}: ${error.message}`);
        }
    }

    // Lấy bookings theo khoảng thời gian
    static async getBookingsByDateRange(start_date, end_date) {
        try {
            const [result] = await db.query('CALL GetBookingsByDateRange(?, ?)', [start_date, end_date]);
            return result[0]; // Trả về danh sách bookings trong khoảng thời gian
        } catch (error) {
            console.error('Error fetching bookings by date range:', error);
            throw new Error(`Failed to fetch bookings for date range ${start_date} to ${end_date}: ${error.message}`);
        }
    }

    // Đặt tour với mã giảm giá đã lưu
    static async booking(user_id, tour_id, adults, children, infants, start_date, end_date, notes, promotion_id = null) {
        try {
            const [result] = await db.query(
                'CALL BookTour(?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [user_id, tour_id, adults, children, infants, start_date, end_date, notes, promotion_id]
            );
            return result[0];
        } catch (error) {
            console.error('Error booking tour:', error);
            throw new Error(`Failed to book tour: ${error.message}`);
        }
    }

    static async updateBooking(id, adults, children, infants, notes, status, promotion_code = null) {
        try {
            const [resultSets] = await db.query(
                'CALL UpdateBooking(?, ?, ?, ?, ?, ?, ?)',
                [id, adults, children, infants, notes, status, promotion_code]
            );
            return resultSets[0];
        } catch (error) {
            console.error('Error updating booking:', error);
            throw new Error(`Failed to update booking ${id}: ${error.message}`);
        }
    }


    // Xóa booking
    static async deleteBooking(id) {
        try {
            const [result] = await db.query('CALL DeleteBooking(?)', [id]);
            return result[0];
        } catch (error) {
            console.error('Error deleting booking:', error);
            throw new Error(`Failed to delete booking ${id}: ${error.message}`);
        }
    }
}

module.exports = Bookings;