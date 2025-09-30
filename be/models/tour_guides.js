const db = require('../config/db');

class Tour_Guides {
	static async getAllTour_Guides() {
		const [result] = await db.query('SELECT * FROM tour_guides');
		return result;
	}

	static async getTour_GuidesById(id) {
		const [result] = await db.execute('SELECT * FROM tour_guides WHERE id = ?', [id]);
		return result[0];
	}

	static async createTour_Guides(user_id, experience_years, language) {
		const [result] = await db.execute('INSERT INTO tour_guides (user_id, experience_years, language) VALUES (?, ?, ?)', [ user_id, experience_years, language ]);
		return result.insertId;
	}

	static async updateTour_Guides(id, user_id, experience_years, language) {
		const [result] = await db.execute("UPDATE tour_guides SET user_id = ?, experience_years = ?, language = ? WHERE id = ?", [user_id, experience_years, language, id]);
		return result.affectedRows > 0;
	}

	static async deleteTour_Guides(id) {
		const [result] = await db.execute('DELETE FROM tour_guides WHERE id = ?', [id]);
		return result.affectedRows > 0;
	}

};

module.exports = Tour_Guides;
