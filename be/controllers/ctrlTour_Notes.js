const Tour_Notes = require('../models/tour_notes')

exports.getAllTour_Notes = async (req,res) => {
	try{

		const tour_notes = await Tour_Notes.getAllTour_Notes();
		res.status(200).send(tour_notes);
	} catch (error) {

		res.status(500).send({ message: error.message });
	};
};

exports.getTour_NotesById = async (req, res) =>{
	try{

		const tour_notes = await Tour_Notes.getTour_NotesById(req.query.id);
		if (!tour_notes) return res.status(404).send({ message: 'tour_notes không tìm thấy' });
		res.status(200).send(tour_notes);
	} catch (error) {

		res.status(500).send({ message: error.message });
	};
};

exports.getTour_NotesByIdTour = async (req, res) => {

	try {
		const tour_notes = await Tour_Notes.getTour_NotesByIdTour(req.query.id);
		res.status(200).send(tour_notes);
	} catch (error) {
		res.status(500).send({ message: error.message });
	};
};

exports.createTour_Notes = async (req, res) => {
	try {
		const { tour_id, title, note } = req.body;
		if (!tour_id || !title || !note) {
			return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin bắt buộc' });
		}
		const tour_notesId = await Tour_Notes.createTour_Notes( tour_id, title, note );
		res.status(201).send({ message: 'Tạo thành công', tour_notesId });
	} catch (error) {
		res.status(500).send({ message: 'Lỗi server', error: error.message });
	};
};

exports.updateTour_Notes = async (req, res) => {
	try {
		const { id } = req.query;
		const { tour_id, title, note } = req.body;
		if (!tour_id ||!title ||!note) {
			return res.status(400).send({ message: 'Vui lòng cung cấp đầy đủ thông tin bắt buộc' });
		}
		const updatedTour_Notes = await Tour_Notes.updateTour_Notes(id,tour_id, title, note);
		if (!updatedTour_Notes){
			return res.status(404).send({ message: 'Tour_Notes not found' });
		}
		res.status(200).send({ message: 'Cập nhật Tour_Notes thành công', updatedTour_Notes });
	} catch (error) {
		res.status(500).send({ message: 'Lỗi server', error: error.message });
	};
};

exports.deleteTour_Notes = async (req, res) => {
	try {
		const { id } = req.query;
		const deletedTour_Notes = await Tour_Notes.deleteTour_Notes(id);
		if (!deletedTour_Notes)
		{
			return res.status(404).send({message: 'Tour_Notes not found' });
		}
		res.status(200).send({ message: 'Xóa Tour_Notes  thành công', deletedTour_Notes });
	} catch (error) {
		res.status(500).send({ message: 'Lỗi server', error: error.message });
	};
};

