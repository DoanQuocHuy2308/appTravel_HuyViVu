const Regions = require('../models/regions')

exports.getAllRegions = async (req,res) => {
	try{

		const regions = await Regions.getAllRegions();
		res.status(200).send(regions);
	} catch (error) {

		res.status(500).send({ message: error.message });
	};
};

exports.getRegionsById = async (req, res) =>{
	try{

		const regions = await Regions.getRegionsById(req.query.id);
		if (!regions) return res.status(404).send({ message: 'regions không tìm thấy' });
		res.status(200).send(regions);
	} catch (error) {

		res.status(500).send({ message: error.message });
	};
};

exports.createRegions = async (req, res) => {
	try {
		const { name, description } = req.body;
		if (!name || !description) {
			return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin bắt buộc' });
		}
		const regionsId = await Regions.createRegions( name, description );
		res.status(201).send({ message: 'Tạo thành công', regionsId });
	} catch (error) {
		res.status(500).send({ message: 'Lỗi server', error: error.message });
	};
};

exports.updateRegions = async (req, res) => {
	try {
		const { id } = req.query;
		const { name, description } = req.body;
		if (!name ||!description) {
			return res.status(400).send({ message: 'Vui lòng cung cấp đầy đủ thông tin bắt buộc' });
		}
		const updatedRegions = await Regions.updateRegions(id,name, description);
		if (!updatedRegions){
			return res.status(404).send({ message: 'Regions not found' });
		}
		res.status(200).send({ message: 'Cập nhật Regions thành công', updatedRegions });
	} catch (error) {
		res.status(500).send({ message: 'Lỗi server', error: error.message });
	};
};

exports.deleteRegions = async (req, res) => {
	try {
		const { id } = req.query;
		const deletedRegions = await Regions.deleteRegions(id);
		if (!deletedRegions)
		{
			return res.status(404).send({message: 'Regions not found' });
		}
		res.status(200).send({ message: 'Xóa Regions  thành công', deletedRegions });
	} catch (error) {
		res.status(500).send({ message: 'Lỗi server', error: error.message });
	};
};

