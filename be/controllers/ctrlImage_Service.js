const Image_Service = require('../models/image_service')

exports.getAllImage_Service = async (req,res) => {
	try{

		const image_service = await Image_Service.getAllImage_Service();
		res.status(200).send(image_service);
	} catch (error) {

		res.status(500).send({ message: error.message });
	};
};

exports.getImage_ServiceById = async (req, res) =>{
	try{

		const image_service = await Image_Service.getImage_ServiceById(req.query.id);
		if (!image_service) return res.status(404).send({ message: 'image_service không tìm thấy' });
		res.status(200).send(image_service);
	} catch (error) {

		res.status(500).send({ message: error.message });
	};
};

exports.createImage_Service = async (req, res) => {
	try {
		const { service_id, image } = req.body;
		if (!service_id || !image) {
			return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin bắt buộc' });
		}
		const image_serviceId = await Image_Service.createImage_Service( service_id, image );
		res.status(201).send({ message: 'Tạo thành công', image_serviceId });
	} catch (error) {
		res.status(500).send({ message: 'Lỗi server', error: error.message });
	};
};

exports.updateImage_Service = async (req, res) => {
	try {
		const { id } = req.query;
		const { service_id, image } = req.body;
		if (!service_id ||!image) {
			return res.status(400).send({ message: 'Vui lòng cung cấp đầy đủ thông tin bắt buộc' });
		}
		const updatedImage_Service = await Image_Service.updateImage_Service(id,service_id, image);
		if (!updatedImage_Service){
			return res.status(404).send({ message: 'Image_Service not found' });
		}
		res.status(200).send({ message: 'Cập nhật Image_Service thành công', updatedImage_Service });
	} catch (error) {
		res.status(500).send({ message: 'Lỗi server', error: error.message });
	};
};

exports.deleteImage_Service = async (req, res) => {
	try {
		const { id } = req.query;
		const deletedImage_Service = await Image_Service.deleteImage_Service(id);
		if (!deletedImage_Service)
		{
			return res.status(404).send({message: 'Image_Service not found' });
		}
		res.status(200).send({ message: 'Xóa Image_Service  thành công', deletedImage_Service });
	} catch (error) {
		res.status(500).send({ message: 'Lỗi server', error: error.message });
	};
};

