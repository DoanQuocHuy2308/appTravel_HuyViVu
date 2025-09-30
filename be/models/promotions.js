const db = require('../config/db');

class Promotions {
	static async getAllPromotions() {
		const [result] = await db.query('SELECT * FROM promotions');
		return result;
	}

	static async getPromotionsById(id) {
		const [result] = await db.execute('SELECT * FROM promotions WHERE id = ?', [id]);
		return result[0];
	}

	static async createPromotions(code, description, discount, start_date, end_date, status) {
		const [result] = await db.execute('INSERT INTO promotions (code, description, discount, start_date, end_date, status) VALUES (?, ?, ?, ?, ?, ?)', [ code, description, discount, start_date, end_date, status ]);
		return result.insertId;
	}

	static async updatePromotions(id, code, description, discount, start_date, end_date, status) {
		const [result] = await db.execute("UPDATE promotions SET code = ?, description = ?, discount = ?, start_date = ?, end_date = ?, status = ? WHERE id = ?", [code, description, discount, start_date, end_date, status, id]);
		return result.affectedRows > 0;
	}

	static async deletePromotions(id) {
		const [result] = await db.execute('DELETE FROM promotions WHERE id = ?', [id]);
		return result.affectedRows > 0;
	}

};

module.exports = Promotions;
