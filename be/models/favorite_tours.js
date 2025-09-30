const db = require('../config/db');

class Favorite_Tours {
	static async getAllFavorite_Tours() {
		const [result] = await db.query('SELECT * FROM favorite_tours');
		return result;
	}

	static async getFavorite_ToursById(id) {
		const [result] = await db.execute('SELECT * FROM favorite_tours WHERE id = ?', [id]);
		return result[0];
	}

	static async createFavorite_Tours(user_id, tour_id) {
		const [result] = await db.execute('INSERT INTO favorite_tours (user_id, tour_id) VALUES (?, ?)', [ user_id, tour_id ]);
		return result.insertId;
	}

	static async updateFavorite_Tours(id, user_id, tour_id) {
		const [result] = await db.execute("UPDATE favorite_tours SET user_id = ?, tour_id = ? WHERE id = ?", [user_id, tour_id, id]);
		return result.affectedRows > 0;
	}

	static async deleteFavorite_Tours(id) {
		const [result] = await db.execute('DELETE FROM favorite_tours WHERE id = ?', [id]);
		return result.affectedRows > 0;
	}

};

module.exports = Favorite_Tours;
