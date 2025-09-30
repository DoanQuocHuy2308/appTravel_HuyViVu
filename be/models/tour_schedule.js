const db = require('../config/db');

class Tour_Schedule {
	static async getAllTour_Schedule() {
		const [result] = await db.query('SELECT * FROM tour_schedule');
		return result;
	}

	static async getTour_ScheduleById(id) {
		const [result] = await db.execute('SELECT * FROM tour_schedule WHERE id = ?', [id]);
		return result[0];
	}

	static async createTour_Schedule(tour_id, day_number, title, description) {
		const [result] = await db.execute('INSERT INTO tour_schedule (tour_id, day_number, title, description) VALUES (?, ?, ?, ?)', [ tour_id, day_number, title, description ]);
		return result.insertId;
	}

	static async updateTour_Schedule(id, tour_id, day_number, title, description) {
		const [result] = await db.execute("UPDATE tour_schedule SET tour_id = ?, day_number = ?, title = ?, description = ? WHERE id = ?", [tour_id, day_number, title, description, id]);
		return result.affectedRows > 0;
	}

	static async deleteTour_Schedule(id) {
		const [result] = await db.execute('DELETE FROM tour_schedule WHERE id = ?', [id]);
		return result.affectedRows > 0;
	}

};

module.exports = Tour_Schedule;
