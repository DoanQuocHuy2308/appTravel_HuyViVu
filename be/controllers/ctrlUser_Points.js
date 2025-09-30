const User_Points = require('../models/user_points')

exports.getAllUser_Points = async (req,res) => {
	try{

		const user_points = await User_Points.getAllUser_Points();
		res.status(200).send(user_points);
	} catch (error) {

		res.status(500).send({ message: error.message });
	};
};

exports.getUser_PointsById = async (req, res) =>{
	try{

		const user_points = await User_Points.getUser_PointsById(req.query.id);
		if (!user_points) return res.status(404).send({ message: 'user_points không tìm thấy' });
		res.status(200).send(user_points);
	} catch (error) {

		res.status(500).send({ message: error.message });
	};
};

exports.createUser_Points = async (req, res) => {
	try {
		const { user_id, booking_id, points_change, reason } = req.body;
		if (!user_id || !booking_id || !points_change || !reason) {
			return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin bắt buộc' });
		}
		const user_pointsId = await User_Points.createUser_Points( user_id, booking_id, points_change, reason );
		res.status(201).send({ message: 'Tạo thành công', user_pointsId });
	} catch (error) {
		res.status(500).send({ message: 'Lỗi server', error: error.message });
	};
};

exports.updateUser_Points = async (req, res) => {
	try {
		const { id } = req.query;
		const { user_id, booking_id, points_change, reason } = req.body;
		if (!user_id ||!booking_id ||!points_change ||!reason) {
			return res.status(400).send({ message: 'Vui lòng cung cấp đầy đủ thông tin bắt buộc' });
		}
		const updatedUser_Points = await User_Points.updateUser_Points(id,user_id, booking_id, points_change, reason);
		if (!updatedUser_Points){
			return res.status(404).send({ message: 'User_Points not found' });
		}
		res.status(200).send({ message: 'Cập nhật User_Points thành công', updatedUser_Points });
	} catch (error) {
		res.status(500).send({ message: 'Lỗi server', error: error.message });
	};
};

exports.deleteUser_Points = async (req, res) => {
	try {
		const { id } = req.query;
		const deletedUser_Points = await User_Points.deleteUser_Points(id);
		if (!deletedUser_Points)
		{
			return res.status(404).send({message: 'User_Points not found' });
		}
		res.status(200).send({ message: 'Xóa User_Points  thành công', deletedUser_Points });
	} catch (error) {
		res.status(500).send({ message: 'Lỗi server', error: error.message });
	};
};

