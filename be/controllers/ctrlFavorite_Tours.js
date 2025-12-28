const Favorite_Tours = require('../models/favorite_tours')

exports.getAllFavorite_Tours = async (req,res) => {
	try{
		const {id} = req.query;
		const favorite_tours = await Favorite_Tours.getAllFavorite_Tours(id);
		res.status(200).send(favorite_tours);
	} catch (error) {

		res.status(500).send({ message: error.message });
	};
};

exports.getFavorite_ToursById = async (req, res) =>{
	try{

		const favorite_tours = await Favorite_Tours.getFavorite_ToursById(req.query.id);
		if (!favorite_tours) return res.status(404).send({ message: 'favorite_tours không tìm thấy' });
		res.status(200).send(favorite_tours);
	} catch (error) {

		res.status(500).send({ message: error.message });
	};
};

exports.createFavorite_Tours = async (req, res) => {
	try {
		const { user_id, tour_id } = req.body;
		if (!user_id || !tour_id) {
			return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin bắt buộc' });
		}
		const favorite_toursId = await Favorite_Tours.createFavorite_Tours( user_id, tour_id );
		res.status(201).send({ message: 'Tạo thành công', favorite_toursId });
	} catch (error) {
		res.status(500).send({ message: 'Lỗi server', error: error.message });
	};
};

exports.updateFavorite_Tours = async (req, res) => {
	try {
		const { id } = req.query;
		const { user_id, tour_id } = req.body;
		if (!user_id ||!tour_id) {
			return res.status(400).send({ message: 'Vui lòng cung cấp đầy đủ thông tin bắt buộc' });
		}
		const updatedFavorite_Tours = await Favorite_Tours.updateFavorite_Tours(id,user_id, tour_id);
		if (!updatedFavorite_Tours){
			return res.status(404).send({ message: 'Favorite_Tours not found' });
		}
		res.status(200).send({ message: 'Cập nhật Favorite_Tours thành công', updatedFavorite_Tours });
	} catch (error) {
		res.status(500).send({ message: 'Lỗi server', error: error.message });
	};
};

exports.deleteFavorite_Tours = async (req, res) => {
	try {
		const { id } = req.query;
		const deletedFavorite_Tours = await Favorite_Tours.deleteFavorite_Tours(id);
		if (!deletedFavorite_Tours)
		{
			return res.status(404).send({message: 'Favorite_Tours not found' });
		}
		res.status(200).send({ message: 'Xóa Favorite_Tours  thành công', deletedFavorite_Tours });
	} catch (error) {
		res.status(500).send({ message: 'Lỗi server', error: error.message });
	};
};

