const db = require('../config/db');

class User_Points {
	static async getAllUser_Points() {
		const [result] = await db.query('SELECT * FROM user_points');
		return result;
	}

	static async getUser_PointsById(id) {
		const [result] = await db.execute('SELECT * FROM user_points WHERE id = ?', [id]);
		return result[0];
	}

	static async createUser_Points(user_id, booking_id, points_change, reason) {
		const [result] = await db.execute('INSERT INTO user_points (user_id, booking_id, points_change, reason) VALUES (?, ?, ?, ?)', [ user_id, booking_id, points_change, reason ]);
		return result.insertId;
	}

	static async updateUser_Points(id, user_id, booking_id, points_change, reason) {
		const [result] = await db.execute("UPDATE user_points SET user_id = ?, booking_id = ?, points_change = ?, reason = ? WHERE id = ?", [user_id, booking_id, points_change, reason, id]);
		return result.affectedRows > 0;
	}

	static async deleteUser_Points(id) {
		const [result] = await db.execute('DELETE FROM user_points WHERE id = ?', [id]);
		return result.affectedRows > 0;
	}

};

module.exports = User_Points;
