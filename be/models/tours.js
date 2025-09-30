const db = require('../config/db');

class Tours {
	static async getAllTours() {
		const [result] = await db.query('SELECT * FROM tours');
		return result;
	}

	static async getToursById(id) {
		const [result] = await db.execute('SELECT * FROM tours WHERE id = ?', [id]);
		return result[0];
	}

	static async createTours(name, tour_type_id, start_location_id, end_location_id, description, notes, max_customers, duration_days, start_date, guide_id, location, ideal_time, transportation, suitable_for, point) {
		const [result] = await db.execute('INSERT INTO tours (name, tour_type_id, start_location_id, end_location_id, description, notes, max_customers, duration_days, start_date, guide_id, location, ideal_time, transportation, suitable_for, point) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [ name, tour_type_id, start_location_id, end_location_id, description, notes, max_customers, duration_days, start_date, guide_id, location, ideal_time, transportation, suitable_for, point ]);
		return result.insertId;
	}

	static async updateTours(id, name, tour_type_id, start_location_id, end_location_id, description, notes, max_customers, duration_days, start_date, guide_id, location, ideal_time, transportation, suitable_for, point) {
		const [result] = await db.execute("UPDATE tours SET name = ?, tour_type_id = ?, start_location_id = ?, end_location_id = ?, description = ?, notes = ?, max_customers = ?, duration_days = ?, start_date = ?, guide_id = ?, location = ?, ideal_time = ?, transportation = ?, suitable_for = ?, point = ? WHERE id = ?", [name, tour_type_id, start_location_id, end_location_id, description, notes, max_customers, duration_days, start_date, guide_id, location, ideal_time, transportation, suitable_for, point, id]);
		return result.affectedRows > 0;
	}

	static async deleteTours(id) {
		const [result] = await db.execute('DELETE FROM tours WHERE id = ?', [id]);
		return result.affectedRows > 0;
	}

};

module.exports = Tours;
