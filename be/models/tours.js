const db = require('../config/db');

class Tours {
	static async getAllTours() {
		const [result] = await db.query('CALL GetAllTours()');
		return result[0];
	}

	static async getToursById(id) {
		const [result] = await db.execute('CALL getTourById(?)', [id]);
		return result[0][0];
	}
	static async getAllTourByTime() {
		const [result] = await db.query('CALL GetAllTourByTime()');
		return result[0];
	}
	static async getAllTourByTransportation() {
		const [result] = await db.query('CALL GetAllTourByTransportation()');
		return result[0];
	}
	static async createTours(name, tour_type_id, start_location_id, end_location_id, location_id, description, locations, max_customers, duration_days, start_date, end_date,guide_id, ideal_time, transportation, suitable_for, point) {
		const [result] = await db.execute('INSERT INTO tours (name, tour_type_id, start_location_id, end_location_id, location_id, description, locations, max_customers, duration_days, start_date, end_date, guide_id, ideal_time, transportation, suitable_for, point) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [ name, tour_type_id, start_location_id, end_location_id, location_id, description, locations, max_customers, duration_days, start_date, end_date, guide_id, ideal_time, transportation, suitable_for, point ]);
		return result.insertId;
	}

	static async updateTours(id, name, tour_type_id, start_location_id, end_location_id, location_id, description, locations, max_customers, duration_days, start_date, end_date, guide_id, ideal_time, transportation, suitable_for, point) {
		const [result] = await db.execute("UPDATE tours SET name = ?, tour_type_id = ?, start_location_id = ?, end_location_id = ?, location_id = ?, description = ?, locations = ?, max_customers = ?, duration_days = ?, start_date = ?, end_date = ?, guide_id = ?, ideal_time = ?, transportation = ?, suitable_for = ?, point = ? WHERE id = ?", [name, tour_type_id, start_location_id, end_location_id, location_id, description, locations, max_customers, duration_days, start_date, end_date, guide_id, ideal_time, transportation, suitable_for, point, id]);
		return result.affectedRows > 0;
	}

	static async deleteTours(id) {
		const [result] = await db.execute('DELETE FROM tours WHERE id = ?', [id]);
		return result.affectedRows > 0;
	}

};

module.exports = Tours;
