const Ticket_Prices = require('../models/ticket_prices')

exports.getAllTicket_Prices = async (req,res) => {
	try{

		const ticket_prices = await Ticket_Prices.getAllTicket_Prices();
		res.status(200).send(ticket_prices);
	} catch (error) {

		res.status(500).send({ message: error.message });
	};
};

exports.getTicket_PricesById = async (req, res) =>{
	try{

		const ticket_prices = await Ticket_Prices.getTicket_PricesById(req.query.id);
		if (!ticket_prices) return res.status(404).send({ message: 'ticket_prices không tìm thấy' });
		res.status(200).send(ticket_prices);
	} catch (error) {

		res.status(500).send({ message: error.message });
	};
};

exports.createTicket_Prices = async (req, res) => {
	try {
		const { tour_id, customer_type, price } = req.body;
		if (!tour_id || !customer_type || !price) {
			return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin bắt buộc' });
		}
		const ticket_pricesId = await Ticket_Prices.createTicket_Prices( tour_id, customer_type, price );
		res.status(201).send({ message: 'Tạo thành công', ticket_pricesId });
	} catch (error) {
		res.status(500).send({ message: 'Lỗi server', error: error.message });
	};
};

exports.updateTicket_Prices = async (req, res) => {
	try {
		const { id } = req.query;
		const { tour_id, customer_type, price } = req.body;
		if (!tour_id ||!customer_type ||!price) {
			return res.status(400).send({ message: 'Vui lòng cung cấp đầy đủ thông tin bắt buộc' });
		}
		const updatedTicket_Prices = await Ticket_Prices.updateTicket_Prices(id,tour_id, customer_type, price);
		if (!updatedTicket_Prices){
			return res.status(404).send({ message: 'Ticket_Prices not found' });
		}
		res.status(200).send({ message: 'Cập nhật Ticket_Prices thành công', updatedTicket_Prices });
	} catch (error) {
		res.status(500).send({ message: 'Lỗi server', error: error.message });
	};
};

exports.deleteTicket_Prices = async (req, res) => {
	try {
		const { id } = req.query;
		const deletedTicket_Prices = await Ticket_Prices.deleteTicket_Prices(id);
		if (!deletedTicket_Prices)
		{
			return res.status(404).send({message: 'Ticket_Prices not found' });
		}
		res.status(200).send({ message: 'Xóa Ticket_Prices  thành công', deletedTicket_Prices });
	} catch (error) {
		res.status(500).send({ message: 'Lỗi server', error: error.message });
	};
};

