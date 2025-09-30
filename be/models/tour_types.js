const db = require('../config/db');

class Tour_Types {
	static async getAllTour_Types() {
		const [result] = await db.query('SELECT * FROM tour_types');
		return result;
	}

	static async getTour_TypesById(id) {
		const [result] = await db.execute('SELECT * FROM tour_types WHERE id = ?', [id]);
		return result[0];
	}

	static async createTour_Types(name, description) {
		const [result] = await db.execute('INSERT INTO tour_types (name, description) VALUES (?, ?)', [ name, description ]);
		return result.insertId;
	}

	static async updateTour_Types(id, name, description) {
		const [result] = await db.execute("UPDATE tour_types SET name = ?, description = ? WHERE id = ?", [name, description, id]);
		return result.affectedRows > 0;
	}

	static async deleteTour_Types(id) {
		const [result] = await db.execute('DELETE FROM tour_types WHERE id = ?', [id]);
		return result.affectedRows > 0;
	}

};

module.exports = Tour_Types;
