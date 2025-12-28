const Category_Service = require('../models/category_service')

exports.getAllCategory_Service = async (req,res) => {
	try{

		const category_service = await Category_Service.getAllCategory_Service();
		res.status(200).send(category_service);
	} catch (error) {

		res.status(500).send({ message: error.message });
	};
};

exports.getCategory_ServiceById = async (req, res) =>{
	try{

		const category_service = await Category_Service.getCategory_ServiceById(req.query.id);
		if (!category_service) return res.status(404).send({ message: 'category_service không tìm thấy' });
		res.status(200).send(category_service);
	} catch (error) {

		res.status(500).send({ message: error.message });
	};
};

exports.createCategory_Service = async (req, res) => {
	try {
		const { name, description } = req.body;
		if (!name || !description) {
			return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin bắt buộc' });
		}
		const category_serviceId = await Category_Service.createCategory_Service( name, description );
		res.status(201).send({ message: 'Tạo thành công', category_serviceId });
	} catch (error) {
		res.status(500).send({ message: 'Lỗi server', error: error.message });
	};
};

exports.updateCategory_Service = async (req, res) => {
	try {
		const { id } = req.query;
		const { name, description } = req.body;
		if (!name ||!description) {
			return res.status(400).send({ message: 'Vui lòng cung cấp đầy đủ thông tin bắt buộc' });
		}
		const updatedCategory_Service = await Category_Service.updateCategory_Service(id,name, description);
		if (!updatedCategory_Service){
			return res.status(404).send({ message: 'Category_Service not found' });
		}
		res.status(200).send({ message: 'Cập nhật Category_Service thành công', updatedCategory_Service });
	} catch (error) {
		res.status(500).send({ message: 'Lỗi server', error: error.message });
	};
};

exports.deleteCategory_Service = async (req, res) => {
	try {
		const { id } = req.query;
		const deletedCategory_Service = await Category_Service.deleteCategory_Service(id);
		if (!deletedCategory_Service)
		{
			return res.status(404).send({message: 'Category_Service not found' });
		}
		res.status(200).send({ message: 'Xóa Category_Service  thành công', deletedCategory_Service });
	} catch (error) {
		res.status(500).send({ message: 'Lỗi server', error: error.message });
	};
};

