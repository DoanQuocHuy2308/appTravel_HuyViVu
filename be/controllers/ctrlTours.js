const Tours = require('../models/tours')

exports.getAllTours = async (req,res) => {
	try{

		const tours = await Tours.getAllTours();
		res.status(200).send(tours);
	} catch (error) {

		res.status(500).send({ message: error.message });
	};
};

exports.getToursById = async (req, res) =>{
	try{

		const tours = await Tours.getToursById(req.query.id);
		if (!tours) return res.status(404).send({ message: 'tours không tìm thấy' });
		res.status(200).send(tours);
	} catch (error) {

		res.status(500).send({ message: error.message });
	};
};

exports.createTours = async (req, res) => {
	try {
		const { name, tour_type_id, start_location_id, end_location_id, description, notes, max_customers, duration_days, start_date, guide_id, location, ideal_time, transportation, suitable_for, point } = req.body;
		if (!name || !tour_type_id || !start_location_id || !end_location_id || !description || !notes || !max_customers || !duration_days || !start_date || !guide_id || !location || !ideal_time || !transportation || !suitable_for || !point) {
			return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin bắt buộc' });
		}
		const toursId = await Tours.createTours( name, tour_type_id, start_location_id, end_location_id, description, notes, max_customers, duration_days, start_date, guide_id, location, ideal_time, transportation, suitable_for, point );
		res.status(201).send({ message: 'Tạo thành công', toursId });
	} catch (error) {
		res.status(500).send({ message: 'Lỗi server', error: error.message });
	};
};

exports.updateTours = async (req, res) => {
	try {
		const { id } = req.query;
		const { name, tour_type_id, start_location_id, end_location_id, description, notes, max_customers, duration_days, start_date, guide_id, location, ideal_time, transportation, suitable_for, point } = req.body;
		if (!name ||!tour_type_id ||!start_location_id ||!end_location_id ||!description ||!notes ||!max_customers ||!duration_days ||!start_date ||!guide_id ||!location ||!ideal_time ||!transportation ||!suitable_for ||!point) {
			return res.status(400).send({ message: 'Vui lòng cung cấp đầy đủ thông tin bắt buộc' });
		}
		const updatedTours = await Tours.updateTours(id,name, tour_type_id, start_location_id, end_location_id, description, notes, max_customers, duration_days, start_date, guide_id, location, ideal_time, transportation, suitable_for, point);
		if (!updatedTours){
			return res.status(404).send({ message: 'Tours not found' });
		}
		res.status(200).send({ message: 'Cập nhật Tours thành công', updatedTours });
	} catch (error) {
		res.status(500).send({ message: 'Lỗi server', error: error.message });
	};
};

exports.deleteTours = async (req, res) => {
	try {
		const { id } = req.query;
		const deletedTours = await Tours.deleteTours(id);
		if (!deletedTours)
		{
			return res.status(404).send({message: 'Tours not found' });
		}
		res.status(200).send({ message: 'Xóa Tours  thành công', deletedTours });
	} catch (error) {
		res.status(500).send({ message: 'Lỗi server', error: error.message });
	};
};

