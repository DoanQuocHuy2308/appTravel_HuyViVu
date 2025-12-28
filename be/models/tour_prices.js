const db = require('../config/db');

class Tour_Prices {
	static async getAllTour_Prices() {
		const [result] = await db.query('SELECT * FROM tour_prices');
		return result;
	}

	static async getTour_PricesById(id) {
		const [result] = await db.execute('SELECT * FROM tour_prices WHERE id = ?', [id]);
		return result[0];
	}

	static async createTour_Prices(tour_id, start_date, end_date, oldPrice, price) {
		const [result] = await db.execute('INSERT INTO tour_prices (tour_id, start_date, end_date, oldPrice, price) VALUES (?, ?, ?, ?, ?)', [ tour_id, start_date, end_date, oldPrice, price ]);
		return result.insertId;
	}

	static async updateTour_Prices(id, tour_id, start_date, end_date, oldPrice, price) {
		const [result] = await db.execute("UPDATE tour_prices SET tour_id = ?, start_date = ?, end_date = ?, oldPrice = ?, price = ? WHERE id = ?", [tour_id, start_date, end_date, oldPrice, price, id]);
		return result.affectedRows > 0;
	}

	static async deleteTour_Prices(id) {
		const [result] = await db.execute('DELETE FROM tour_prices WHERE id = ?', [id]);
		return result.affectedRows > 0;
	}

};

module.exports = Tour_Prices;
