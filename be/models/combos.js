const db = require('../config/db');

class Combos {
	static async getAllCombos() {
		const [result] = await db.query('CALL GetAllCombos()');
		return result[0];
	}

	static async getCombosById(id) {
		const [result] = await db.execute('SELECT * FROM combos WHERE id = ?', [id]);
		return result[0];
	}

	static async createCombos(name, tour_id, description, total_price, discount, start_date, end_date, status) {
		const [result] = await db.execute('INSERT INTO combos (name, tour_id, description, total_price, discount, start_date, end_date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [ name, tour_id, description, total_price, discount, start_date, end_date, status ]);
		return result.insertId;
	}

	static async updateCombos(id, name, tour_id, description, total_price, discount, start_date, end_date, status) {
		const [result] = await db.execute("UPDATE combos SET name = ?, tour_id = ?, description = ?, total_price = ?, discount = ?, start_date = ?, end_date = ?, status = ? WHERE id = ?", [name, tour_id, description, total_price, discount, start_date, end_date, status, id]);
		return result.affectedRows > 0;
	}

	static async deleteCombos(id) {
		const [result] = await db.execute('DELETE FROM combos WHERE id = ?', [id]);
		return result.affectedRows > 0;
	}

};

module.exports = Combos;
