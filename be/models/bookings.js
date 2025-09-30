const db = require('../config/db');

class Bookings {
	static async getAllBookings() {
		const [result] = await db.query('SELECT * FROM bookings');
		return result;
	}

	static async getBookingsById(id) {
		const [result] = await db.execute('SELECT * FROM bookings WHERE id = ?', [id]);
		return result[0];
	}

	static async createBookings(user_id, tour_id, adults, children, infants, notes, booking_date, start_date, end_date, total_price, status) {
		const [result] = await db.execute('INSERT INTO bookings (user_id, tour_id, adults, children, infants, notes, booking_date, start_date, end_date, total_price, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [ user_id, tour_id, adults, children, infants, notes, booking_date, start_date, end_date, total_price, status ]);
		return result.insertId;
	}

	static async updateBookings(id, user_id, tour_id, adults, children, infants, notes, booking_date, start_date, end_date, total_price, status) {
		const [result] = await db.execute("UPDATE bookings SET user_id = ?, tour_id = ?, adults = ?, children = ?, infants = ?, notes = ?, booking_date = ?, start_date = ?, end_date = ?, total_price = ?, status = ? WHERE id = ?", [user_id, tour_id, adults, children, infants, notes, booking_date, start_date, end_date, total_price, status, id]);
		return result.affectedRows > 0;
	}

	static async deleteBookings(id) {
		const [result] = await db.execute('DELETE FROM bookings WHERE id = ?', [id]);
		return result.affectedRows > 0;
	}

};

module.exports = Bookings;
