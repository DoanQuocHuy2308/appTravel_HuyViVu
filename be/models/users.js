const db = require('../config/db');

class Users {
	static async getAllUsers() {
		const [result] = await db.query('SELECT * FROM users');
		return result;
	}

	static async getUsersById(id) {
		const [result] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
		return result[0];
	}

	static async createUsers(name, email, password, phone, address, role, points, image) {
		const [result] = await db.execute('INSERT INTO users (name, email, password, phone, address, role, points, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [ name, email, password, phone, address, role, points, image ]);
		return result.insertId;
	}

	static async updateUsers(id, name, email, password, phone, address, role, points, image) {
		const [result] = await db.execute("UPDATE users SET name = ?, email = ?, password = ?, phone = ?, address = ?, role = ?, points = ?, image = ? WHERE id = ?", [name, email, password, phone, address, role, points, image, id]);
		return result.affectedRows > 0;
	}

	static async deleteUsers(id) {
		const [result] = await db.execute('DELETE FROM users WHERE id = ?', [id]);
		return result.affectedRows > 0;
	}

};

module.exports = Users;
