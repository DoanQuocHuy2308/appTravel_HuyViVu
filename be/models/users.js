const db = require('../config/db');
const mahoa = require('../middleware/mahoaPass');

class Users {
	static async getAllUsers() {
		const [result] = await db.query('SELECT * FROM users');
		return result;
	}

	static async getUsersById(id) {
		const [result] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
		return result[0];
	}

	static async createUsers(name, email, password, phone, birthday, address, role, points, image) {
		const hashedPassword = await mahoa.maHoa(password);
		const [result] = await db.execute('INSERT INTO users (name, email, password, phone, birthday, address, role, points, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [ name, email, hashedPassword, phone, birthday, address, role, points, image ]);
		return result.insertId;
	}

	static async updateUsers(id, name, email, password, phone, birthday, address, role, points, image) {
		const hashedPassword = await mahoa.maHoa(password);
		const [result] = await db.execute("UPDATE users SET name = ?, email = ?, password = ?, phone = ?, birthday = ?, address = ?, role = ?, points = ?, image = ? WHERE id = ?", [name, email, hashedPassword, phone, birthday, address, role, points, image, id]);
		return result.affectedRows > 0;
	}

	static async deleteUsers(id) {
		const [result] = await db.execute('DELETE FROM users WHERE id = ?', [id]);
		return result.affectedRows > 0;
	}
	static async updateUserPoints(id, points) {
		const [result] = await db.execute("UPDATE users SET points = ? WHERE id = ?", [points, id]);
		return result.affectedRows > 0;
	}
	static async updateUserRole(id, role) {
		const [result] = await db.execute("UPDATE users SET role = ? WHERE id = ?", [role, id]);
		return result.affectedRows > 0;
	}
};

module.exports = Users;
