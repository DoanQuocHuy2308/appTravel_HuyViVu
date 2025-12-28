const Image_Tour = require('../models/image_tour')
const Image = require('../middleware/upload');
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

exports.getImage_TourByIdTour = async (req, res) => {
	try {
		const image_tours = await Image_Tour.getImage_TourByIdTour(req.query.tour_id);
		res.status(200).send(image_tours);
	} catch (error) {
		res.status(500).send({ message: error.message });
	};
};

exports.createImage_Tour = async (req, res) => {
	try {
		const { tour_id} = req.body;
		if (!tour_id ) {
			return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin bắt buộc' });
		}
		const image =  req.file ? '/public/images/' + req.file.filename : null;
		if (!image) {
			return res.status(400).json({ message: 'Vui lòng cung cấp ảnh' });
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
		const { tour_id } = req.body;
		
		if (!tour_id) {
			return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin bắt buộc' });
		}
		
		// Lấy thông tin ảnh cũ
		const oldImage = await Image_Tour.getImage_TourById(id);
		if (!oldImage) {
			return res.status(404).json({ message: 'Image_Tour không tìm thấy' });
		}
		
		// Kiểm tra có ảnh mới không
		const image = req.file ? '/public/images/' + req.file.filename : null;
		if (!image) {
			return res.status(400).json({ message: 'Vui lòng cung cấp ảnh' });
		}
		if (oldImage.image) {
			Image.deleteFile(oldImage.image);
		}
		
		const image_tourId = await Image_Tour.updateImage_Tour(id, tour_id, image);
		res.status(200).send({ message: 'Cập nhật thành công', image_tourId });
	} catch (error) {
		res.status(500).send({ message: 'Lỗi server', error: error.message });
	};
};
exports.createMultipleImage_Tour = async (req, res) => {
	try {
		const { tour_id } = req.body;
		if (!tour_id) {
			return res.status(400).json({ message: 'Vui lòng cung cấp tour_id' });
		}
		
		if (!req.files || req.files.length === 0) {
			return res.status(400).json({ message: 'Vui lòng cung cấp ít nhất một ảnh' });
		}
		
		const imagePaths = req.files.map(file => '/public/images/' + file.filename);
		
		const image_tourId = await Image_Tour.createMultipleImage_Tour(tour_id, imagePaths);
		res.status(201).send({ message: 'Tạo thành công', image_tourId });
	} catch (error) {
		res.status(500).send({ message: 'Lỗi server', error: error.message });
	};
};

exports.deleteImage_Tour = async (req, res) => {
	try {
		const { id } = req.query;
		
		const oldImage = await Image_Tour.getImage_TourById(id);
		if (!oldImage) {
			return res.status(404).json({ message: 'Image_Tour không tìm thấy' });
		}
		
		if (oldImage.image) {
			Image.deleteFile(oldImage.image);
		}
		
		const image_tourId = await Image_Tour.deleteImage_Tour(id);
		res.status(200).send({ message: 'Xóa thành công', image_tourId });
	} catch (error) {
		res.status(500).send({ message: 'Lỗi server', error: error.message });
	};
};