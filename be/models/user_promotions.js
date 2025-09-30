const db = require('../config/db');

class User_Promotions {
	static async getAllUser_Promotions() {
		const [result] = await db.query('SELECT * FROM user_promotions');
		return result;
	}

	static async getUser_PromotionsById(id) {
		const [result] = await db.execute('SELECT * FROM user_promotions WHERE id = ?', [id]);
		return result[0];
	}

	static async createUser_Promotions(user_id, promotion_id, used) {
		const [result] = await db.execute('INSERT INTO user_promotions (user_id, promotion_id, used) VALUES (?, ?, ?)', [ user_id, promotion_id, used ]);
		return result.insertId;
	}

	static async updateUser_Promotions(id, user_id, promotion_id, used) {
		const [result] = await db.execute("UPDATE user_promotions SET user_id = ?, promotion_id = ?, used = ? WHERE id = ?", [user_id, promotion_id, used, id]);
		return result.affectedRows > 0;
	}

	static async deleteUser_Promotions(id) {
		const [result] = await db.execute('DELETE FROM user_promotions WHERE id = ?', [id]);
		return result.affectedRows > 0;
	}

};

module.exports = User_Promotions;
