const db = require('../config/db');

class Banners {
	static async getAllBanners() {
		const [result] = await db.query('SELECT * FROM banners');
		return result;
	}

	static async getBannersById(id) {
		const [result] = await db.execute('SELECT * FROM banners WHERE id = ?', [id]);
		return result[0];
	}

	static async createBanners(title, image, status) {
		const [result] = await db.execute('INSERT INTO banners (title, image, status) VALUES (?, ?, ?)', [ title, image, status ]);
		return result.insertId;
	}

	static async updateBanners(id, title, image, status) {
		const [result] = await db.execute("UPDATE banners SET title = ?, image = ?, status = ? WHERE id = ?", [title, image, status, id]);
		return result.affectedRows > 0;
	}

	static async deleteBanners(id) {
		const [result] = await db.execute('DELETE FROM banners WHERE id = ?', [id]);
		return result.affectedRows > 0;
	}

};

module.exports = Banners;
