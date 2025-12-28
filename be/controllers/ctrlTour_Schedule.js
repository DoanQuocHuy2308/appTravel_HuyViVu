const Tour_Schedule = require('../models/tour_schedule')

exports.getAllTour_Schedule = async (req,res) => {
	try{

		const tour_schedule = await Tour_Schedule.getAllTour_Schedule();
		res.status(200).send(tour_schedule);
	} catch (error) {

		res.status(500).send({ message: error.message });
	};
};

exports.getTour_ScheduleById = async (req, res) =>{
	try{

		const tour_schedule = await Tour_Schedule.getTour_ScheduleById(req.query.id);
		if (!tour_schedule) return res.status(404).send({ message: 'tour_schedule không tìm thấy' });
		res.status(200).send(tour_schedule);
	} catch (error) {

		res.status(500).send({ message: error.message });
	};
};

exports.getTour_ScheduleByIdTour = async (req, res) => {

	try {
		const tour_schedule = await Tour_Schedule.getTour_ScheduleByIdTour(req.query.id);
		res.status(200).send(tour_schedule);
	} catch (error) {
		res.status(500).send({ message: error.message });
	};
};

exports.createTour_Schedule = async (req, res) => {
	try {
		const { tour_id, day_number, title, description } = req.body;
		if (!tour_id || !day_number || !title || !description) {
			return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin bắt buộc' });
		}
		const tour_scheduleId = await Tour_Schedule.createTour_Schedule( tour_id, day_number, title, description );
		res.status(201).send({ message: 'Tạo thành công', tour_scheduleId });
	} catch (error) {
		res.status(500).send({ message: 'Lỗi server', error: error.message });
	};
};

exports.updateTour_Schedule = async (req, res) => {
	try {
		const { id } = req.query;
		const { tour_id, day_number, title, description } = req.body;
		if (!tour_id ||!day_number ||!title ||!description) {
			return res.status(400).send({ message: 'Vui lòng cung cấp đầy đủ thông tin bắt buộc' });
		}
		const updatedTour_Schedule = await Tour_Schedule.updateTour_Schedule(id,tour_id, day_number, title, description);
		if (!updatedTour_Schedule){
			return res.status(404).send({ message: 'Tour_Schedule not found' });
		}
		res.status(200).send({ message: 'Cập nhật Tour_Schedule thành công', updatedTour_Schedule });
	} catch (error) {
		res.status(500).send({ message: 'Lỗi server', error: error.message });
	};
};

exports.deleteTour_Schedule = async (req, res) => {
	try {
		const { id } = req.query;
		const deletedTour_Schedule = await Tour_Schedule.deleteTour_Schedule(id);
		if (!deletedTour_Schedule)
		{
			return res.status(404).send({message: 'Tour_Schedule not found' });
		}
		res.status(200).send({ message: 'Xóa Tour_Schedule  thành công', deletedTour_Schedule });
	} catch (error) {
		res.status(500).send({ message: 'Lỗi server', error: error.message });
	};
};

