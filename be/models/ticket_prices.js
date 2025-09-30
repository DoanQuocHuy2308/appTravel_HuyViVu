const db = require('../config/db');

class Ticket_Prices {
	static async getAllTicket_Prices() {
		const [result] = await db.query('SELECT * FROM ticket_prices');
		return result;
	}

	static async getTicket_PricesById(id) {
		const [result] = await db.execute('SELECT * FROM ticket_prices WHERE id = ?', [id]);
		return result[0];
	}

	static async createTicket_Prices(tour_id, customer_type, price) {
		const [result] = await db.execute('INSERT INTO ticket_prices (tour_id, customer_type, price) VALUES (?, ?, ?)', [ tour_id, customer_type, price ]);
		return result.insertId;
	}

	static async updateTicket_Prices(id, tour_id, customer_type, price) {
		const [result] = await db.execute("UPDATE ticket_prices SET tour_id = ?, customer_type = ?, price = ? WHERE id = ?", [tour_id, customer_type, price, id]);
		return result.affectedRows > 0;
	}

	static async deleteTicket_Prices(id) {
		const [result] = await db.execute('DELETE FROM ticket_prices WHERE id = ?', [id]);
		return result.affectedRows > 0;
	}

};

module.exports = Ticket_Prices;
