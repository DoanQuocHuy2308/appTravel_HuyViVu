const db = require('../config/db');

class Contact {
	static async getAllContact() {
		const [result] = await db.query('SELECT * FROM contact');
		return result;
	}

	static async getContactById(id) {
		const [result] = await db.execute('SELECT * FROM contact WHERE id = ?', [id]);
		return result[0];
	}

	static async createContact(user_id, subject, message, status) {
		const [result] = await db.execute('INSERT INTO contact (user_id, subject, message, status) VALUES (?, ?, ?, ?)', [ user_id, subject, message, status ]);
		return result.insertId;
	}

	static async updateContact(id, user_id, subject, message, status) {
		const [result] = await db.execute("UPDATE contact SET user_id = ?, subject = ?, message = ?, status = ? WHERE id = ?", [user_id, subject, message, status, id]);
		return result.affectedRows > 0;
	}

	static async deleteContact(id) {
		const [result] = await db.execute('DELETE FROM contact WHERE id = ?', [id]);
		return result.affectedRows > 0;
	}

};

module.exports = Contact;
