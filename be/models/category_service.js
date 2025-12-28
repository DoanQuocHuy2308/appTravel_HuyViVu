const db = require('../config/db');

class Category_Service {
	static async getAllCategory_Service() {
		const [result] = await db.query('SELECT * FROM category_service');
		return result;
	}

	static async getCategory_ServiceById(id) {
		const [result] = await db.execute('SELECT * FROM category_service WHERE id = ?', [id]);
		return result[0];
	}

	static async createCategory_Service(name, description) {
		const [result] = await db.execute('INSERT INTO category_service (name, description) VALUES (?, ?)', [ name, description ]);
		return result.insertId;
	}

	static async updateCategory_Service(id, name, description) {
		const [result] = await db.execute("UPDATE category_service SET name = ?, description = ? WHERE id = ?", [name, description, id]);
		return result.affectedRows > 0;
	}

	static async deleteCategory_Service(id) {
		const [result] = await db.execute('DELETE FROM category_service WHERE id = ?', [id]);
		return result.affectedRows > 0;
	}

};

module.exports = Category_Service;
