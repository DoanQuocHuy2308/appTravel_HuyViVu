const db = require('../config/db');

class Reviews {
	static async getAllReviews() {
		const [result] = await db.query('SELECT * FROM reviews');
		return result;
	}

	static async getReviewsById(id) {
		const [result] = await db.execute('SELECT * FROM reviews WHERE id = ?', [id]);
		return result[0];
	}

	static async createReviews(user_id, tour_id, rating, comment, image) {
		const [result] = await db.execute('INSERT INTO reviews (user_id, tour_id, rating, comment, image) VALUES (?, ?, ?, ?, ?)', [ user_id, tour_id, rating, comment, image ]);
		return result.insertId;
	}

	static async updateReviews(id, user_id, tour_id, rating, comment, image) {
		const [result] = await db.execute("UPDATE reviews SET user_id = ?, tour_id = ?, rating = ?, comment = ?, image = ? WHERE id = ?", [user_id, tour_id, rating, comment, image, id]);
		return result.affectedRows > 0;
	}

	static async deleteReviews(id) {
		const [result] = await db.execute('DELETE FROM reviews WHERE id = ?', [id]);
		return result.affectedRows > 0;
	}

};

module.exports = Reviews;
