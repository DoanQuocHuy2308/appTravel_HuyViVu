const db = require('../config/db');

class Booking_Services {
	static async getAllBooking_Services() {
		const [result] = await db.query('SELECT * FROM booking_services');
		return result;
	}

	static async getBooking_ServicesById(id) {
		const [result] = await db.execute('SELECT * FROM booking_services WHERE id = ?', [id]);
		return result[0];
	}

	static async createBooking_Services(user_id, service_id, quantity, price, location, booking_date) {
		const [result] = await db.execute('INSERT INTO booking_services (user_id, service_id, quantity, price, location, booking_date) VALUES (?, ?, ?, ?, ?, ?)', [ user_id, service_id, quantity, price, location, booking_date ]);
		return result.insertId;
	}

	static async updateBooking_Services(id, user_id, service_id, quantity, price, location, booking_date) {
		const [result] = await db.execute("UPDATE booking_services SET user_id = ?, service_id = ?, quantity = ?, price = ?, location = ?, booking_date = ? WHERE id = ?", [user_id, service_id, quantity, price, location, booking_date, id]);
		return result.affectedRows > 0;
	}

	static async deleteBooking_Services(id) {
		const [result] = await db.execute('DELETE FROM booking_services WHERE id = ?', [id]);
		return result.affectedRows > 0;
	}

};

module.exports = Booking_Services;
