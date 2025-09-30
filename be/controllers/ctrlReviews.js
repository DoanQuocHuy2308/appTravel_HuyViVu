const Reviews = require('../models/reviews')

exports.getAllReviews = async (req,res) => {
	try{

		const reviews = await Reviews.getAllReviews();
		res.status(200).send(reviews);
	} catch (error) {

		res.status(500).send({ message: error.message });
	};
};

exports.getReviewsById = async (req, res) =>{
	try{

		const reviews = await Reviews.getReviewsById(req.query.id);
		if (!reviews) return res.status(404).send({ message: 'reviews không tìm thấy' });
		res.status(200).send(reviews);
	} catch (error) {

		res.status(500).send({ message: error.message });
	};
};

exports.createReviews = async (req, res) => {
	try {
		const { user_id, tour_id, rating, comment, image } = req.body;
		if (!user_id || !tour_id || !rating || !comment || !image) {
			return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin bắt buộc' });
		}
		const reviewsId = await Reviews.createReviews( user_id, tour_id, rating, comment, image );
		res.status(201).send({ message: 'Tạo thành công', reviewsId });
	} catch (error) {
		res.status(500).send({ message: 'Lỗi server', error: error.message });
	};
};

exports.updateReviews = async (req, res) => {
	try {
		const { id } = req.query;
		const { user_id, tour_id, rating, comment, image } = req.body;
		if (!user_id ||!tour_id ||!rating ||!comment ||!image) {
			return res.status(400).send({ message: 'Vui lòng cung cấp đầy đủ thông tin bắt buộc' });
		}
		const updatedReviews = await Reviews.updateReviews(id,user_id, tour_id, rating, comment, image);
		if (!updatedReviews){
			return res.status(404).send({ message: 'Reviews not found' });
		}
		res.status(200).send({ message: 'Cập nhật Reviews thành công', updatedReviews });
	} catch (error) {
		res.status(500).send({ message: 'Lỗi server', error: error.message });
	};
};

exports.deleteReviews = async (req, res) => {
	try {
		const { id } = req.query;
		const deletedReviews = await Reviews.deleteReviews(id);
		if (!deletedReviews)
		{
			return res.status(404).send({message: 'Reviews not found' });
		}
		res.status(200).send({ message: 'Xóa Reviews  thành công', deletedReviews });
	} catch (error) {
		res.status(500).send({ message: 'Lỗi server', error: error.message });
	};
};

