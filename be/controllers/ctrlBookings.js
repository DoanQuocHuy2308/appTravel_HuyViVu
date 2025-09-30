const Bookings = require('../models/bookings')

exports.getAllBookings = async (req,res) => {
	try{

		const bookings = await Bookings.getAllBookings();
		res.status(200).send(bookings);
	} catch (error) {

		res.status(500).send({ message: error.message });
	};
};

exports.getBookingsById = async (req, res) =>{
	try{

		const bookings = await Bookings.getBookingsById(req.query.id);
		if (!bookings) return res.status(404).send({ message: 'bookings không tìm thấy' });
		res.status(200).send(bookings);
	} catch (error) {

		res.status(500).send({ message: error.message });
	};
};

exports.createBookings = async (req, res) => {
	try {
		const { user_id, tour_id, adults, children, infants, notes, booking_date, start_date, end_date, total_price, status } = req.body;
		if (!user_id || !tour_id || !adults || !children || !infants || !notes || !booking_date || !start_date || !end_date || !total_price || !status) {
			return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin bắt buộc' });
		}
		const bookingsId = await Bookings.createBookings( user_id, tour_id, adults, children, infants, notes, booking_date, start_date, end_date, total_price, status );
		res.status(201).send({ message: 'Tạo thành công', bookingsId });
	} catch (error) {
		res.status(500).send({ message: 'Lỗi server', error: error.message });
	};
};

exports.updateBookings = async (req, res) => {
	try {
		const { id } = req.query;
		const { user_id, tour_id, adults, children, infants, notes, booking_date, start_date, end_date, total_price, status } = req.body;
		if (!user_id ||!tour_id ||!adults ||!children ||!infants ||!notes ||!booking_date ||!start_date ||!end_date ||!total_price ||!status) {
			return res.status(400).send({ message: 'Vui lòng cung cấp đầy đủ thông tin bắt buộc' });
		}
		const updatedBookings = await Bookings.updateBookings(id,user_id, tour_id, adults, children, infants, notes, booking_date, start_date, end_date, total_price, status);
		if (!updatedBookings){
			return res.status(404).send({ message: 'Bookings not found' });
		}
		res.status(200).send({ message: 'Cập nhật Bookings thành công', updatedBookings });
	} catch (error) {
		res.status(500).send({ message: 'Lỗi server', error: error.message });
	};
};

exports.deleteBookings = async (req, res) => {
	try {
		const { id } = req.query;
		const deletedBookings = await Bookings.deleteBookings(id);
		if (!deletedBookings)
		{
			return res.status(404).send({message: 'Bookings not found' });
		}
		res.status(200).send({ message: 'Xóa Bookings  thành công', deletedBookings });
	} catch (error) {
		res.status(500).send({ message: 'Lỗi server', error: error.message });
	};
};

