const Tour_Types = require('../models/tour_types')

exports.getAllTour_Types = async (req,res) => {
	try{

		const tour_types = await Tour_Types.getAllTour_Types();
		res.status(200).send(tour_types);
	} catch (error) {

		res.status(500).send({ message: error.message });
	};
};

exports.getTour_TypesById = async (req, res) =>{
	try{

		const tour_types = await Tour_Types.getTour_TypesById(req.query.id);
		if (!tour_types) return res.status(404).send({ message: 'tour_types không tìm thấy' });
		res.status(200).send(tour_types);
	} catch (error) {

		res.status(500).send({ message: error.message });
	};
};

exports.createTour_Types = async (req, res) => {
	try {
		const { name, description } = req.body;
		if (!name || !description) {
			return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin bắt buộc' });
		}
		const tour_typesId = await Tour_Types.createTour_Types( name, description );
		res.status(201).send({ message: 'Tạo thành công', tour_typesId });
	} catch (error) {
		res.status(500).send({ message: 'Lỗi server', error: error.message });
	};
};

exports.updateTour_Types = async (req, res) => {
	try {
		const { id } = req.query;
		const { name, description } = req.body;
		if (!name ||!description) {
			return res.status(400).send({ message: 'Vui lòng cung cấp đầy đủ thông tin bắt buộc' });
		}
		const updatedTour_Types = await Tour_Types.updateTour_Types(id,name, description);
		if (!updatedTour_Types){
			return res.status(404).send({ message: 'Tour_Types not found' });
		}
		res.status(200).send({ message: 'Cập nhật Tour_Types thành công', updatedTour_Types });
	} catch (error) {
		res.status(500).send({ message: 'Lỗi server', error: error.message });
	};
};

exports.deleteTour_Types = async (req, res) => {
	try {
		const { id } = req.query;
		const deletedTour_Types = await Tour_Types.deleteTour_Types(id);
		if (!deletedTour_Types)
		{
			return res.status(404).send({message: 'Tour_Types not found' });
		}
		res.status(200).send({ message: 'Xóa Tour_Types  thành công', deletedTour_Types });
	} catch (error) {
		res.status(500).send({ message: 'Lỗi server', error: error.message });
	};
};

