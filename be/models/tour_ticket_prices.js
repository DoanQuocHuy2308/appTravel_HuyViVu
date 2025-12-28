const db = require('../config/db');

class Tour_Ticket_Prices {
	static async getAllTour_Ticket_Prices() {
		const [result] = await db.query('SELECT * FROM tour_ticket_prices');
		return result;
	}

	static async getTour_Ticket_PricesById(id) {
		const [result] = await db.execute('SELECT * FROM tour_ticket_prices WHERE id = ?', [id]);
		return result[0];
	}

	static async createTour_Ticket_Prices(tour_id, customer_type, start_date, end_date, old_price, price) {
		const [result] = await db.execute('INSERT INTO tour_ticket_prices (tour_id, customer_type, start_date, end_date, old_price, price) VALUES (?, ?, ?, ?, ?, ?)', [ tour_id, customer_type, start_date, end_date, old_price, price ]);
		return result.insertId;
	}

	static async updateTour_Ticket_Prices(id, tour_id, customer_type, start_date, end_date, old_price, price) {
		const [result] = await db.execute("UPDATE tour_ticket_prices SET tour_id = ?, customer_type = ?, start_date = ?, end_date = ?, old_price = ?, price = ? WHERE id = ?", [tour_id, customer_type, start_date, end_date, old_price, price, id]);
		return result.affectedRows > 0;
	}

	static async deleteTour_Ticket_Prices(id) {
		const [result] = await db.execute('DELETE FROM tour_ticket_prices WHERE id = ?', [id]);
		return result.affectedRows > 0;
	}

};

module.exports = Tour_Ticket_Prices;
