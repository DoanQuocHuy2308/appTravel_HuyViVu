const Locations = require('../models/locations')

exports.getAllLocations = async (req,res) => {
	try{

		const locations = await Locations.getAllLocations();
		res.status(200).send(locations);
	} catch (error) {

		res.status(500).send({ message: error.message });
	};
};

exports.getLocationsById = async (req, res) =>{
	try{

		const locations = await Locations.getLocationsById(req.query.id);
		if (!locations) return res.status(404).send({ message: 'locations không tìm thấy' });
		res.status(200).send(locations);
	} catch (error) {

		res.status(500).send({ message: error.message });
	};
};

exports.createLocations = async (req, res) => {
	try {
		const { name, description, city, country, image, region_id } = req.body;
		if (!name || !description || !city || !country || !image || !region_id) {
			return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin bắt buộc' });
		}
		const locationsId = await Locations.createLocations( name, description, city, country, image, region_id );
		res.status(201).send({ message: 'Tạo thành công', locationsId });
	} catch (error) {
		res.status(500).send({ message: 'Lỗi server', error: error.message });
	};
};

exports.updateLocations = async (req, res) => {
	try {
		const { id } = req.query;
		const { name, description, city, country, image, region_id } = req.body;
		if (!name ||!description ||!city ||!country ||!image ||!region_id) {
			return res.status(400).send({ message: 'Vui lòng cung cấp đầy đủ thông tin bắt buộc' });
		}
		const updatedLocations = await Locations.updateLocations(id,name, description, city, country, image, region_id);
		if (!updatedLocations){
			return res.status(404).send({ message: 'Locations not found' });
		}
		res.status(200).send({ message: 'Cập nhật Locations thành công', updatedLocations });
	} catch (error) {
		res.status(500).send({ message: 'Lỗi server', error: error.message });
	};
};

exports.deleteLocations = async (req, res) => {
	try {
		const { id } = req.query;
		const deletedLocations = await Locations.deleteLocations(id);
		if (!deletedLocations)
		{
			return res.status(404).send({message: 'Locations not found' });
		}
		res.status(200).send({ message: 'Xóa Locations  thành công', deletedLocations });
	} catch (error) {
		res.status(500).send({ message: 'Lỗi server', error: error.message });
	};
};

