const db = require('../config/db');

class Locations {
	static async getAllLocations() {
		const [result] = await db.query('SELECT * FROM locations');
		return result;
	}

	static async getLocationsById(id) {
		const [result] = await db.execute('SELECT * FROM locations WHERE id = ?', [id]);
		return result[0];
	}

	static async createLocations(name, description, city, country, image, region_id) {
		const [result] = await db.execute('INSERT INTO locations (name, description, city, country, image, region_id) VALUES (?, ?, ?, ?, ?, ?)', [ name, description, city, country, image, region_id ]);
		return result.insertId;
	}

	static async updateLocations(id, name, description, city, country, image, region_id) {
		const [result] = await db.execute("UPDATE locations SET name = ?, description = ?, city = ?, country = ?, image = ?, region_id = ? WHERE id = ?", [name, description, city, country, image, region_id, id]);
		return result.affectedRows > 0;
	}

	static async deleteLocations(id) {
		const [result] = await db.execute('DELETE FROM locations WHERE id = ?', [id]);
		return result.affectedRows > 0;
	}

};

module.exports = Locations;
