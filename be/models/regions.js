const db = require('../config/db');

class Regions {
	static async getAllRegions() {
		const [result] = await db.query('SELECT * FROM regions');
		return result;
	}

	static async getRegionsById(id) {
		const [result] = await db.execute('SELECT * FROM regions WHERE id = ?', [id]);
		return result[0];
	}

	static async createRegions(name, description) {
		const [result] = await db.execute('INSERT INTO regions (name, description) VALUES (?, ?)', [ name, description ]);
		return result.insertId;
	}

	static async updateRegions(id, name, description) {
		const [result] = await db.execute("UPDATE regions SET name = ?, description = ? WHERE id = ?", [name, description, id]);
		return result.affectedRows > 0;
	}

	static async deleteRegions(id) {
		const [result] = await db.execute('DELETE FROM regions WHERE id = ?', [id]);
		return result.affectedRows > 0;
	}

};

module.exports = Regions;
