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

	static async getImage_TourByIdTour(tour_id) {
		const [result] = await db.execute('SELECT * FROM image_tour WHERE tour_id = ?', [tour_id]);
		return result;
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

	static async deleteImage_TourByIdTour(tour_id) {
		const [result] = await db.execute('SELECT * FROM image_tour WHERE tour_id = ?', [tour_id]);
		const images = result;
		await db.execute('DELETE FROM image_tour WHERE tour_id = ?', [tour_id]);
		return images;
	}

	static async createMultipleImage_Tour(tour_id, images) {
		// Tạo câu query để insert nhiều ảnh cùng lúc
		const values = images.map(image => [tour_id, image]);
		const placeholders = values.map(() => '(?, ?)').join(', ');
		const flatValues = values.flat();
		
		const [result] = await db.execute(
			`INSERT INTO image_tour (tour_id, image) VALUES ${placeholders}`,
			flatValues
		);
		return result.insertId;
	}

};

module.exports = Image_Tour;
