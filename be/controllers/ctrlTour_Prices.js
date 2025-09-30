const Tour_Prices = require('../models/tour_prices')

exports.getAllTour_Prices = async (req,res) => {
	try{

		const tour_prices = await Tour_Prices.getAllTour_Prices();
		res.status(200).send(tour_prices);
	} catch (error) {

		res.status(500).send({ message: error.message });
	};
};

exports.getTour_PricesById = async (req, res) =>{
	try{

		const tour_prices = await Tour_Prices.getTour_PricesById(req.query.id);
		if (!tour_prices) return res.status(404).send({ message: 'tour_prices không tìm thấy' });
		res.status(200).send(tour_prices);
	} catch (error) {

		res.status(500).send({ message: error.message });
	};
};

exports.createTour_Prices = async (req, res) => {
	try {
		const { tour_id, start_date, end_date, price } = req.body;
		if (!tour_id || !start_date || !end_date || !price) {
			return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin bắt buộc' });
		}
		const tour_pricesId = await Tour_Prices.createTour_Prices( tour_id, start_date, end_date, price );
		res.status(201).send({ message: 'Tạo thành công', tour_pricesId });
	} catch (error) {
		res.status(500).send({ message: 'Lỗi server', error: error.message });
	};
};

exports.updateTour_Prices = async (req, res) => {
	try {
		const { id } = req.query;
		const { tour_id, start_date, end_date, price } = req.body;
		if (!tour_id ||!start_date ||!end_date ||!price) {
			return res.status(400).send({ message: 'Vui lòng cung cấp đầy đủ thông tin bắt buộc' });
		}
		const updatedTour_Prices = await Tour_Prices.updateTour_Prices(id,tour_id, start_date, end_date, price);
		if (!updatedTour_Prices){
			return res.status(404).send({ message: 'Tour_Prices not found' });
		}
		res.status(200).send({ message: 'Cập nhật Tour_Prices thành công', updatedTour_Prices });
	} catch (error) {
		res.status(500).send({ message: 'Lỗi server', error: error.message });
	};
};

exports.deleteTour_Prices = async (req, res) => {
	try {
		const { id } = req.query;
		const deletedTour_Prices = await Tour_Prices.deleteTour_Prices(id);
		if (!deletedTour_Prices)
		{
			return res.status(404).send({message: 'Tour_Prices not found' });
		}
		res.status(200).send({ message: 'Xóa Tour_Prices  thành công', deletedTour_Prices });
	} catch (error) {
		res.status(500).send({ message: 'Lỗi server', error: error.message });
	};
};

