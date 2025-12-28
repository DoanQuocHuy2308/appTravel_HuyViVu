const Tours = require('../models/tours')
const Image_Tour = require('../models/image_tour')
const Image = require('../utils/file')

// Function to convert ISO date to MySQL format
const convertToMySQLDate = (isoDate) => {
    if (!isoDate) return null;
    const date = new Date(isoDate);
    return date.toISOString().slice(0, 19).replace('T', ' ');
};

exports.getAllTours = async (req,res) => {
	try{

		const tours = await Tours.getAllTours();
		res.status(200).send(tours);
	} catch (error) {

		res.status(500).send({ message: error.message });
	};
};

exports.getToursById = async (req, res) =>{
	try{

		const tours = await Tours.getToursById(req.query.id);
		if (!tours) return res.status(404).send({ message: 'tours không tìm thấy' });
		res.status(200).send(tours);
	} catch (error) {

		res.status(500).send({ message: error.message });
	};
};

exports.getAllTourByTime = async (req, res) => {

	try {
		const tours = await Tours.getAllTourByTime();
		res.status(200).send(tours);
	} catch (error) {
		res.status(500).send({ message: error.message });
	};
};

exports.getAllTourByTransportation = async (req, res) => {

	try {
		const tours = await Tours.getAllTourByTransportation();
		res.status(200).send(tours);
	} catch (error) {
		res.status(500).send({ message: error.message });
	};
};

exports.createTours = async (req, res) => {
	try {
		const { name, tour_type_id, start_location_id, end_location_id, location_id, description, locations, max_customers, duration_days, start_date, end_date, guide_id, ideal_time, transportation, suitable_for, point } = req.body;
		if (!name || !tour_type_id || !start_location_id || !end_location_id || !location_id || !description || !locations || !max_customers || !duration_days || !start_date || !guide_id || !ideal_time || !transportation || !suitable_for || !point) {
			return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin bắt buộc' });
		}
		
		// Convert date to MySQL format
		const formattedStartDate = convertToMySQLDate(start_date);
		const formattedEndDate = convertToMySQLDate(end_date);
		const toursId = await Tours.createTours( name, tour_type_id, start_location_id, end_location_id, location_id, description, locations, max_customers, duration_days, formattedStartDate, formattedEndDate, guide_id, ideal_time, transportation, suitable_for, point );
		if (req.files && req.files.length > 0) {
			try {
				const imagePaths = req.files.map(file => '/public/images/' + file.filename);
			
				await Image_Tour.createMultipleImage_Tour(toursId, imagePaths);
			} catch (imageError) {
				console.error('Lỗi khi lưu ảnh:', imageError);
			}
		}
		
		res.status(201).send({ message: 'Tạo thành công', toursId });
	} catch (error) {
		res.status(500).send({ message: 'Lỗi server', error: error.message });
	};
};

exports.updateTours = async (req, res) => {
	try {
		const { id } = req.query;
		const { name, tour_type_id, start_location_id, end_location_id, location_id, description, locations, max_customers, duration_days, start_date, end_date, guide_id, ideal_time, transportation, suitable_for, point } = req.body;
		if (!name ||!tour_type_id ||!start_location_id ||!end_location_id ||!location_id ||!description ||!locations ||!max_customers ||!duration_days ||!start_date ||!guide_id ||!ideal_time ||!transportation ||!suitable_for ||!point) {
			return res.status(400).send({ message: 'Vui lòng cung cấp đầy đủ thông tin bắt buộc' });
		}
		
		// Convert date to MySQL format
		const formattedStartDate = convertToMySQLDate(start_date);
		const formattedEndDate = convertToMySQLDate(end_date);
		const updatedTours = await Tours.updateTours(id,name, tour_type_id, start_location_id, end_location_id, location_id, description, locations, max_customers, duration_days, formattedStartDate, formattedEndDate, guide_id, ideal_time, transportation, suitable_for, point);
		if (!updatedTours){
			return res.status(404).send({ message: 'Tours not found' });
		}
		
		// Handle image uploads if any
		if (req.files && req.files.length > 0) {
			try {
				const imagePaths = req.files.map(file => '/public/images/' + file.filename);
				await Image_Tour.createMultipleImage_Tour(id, imagePaths);
			} catch (imageError) {
				console.error('Lỗi khi cập nhật ảnh:', imageError);
			}
		}
		
		res.status(200).send({ message: 'Cập nhật Tours thành công', updatedTours });
	} catch (error) {
		res.status(500).send({ message: 'Lỗi server', error: error.message });
	};
};

exports.deleteTours = async (req, res) => {
	try {
		const { id } = req.query;
		
		// Validate ID
		if (!id || isNaN(parseInt(id))) {
			return res.status(400).send({ message: 'ID không hợp lệ' });
		}
		const deletedImages = await Image_Tour.deleteImage_TourByIdTour(id);
		if (deletedImages && deletedImages.length > 0) {
			deletedImages.forEach(image => {
				try {
					Image.deleteFile(image.image);
					console.log('Deleted file:', image.image);
				} catch (fileError) {
					console.error('Error deleting file:', fileError);
				}
			});
		}
		
		// Delete the tour
		const deletedTours = await Tours.deleteTours(id);
		console.log('Delete tour result:', deletedTours);
		
		if (!deletedTours) {
			return res.status(404).send({message: 'Không tìm thấy tour để xóa' });
		}
		
		res.status(200).send({ message: 'Xóa Tours thành công', deletedTours });
	} catch (error) {
		console.error('Delete Tours Error:', error);
		res.status(500).send({ message: 'Lỗi server', error: error.message });
	};
};

