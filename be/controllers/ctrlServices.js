const Services = require('../models/services')

exports.getAllServices = async (req,res) => {
	try{

		const services = await Services.getAllServices();
		res.status(200).send(services);
	} catch (error) {

		res.status(500).send({ message: error.message });
	};
};

exports.getServicesById = async (req, res) =>{
	try{

		const services = await Services.getServicesById(req.query.id);
		if (!services) return res.status(404).send({ message: 'services không tìm thấy' });
		res.status(200).send(services);
	} catch (error) {

		res.status(500).send({ message: error.message });
	};
};

exports.createServices = async (req, res) => {
	try {
		const { category_id, name, description, price } = req.body;
		if (!category_id || !name || !description || !price) {
			return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin bắt buộc' });
		}
		const servicesId = await Services.createServices( category_id, name, description, price );
		res.status(201).send({ message: 'Tạo thành công', servicesId });
	} catch (error) {
		res.status(500).send({ message: 'Lỗi server', error: error.message });
	};
};

exports.updateServices = async (req, res) => {
	try {
		const { id } = req.query;
		const { category_id, name, description, price } = req.body;
		if (!category_id ||!name ||!description ||!price) {
			return res.status(400).send({ message: 'Vui lòng cung cấp đầy đủ thông tin bắt buộc' });
		}
		const updatedServices = await Services.updateServices(id,category_id, name, description, price);
		if (!updatedServices){
			return res.status(404).send({ message: 'Services not found' });
		}
		res.status(200).send({ message: 'Cập nhật Services thành công', updatedServices });
	} catch (error) {
		res.status(500).send({ message: 'Lỗi server', error: error.message });
	};
};

exports.deleteServices = async (req, res) => {
	try {
		const { id } = req.query;
		const deletedServices = await Services.deleteServices(id);
		if (!deletedServices)
		{
			return res.status(404).send({message: 'Services not found' });
		}
		res.status(200).send({ message: 'Xóa Services  thành công', deletedServices });
	} catch (error) {
		res.status(500).send({ message: 'Lỗi server', error: error.message });
	};
};

