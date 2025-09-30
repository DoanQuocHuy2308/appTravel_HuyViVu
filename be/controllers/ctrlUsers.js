const Users = require('../models/users')

exports.getAllUsers = async (req,res) => {
	try{

		const users = await Users.getAllUsers();
		res.status(200).send(users);
	} catch (error) {

		res.status(500).send({ message: error.message });
	};
};

exports.getUsersById = async (req, res) =>{
	try{

		const users = await Users.getUsersById(req.query.id);
		if (!users) return res.status(404).send({ message: 'users không tìm thấy' });
		res.status(200).send(users);
	} catch (error) {

		res.status(500).send({ message: error.message });
	};
};

exports.createUsers = async (req, res) => {
	try {
		const { name, email, password, phone, description, role, points, image } = req.body;
		if (!name || !email || !password || !phone || !description || !role || !points || !image) {
			return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin bắt buộc' });
		}
		const usersId = await Users.createUsers( name, email, password, phone, description, role, points, image );
		res.status(201).send({ message: 'Tạo thành công', usersId });
	} catch (error) {
		res.status(500).send({ message: 'Lỗi server', error: error.message });
	};
};

exports.updateUsers = async (req, res) => {
	try {
		const { id } = req.query;
		const { name, email, password, phone, description, role, points, image } = req.body;
		if (!name ||!email ||!password ||!phone ||!description ||!role ||!points ||!image) {
			return res.status(400).send({ message: 'Vui lòng cung cấp đầy đủ thông tin bắt buộc' });
		}
		const updatedUsers = await Users.updateUsers(id,name, email, password, phone, description, role, points, image);
		if (!updatedUsers){
			return res.status(404).send({ message: 'Users not found' });
		}
		res.status(200).send({ message: 'Cập nhật Users thành công', updatedUsers });
	} catch (error) {
		res.status(500).send({ message: 'Lỗi server', error: error.message });
	};
};

exports.deleteUsers = async (req, res) => {
	try {
		const { id } = req.query;
		const deletedUsers = await Users.deleteUsers(id);
		if (!deletedUsers)
		{
			return res.status(404).send({message: 'Users not found' });
		}
		res.status(200).send({ message: 'Xóa Users  thành công', deletedUsers });
	} catch (error) {
		res.status(500).send({ message: 'Lỗi server', error: error.message });
	};
};

