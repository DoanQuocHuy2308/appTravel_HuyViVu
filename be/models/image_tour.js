const db = require('../config/db');

class Image_Tour {
	static async getAllImage_Tour() {
		const [result] = await db.query('SELECT * FROM image_tour');
		return result;
	}

	static async getImage_TourById(id) {
		const [result] = await db.execute('SELECT * FROM image_tour WHERE id = ?', [id]);
		return result[0];
	}

	static async createImage_Tour(tour_id, image) {
		const [result] = await db.execute('INSERT INTO image_tour (tour_id, image) VALUES (?, ?)', [ tour_id, image ]);
		return result.insertId;
	}

	static async updateImage_Tour(id, tour_id, image) {
		const [result] = await db.execute("UPDATE image_tour SET tour_id = ?, image = ? WHERE id = ?", [tour_id, image, id]);
		return result.affectedRows > 0;
	}

	static async deleteImage_Tour(id) {
		const [result] = await db.execute('DELETE FROM image_tour WHERE id = ?', [id]);
		return result.affectedRows > 0;
	}

};

module.exports = Image_Tour;
