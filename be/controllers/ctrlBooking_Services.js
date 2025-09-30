const Booking_Services = require('../models/booking_services')

exports.getAllBooking_Services = async (req,res) => {
	try{

		const booking_services = await Booking_Services.getAllBooking_Services();
		res.status(200).send(booking_services);
	} catch (error) {

		res.status(500).send({ message: error.message });
	};
};

exports.getBooking_ServicesById = async (req, res) =>{
	try{

		const booking_services = await Booking_Services.getBooking_ServicesById(req.query.id);
		if (!booking_services) return res.status(404).send({ message: 'booking_services không tìm thấy' });
		res.status(200).send(booking_services);
	} catch (error) {

		res.status(500).send({ message: error.message });
	};
};

exports.createBooking_Services = async (req, res) => {
	try {
		const { user_id, service_id, quantity, price, location, booking_date } = req.body;
		if (!user_id || !service_id || !quantity || !price || !location || !booking_date) {
			return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin bắt buộc' });
		}
		const booking_servicesId = await Booking_Services.createBooking_Services( user_id, service_id, quantity, price, location, booking_date );
		res.status(201).send({ message: 'Tạo thành công', booking_servicesId });
	} catch (error) {
		res.status(500).send({ message: 'Lỗi server', error: error.message });
	};
};

exports.updateBooking_Services = async (req, res) => {
	try {
		const { id } = req.query;
		const { user_id, service_id, quantity, price, location, booking_date } = req.body;
		if (!user_id ||!service_id ||!quantity ||!price ||!location ||!booking_date) {
			return res.status(400).send({ message: 'Vui lòng cung cấp đầy đủ thông tin bắt buộc' });
		}
		const updatedBooking_Services = await Booking_Services.updateBooking_Services(id,user_id, service_id, quantity, price, location, booking_date);
		if (!updatedBooking_Services){
			return res.status(404).send({ message: 'Booking_Services not found' });
		}
		res.status(200).send({ message: 'Cập nhật Booking_Services thành công', updatedBooking_Services });
	} catch (error) {
		res.status(500).send({ message: 'Lỗi server', error: error.message });
	};
};

exports.deleteBooking_Services = async (req, res) => {
	try {
		const { id } = req.query;
		const deletedBooking_Services = await Booking_Services.deleteBooking_Services(id);
		if (!deletedBooking_Services)
		{
			return res.status(404).send({message: 'Booking_Services not found' });
		}
		res.status(200).send({ message: 'Xóa Booking_Services  thành công', deletedBooking_Services });
	} catch (error) {
		res.status(500).send({ message: 'Lỗi server', error: error.message });
	};
};

