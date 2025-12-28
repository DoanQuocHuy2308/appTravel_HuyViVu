const Bookings = require('../models/bookings');

exports.getAllBookings = async (req, res) => {
	try {
		const bookings = await Bookings.getAllBookings();
		res.status(200).send(bookings);
	} catch (error) {
		res.status(500).send({ message: error.message });
	};
};

exports.getBookingsById = async (req, res) => {
	try {
		const bookings = await Bookings.getBookingsById(req.query.id);
		res.status(200).send(bookings);
	} catch (error) {
		res.status(500).send({ message: error.message });
	};
};

exports.booking = async (req, res) => {
	try {
		const { user_id, tour_id, adults, children, infants, start_date, end_date, notes, promotion_id } = req.body;
		if (!user_id || !tour_id || !adults || !start_date || !end_date) {
			return res.status(400).send({ 
				message: 'Missing required fields',
				details: {
					user_id: !user_id ? 'Required' : 'OK',
					tour_id: !tour_id ? 'Required' : 'OK',
					adults: !adults ? 'Required' : 'OK',
					start_date: !start_date ? 'Required' : 'OK',
					end_date: !end_date ? 'Required' : 'OK'
				}
			});
		}
		
		if (adults < 1) {
			return res.status(400).send({ message: 'At least 1 adult is required' });
		}
		
		// Ensure children and infants are numbers
		const childrenCount = children || 0;
		const infantsCount = infants || 0;
		
		const booking = await Bookings.booking(user_id, tour_id, adults, childrenCount, infantsCount, start_date, end_date, notes, promotion_id);
		res.status(200).send(booking);
	} catch (error) {
		res.status(500).send({ message: error.message });
	};
};
exports.updateBooking = async (req, res) => {
	try {
		const { id, adults, children, infants, notes, status, promotion_code } = req.body;
		console.log('Update booking request:', { id, adults, children, infants, notes, status, promotion_code });
		const booking = await Bookings.updateBooking(id, adults, children, infants, notes, status, promotion_code);
		res.status(200).send(booking);
	} catch (error) {
		console.error('Update booking error:', error);
		res.status(500).send({ message: error.message });
	};
};
exports.deleteBooking = async (req, res) => {
	try {
		const { id } = req.body;
		const booking = await Bookings.deleteBooking(id);
		res.status(200).send(booking);
	} catch (error) {
		res.status(500).send({ message: error.message });
	};
};
exports.getBookingsByUserId = async (req, res) => {
	try {
		const { user_id } = req.query;
		const bookings = await Bookings.getBookingsByUserId(user_id);
		res.status(200).send(bookings);
	} catch (error) {
		res.status(500).send({ message: error.message });
	};
};
exports.getBookingsByTourId = async (req, res) => {
	try {
		const { tour_id } = req.query;
		const bookings = await Bookings.getBookingsByTourId(tour_id);
		res.status(200).send(bookings);
	} catch (error) {
		res.status(500).send({ message: error.message });
	};
};
exports.getBookingsByStatus = async (req, res) => {
	try {
		const { status } = req.query;
		const bookings = await Bookings.getBookingsByStatus(status);
		res.status(200).send(bookings);
	} catch (error) {
		res.status(500).send({ message: error.message });
	};
};

exports.getBookingsByDateRange = async (req, res) => {
	try {
		const { start_date, end_date } = req.query;
		const bookings = await Bookings.getBookingsByDateRange(start_date, end_date);
		res.status(200).send(bookings);
	} catch (error) {
		res.status(500).send({ message: error.message });
	};
};