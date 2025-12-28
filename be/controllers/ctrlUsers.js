const Users = require('../models/users')
const { deleteFile } = require('../middleware/upload')

exports.getAllUsers = async (req, res) => {
	try {

		const users = await Users.getAllUsers();
		res.status(200).send(users);
	} catch (error) {

		res.status(500).send({ message: error.message });
	};
};

exports.getUsersById = async (req, res) => {
	try {

		const users = await Users.getUsersById(req.query.id);
		if (!users) return res.status(404).send({ message: 'users không tìm thấy' });
		res.status(200).send(users);
	} catch (error) {

		res.status(500).send({ message: error.message });
	};
};

exports.createUsers = async (req, res) => {
	try {
		const { name, email, password, phone, birthday, address, role, points } = req.body;
		const image = req.file ? '/public/images/'+req.file.filename : null;
		if (!name || !email || !password || !phone || !address) {
			return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin bắt buộc: name, email, password, phone, address' });
		}
		
		// Xử lý birthday: đảm bảo format YYYY-MM-DD
		let processedBirthday = birthday;
		if (birthday && birthday.trim()) {
			// Nếu birthday là ISO string, convert sang YYYY-MM-DD
			if (birthday.includes('T') || birthday.includes('Z')) {
				const date = new Date(birthday);
				const year = date.getFullYear();
				const month = String(date.getMonth() + 1).padStart(2, '0');
				const day = String(date.getDate()).padStart(2, '0');
				processedBirthday = `${year}-${month}-${day}`;
			}
		}
		
		const defaultData = {
			birthday: processedBirthday || null,
			role: role || 'customer',
			points: points || 0,
			image: image || null
		};

		const usersId = await Users.createUsers(
			name, 
			email, 
			password, 
			phone, 
			defaultData.birthday, 
			address, 
			defaultData.role, 
			defaultData.points, 
			image
		);
		res.status(201).send({ message: 'Tạo thành công', usersId });
	} catch (error) {
		res.status(500).send({ message: 'Lỗi server', error: error.message });
	};
};

exports.updateUsers = async (req, res) => {
	try {
		const { id } = req.query;
		const { name, email, password, phone, birthday, address, role, points } = req.body;
		
		
		// Lấy thông tin user hiện tại trước
		const currentUser = await Users.getUsersById(id);
		if (!currentUser) {
			return res.status(404).send({ message: 'User không tìm thấy' });
		}	
		
		// Xử lý image: nếu có file mới thì dùng file mới, nếu không thì giữ nguyên
		const image = req.file ? '/public/images/'+req.file.filename : currentUser.image;
		
		// Nếu có ảnh mới và có ảnh cũ, xóa ảnh cũ
		if (req.file && currentUser.image) {
			console.log('Deleting old image:', currentUser.image);
			deleteFile(currentUser.image);
		}
		
		// Xử lý birthday: đảm bảo format YYYY-MM-DD
		let processedBirthday = currentUser.birthday;
		if (birthday && birthday.trim()) {
			// Nếu birthday là ISO string, convert sang YYYY-MM-DD
			if (birthday.includes('T') || birthday.includes('Z')) {
				const date = new Date(birthday);
				const year = date.getFullYear();
				const month = String(date.getMonth() + 1).padStart(2, '0');
				const day = String(date.getDate()).padStart(2, '0');
				processedBirthday = `${year}-${month}-${day}`;
			} else {
				processedBirthday = birthday;
			}
		}
		
		const updateData = {
			name: name || currentUser.name,
			email: email || currentUser.email,
			password: password !== undefined ? password : currentUser.password, // Chỉ cập nhật password nếu có gửi lên
			phone: phone || currentUser.phone,
			birthday: processedBirthday,
			address: address || currentUser.address,
			role: role || currentUser.role,
			points: points !== undefined ? points : currentUser.points,
			image: image
		};
		
		console.log('Update data:', updateData);
		
		if (!updateData.name || !updateData.email || !updateData.phone || !updateData.address) {
			return res.status(400).send({ message: 'Vui lòng cung cấp đầy đủ thông tin bắt buộc' });
		}

		const updatedUsers = await Users.updateUsers(
			id, 
			updateData.name, 
			updateData.email, 
			updateData.password, 
			updateData.phone, 
			updateData.birthday, 
			updateData.address, 
			updateData.role, 
			updateData.points, 
			updateData.image
		);
		
		if (!updatedUsers) {
			return res.status(404).send({ message: 'Users not found' });
		}
		res.status(200).send({ message: 'Cập nhật Users thành công', updatedUsers });
	} catch (error) {
		console.error('Update user error:', error);
		res.status(500).send({ message: 'Lỗi server', error: error.message });
	};
};

exports.deleteUsers = async (req, res) => {
	try {
		const { id } = req.query;
		
		// Lấy thông tin user trước khi xóa để lấy đường dẫn ảnh
		const userToDelete = await Users.getUsersById(id);
		if (!userToDelete) {
			return res.status(404).send({ message: 'Users not found' });
		}
		
		// Xóa ảnh nếu có
		if (userToDelete.image) {
			console.log('Deleting user image:', userToDelete.image);
			deleteFile(userToDelete.image);
		}
		
		const deletedUsers = await Users.deleteUsers(id);
		res.status(200).send({ message: 'Xóa Users thành công', deletedUsers });
	} catch (error) {
		res.status(500).send({ message: 'Lỗi server', error: error.message });
	};
};

exports.updateUserPoints = async (req, res) => {
	try {
		const { id } = req.query;
		const { points } = req.body;
		const updatedUserPoints = await Users.updateUserPoints(id, points);
		if (!updatedUserPoints) {
			return res.status(404).send({ message: 'User points not found' });
		}
		res.status(200).send(updatedUserPoints);
	} catch (error) {
		res.status(500).send({ message: 'Lỗi server', error: error.message });
	};
};
exports.updateUserRole = async (req, res) => {
	try {
		const { id } = req.query;
		const { role } = req.body;
		const updatedUserRole = await Users.updateUserRole(id, role);
		if (!updatedUserRole) {
			return res.status(404).send({ message: 'User role not found' });
		}
		res.status(200).send(updatedUserRole);
	} catch (error) {
		res.status(500).send({ message: 'Lỗi server', error: error.message });
	};
};