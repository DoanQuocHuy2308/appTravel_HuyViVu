const db = require('../config/db');

class Services {
	static async getAllServices() {
		const [result] = await db.query('SELECT * FROM services');
		return result;
	}

	static async getServicesById(id) {
		const [result] = await db.execute('SELECT * FROM services WHERE id = ?', [id]);
		return result[0];
	}

	static async createServices(name, service_type, description, price) {
		const [result] = await db.execute('INSERT INTO services (name, service_type, description, price) VALUES (?, ?, ?, ?)', [ name, service_type, description, price ]);
		return result.insertId;
	}

	static async updateServices(id, name, service_type, description, price) {
		const [result] = await db.execute("UPDATE services SET name = ?, service_type = ?, description = ?, price = ? WHERE id = ?", [name, service_type, description, price, id]);
		return result.affectedRows > 0;
	}

	static async deleteServices(id) {
		const [result] = await db.execute('DELETE FROM services WHERE id = ?', [id]);
		return result.affectedRows > 0;
	}

};

module.exports = Services;
