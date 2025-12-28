const db = require('../config/db');

class Tour_Notes {
	static async getAllTour_Notes() {
		const [result] = await db.query('SELECT * FROM tour_notes');
		return result;
	}

	static async getTour_NotesById(id) {
		const [result] = await db.execute('SELECT * FROM tour_notes WHERE id = ?', [id]);
		return result[0];
	}
	static async getTour_NotesByIdTour(id) {
		const [result] = await db.execute('SELECT * FROM tour_notes WHERE tour_id = ?', [id]);
		return result;
	}

	static async createTour_Notes(tour_id, title, note) {
		const [result] = await db.execute('INSERT INTO tour_notes (tour_id, title, note) VALUES (?, ?, ?)', [ tour_id, title, note ]);
		return result.insertId;
	}

	static async updateTour_Notes(id, tour_id, title, note) {
		const [result] = await db.execute("UPDATE tour_notes SET tour_id = ?, title = ?, note = ? WHERE id = ?", [tour_id, title, note, id]);
		return result.affectedRows > 0;
	}

	static async deleteTour_Notes(id) {
		const [result] = await db.execute('DELETE FROM tour_notes WHERE id = ?', [id]);
		return result.affectedRows > 0;
	}

};

module.exports = Tour_Notes;
