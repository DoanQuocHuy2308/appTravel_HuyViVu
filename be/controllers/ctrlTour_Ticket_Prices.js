const Tour_Ticket_Prices = require('../models/tour_ticket_prices')

exports.getAllTour_Ticket_Prices = async (req,res) => {
	try{

		const tour_ticket_prices = await Tour_Ticket_Prices.getAllTour_Ticket_Prices();
		res.status(200).send(tour_ticket_prices);
	} catch (error) {

		res.status(500).send({ message: error.message });
	};
};

exports.getTour_Ticket_PricesById = async (req, res) =>{
	try{

		const tour_ticket_prices = await Tour_Ticket_Prices.getTour_Ticket_PricesById(req.query.id);
		if (!tour_ticket_prices) return res.status(404).send({ message: 'tour_ticket_prices không tìm thấy' });
		res.status(200).send(tour_ticket_prices);
	} catch (error) {

		res.status(500).send({ message: error.message });
	};
};

exports.createTour_Ticket_Prices = async (req, res) => {
	try {
		const { tour_id, customer_type, start_date, end_date, old_price, price } = req.body;
		if (!tour_id || !customer_type || !price) {
			return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin bắt buộc (tour_id, customer_type, price)' });
		}
		const tour_ticket_pricesId = await Tour_Ticket_Prices.createTour_Ticket_Prices( tour_id, customer_type, start_date, end_date, old_price || null, price );
		res.status(201).send({ message: 'Tạo thành công', tour_ticket_pricesId });
	} catch (error) {
		res.status(500).send({ message: 'Lỗi server', error: error.message });
	};
};

exports.updateTour_Ticket_Prices = async (req, res) => {
	try {
		const { id } = req.query;
		const { tour_id, customer_type, start_date, end_date, old_price, price } = req.body;
		if (!tour_id || !customer_type || !price) {
			return res.status(400).send({ message: 'Vui lòng cung cấp đầy đủ thông tin bắt buộc (tour_id, customer_type, price)' });
		}
		const updatedTour_Ticket_Prices = await Tour_Ticket_Prices.updateTour_Ticket_Prices(id, tour_id, customer_type, start_date, end_date, old_price || null, price);
		if (!updatedTour_Ticket_Prices){
			return res.status(404).send({ message: 'Tour_Ticket_Prices not found' });
		}
		const updatedData = await Tour_Ticket_Prices.getTour_Ticket_PricesById(id);
		res.status(200).send(updatedData);
	} catch (error) {
		res.status(500).send({ message: 'Lỗi server', error: error.message });
	};
};

exports.deleteTour_Ticket_Prices = async (req, res) => {
	try {
		const { id } = req.query;
		const deletedTour_Ticket_Prices = await Tour_Ticket_Prices.deleteTour_Ticket_Prices(id);
		if (!deletedTour_Ticket_Prices)
		{
			return res.status(404).send({message: 'Tour_Ticket_Prices not found' });
		}
		res.status(200).send({ message: 'Xóa Tour_Ticket_Prices  thành công', deletedTour_Ticket_Prices });
	} catch (error) {
		res.status(500).send({ message: 'Lỗi server', error: error.message });
	};
};

