const db = require('../config/db');

class Combo_Items {
	static async getAllCombo_Items() {
		const [result] = await db.query('SELECT * FROM combo_items');
		return result;
	}

	static async getCombo_ItemsById(id) {
		const [result] = await db.execute('SELECT * FROM combo_items WHERE id = ?', [id]);
		return result[0];
	}

	static async createCombo_Items(combo_id, service_id) {
		const [result] = await db.execute('INSERT INTO combo_items (combo_id, service_id) VALUES (?, ?)', [ combo_id, service_id ]);
		return result.insertId;
	}

	static async updateCombo_Items(id, combo_id, service_id) {
		const [result] = await db.execute("UPDATE combo_items SET combo_id = ?, service_id = ? WHERE id = ?", [combo_id, service_id, id]);
		return result.affectedRows > 0;
	}

	static async deleteCombo_Items(id) {
		const [result] = await db.execute('DELETE FROM combo_items WHERE id = ?', [id]);
		return result.affectedRows > 0;
	}

};

module.exports = Combo_Items;
