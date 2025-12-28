const db = require('../config/db');

class Image_Service {
	static async getAllImage_Service() {
		const [result] = await db.query('SELECT * FROM image_service');
		return result;
	}

	static async getImage_ServiceById(id) {
		const [result] = await db.execute('SELECT * FROM image_service WHERE id = ?', [id]);
		return result[0];
	}

	static async createImage_Service(service_id, image) {
		const [result] = await db.execute('INSERT INTO image_service (service_id, image) VALUES (?, ?)', [ service_id, image ]);
		return result.insertId;
	}

	static async updateImage_Service(id, service_id, image) {
		const [result] = await db.execute("UPDATE image_service SET service_id = ?, image = ? WHERE id = ?", [service_id, image, id]);
		return result.affectedRows > 0;
	}

	static async deleteImage_Service(id) {
		const [result] = await db.execute('DELETE FROM image_service WHERE id = ?', [id]);
		return result.affectedRows > 0;
	}

};

module.exports = Image_Service;
