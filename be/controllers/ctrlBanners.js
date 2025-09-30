const Banners = require('../models/banners')

exports.getAllBanners = async (req,res) => {
	try{

		const banners = await Banners.getAllBanners();
		res.status(200).send(banners);
	} catch (error) {

		res.status(500).send({ message: error.message });
	};
};

exports.getBannersById = async (req, res) =>{
	try{

		const banners = await Banners.getBannersById(req.query.id);
		if (!banners) return res.status(404).send({ message: 'banners không tìm thấy' });
		res.status(200).send(banners);
	} catch (error) {

		res.status(500).send({ message: error.message });
	};
};

exports.createBanners = async (req, res) => {
	try {
		const { title, image, status } = req.body;
		if (!title || !image || !status) {
			return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin bắt buộc' });
		}
		const bannersId = await Banners.createBanners( title, image, status );
		res.status(201).send({ message: 'Tạo thành công', bannersId });
	} catch (error) {
		res.status(500).send({ message: 'Lỗi server', error: error.message });
	};
};

exports.updateBanners = async (req, res) => {
	try {
		const { id } = req.query;
		const { title, image, status } = req.body;
		if (!title ||!image ||!status) {
			return res.status(400).send({ message: 'Vui lòng cung cấp đầy đủ thông tin bắt buộc' });
		}
		const updatedBanners = await Banners.updateBanners(id,title, image, status);
		if (!updatedBanners){
			return res.status(404).send({ message: 'Banners not found' });
		}
		res.status(200).send({ message: 'Cập nhật Banners thành công', updatedBanners });
	} catch (error) {
		res.status(500).send({ message: 'Lỗi server', error: error.message });
	};
};

exports.deleteBanners = async (req, res) => {
	try {
		const { id } = req.query;
		const deletedBanners = await Banners.deleteBanners(id);
		if (!deletedBanners)
		{
			return res.status(404).send({message: 'Banners not found' });
		}
		res.status(200).send({ message: 'Xóa Banners  thành công', deletedBanners });
	} catch (error) {
		res.status(500).send({ message: 'Lỗi server', error: error.message });
	};
};

