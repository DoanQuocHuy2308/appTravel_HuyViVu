const Image_Tour = require('../models/image_tour')

exports.getAllImage_Tour = async (req,res) => {
	try{

		const image_tour = await Image_Tour.getAllImage_Tour();
		res.status(200).send(image_tour);
	} catch (error) {

		res.status(500).send({ message: error.message });
	};
};

exports.getImage_TourById = async (req, res) =>{
	try{

		const image_tour = await Image_Tour.getImage_TourById(req.query.id);
		if (!image_tour) return res.status(404).send({ message: 'image_tour không tìm thấy' });
		res.status(200).send(image_tour);
	} catch (error) {

		res.status(500).send({ message: error.message });
	};
};

exports.createImage_Tour = async (req, res) => {
	try {
		const { tour_id, image } = req.body;
		if (!tour_id || !image) {
			return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin bắt buộc' });
		}
		const image_tourId = await Image_Tour.createImage_Tour( tour_id, image );
		res.status(201).send({ message: 'Tạo thành công', image_tourId });
	} catch (error) {
		res.status(500).send({ message: 'Lỗi server', error: error.message });
	};
};

exports.updateImage_Tour = async (req, res) => {
	try {
		const { id } = req.query;
		const { tour_id, image } = req.body;
		if (!tour_id ||!image) {
			return res.status(400).send({ message: 'Vui lòng cung cấp đầy đủ thông tin bắt buộc' });
		}
		const updatedImage_Tour = await Image_Tour.updateImage_Tour(id,tour_id, image);
		if (!updatedImage_Tour){
			return res.status(404).send({ message: 'Image_Tour not found' });
		}
		res.status(200).send({ message: 'Cập nhật Image_Tour thành công', updatedImage_Tour });
	} catch (error) {
		res.status(500).send({ message: 'Lỗi server', error: error.message });
	};
};

exports.deleteImage_Tour = async (req, res) => {
	try {
		const { id } = req.query;
		const deletedImage_Tour = await Image_Tour.deleteImage_Tour(id);
		if (!deletedImage_Tour)
		{
			return res.status(404).send({message: 'Image_Tour not found' });
		}
		res.status(200).send({ message: 'Xóa Image_Tour  thành công', deletedImage_Tour });
	} catch (error) {
		res.status(500).send({ message: 'Lỗi server', error: error.message });
	};
};

