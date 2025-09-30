const Tour_Guides = require('../models/tour_guides')

exports.getAllTour_Guides = async (req,res) => {
	try{

		const tour_guides = await Tour_Guides.getAllTour_Guides();
		res.status(200).send(tour_guides);
	} catch (error) {

		res.status(500).send({ message: error.message });
	};
};

exports.getTour_GuidesById = async (req, res) =>{
	try{

		const tour_guides = await Tour_Guides.getTour_GuidesById(req.query.id);
		if (!tour_guides) return res.status(404).send({ message: 'tour_guides không tìm thấy' });
		res.status(200).send(tour_guides);
	} catch (error) {

		res.status(500).send({ message: error.message });
	};
};

exports.createTour_Guides = async (req, res) => {
	try {
		const { user_id, experience_years, language } = req.body;
		if (!user_id || !experience_years || !language) {
			return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin bắt buộc' });
		}
		const tour_guidesId = await Tour_Guides.createTour_Guides( user_id, experience_years, language );
		res.status(201).send({ message: 'Tạo thành công', tour_guidesId });
	} catch (error) {
		res.status(500).send({ message: 'Lỗi server', error: error.message });
	};
};

exports.updateTour_Guides = async (req, res) => {
	try {
		const { id } = req.query;
		const { user_id, experience_years, language } = req.body;
		if (!user_id ||!experience_years ||!language) {
			return res.status(400).send({ message: 'Vui lòng cung cấp đầy đủ thông tin bắt buộc' });
		}
		const updatedTour_Guides = await Tour_Guides.updateTour_Guides(id,user_id, experience_years, language);
		if (!updatedTour_Guides){
			return res.status(404).send({ message: 'Tour_Guides not found' });
		}
		res.status(200).send({ message: 'Cập nhật Tour_Guides thành công', updatedTour_Guides });
	} catch (error) {
		res.status(500).send({ message: 'Lỗi server', error: error.message });
	};
};

exports.deleteTour_Guides = async (req, res) => {
	try {
		const { id } = req.query;
		const deletedTour_Guides = await Tour_Guides.deleteTour_Guides(id);
		if (!deletedTour_Guides)
		{
			return res.status(404).send({message: 'Tour_Guides not found' });
		}
		res.status(200).send({ message: 'Xóa Tour_Guides  thành công', deletedTour_Guides });
	} catch (error) {
		res.status(500).send({ message: 'Lỗi server', error: error.message });
	};
};

