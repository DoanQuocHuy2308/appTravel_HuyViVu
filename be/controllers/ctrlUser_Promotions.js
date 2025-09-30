const User_Promotions = require('../models/user_promotions')

exports.getAllUser_Promotions = async (req,res) => {
	try{

		const user_promotions = await User_Promotions.getAllUser_Promotions();
		res.status(200).send(user_promotions);
	} catch (error) {

		res.status(500).send({ message: error.message });
	};
};

exports.getUser_PromotionsById = async (req, res) =>{
	try{

		const user_promotions = await User_Promotions.getUser_PromotionsById(req.query.id);
		if (!user_promotions) return res.status(404).send({ message: 'user_promotions không tìm thấy' });
		res.status(200).send(user_promotions);
	} catch (error) {

		res.status(500).send({ message: error.message });
	};
};

exports.createUser_Promotions = async (req, res) => {
	try {
		const { user_id, promotion_id, used } = req.body;
		if (!user_id || !promotion_id || !used) {
			return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin bắt buộc' });
		}
		const user_promotionsId = await User_Promotions.createUser_Promotions( user_id, promotion_id, used );
		res.status(201).send({ message: 'Tạo thành công', user_promotionsId });
	} catch (error) {
		res.status(500).send({ message: 'Lỗi server', error: error.message });
	};
};

exports.updateUser_Promotions = async (req, res) => {
	try {
		const { id } = req.query;
		const { user_id, promotion_id, used } = req.body;
		if (!user_id ||!promotion_id ||!used) {
			return res.status(400).send({ message: 'Vui lòng cung cấp đầy đủ thông tin bắt buộc' });
		}
		const updatedUser_Promotions = await User_Promotions.updateUser_Promotions(id,user_id, promotion_id, used);
		if (!updatedUser_Promotions){
			return res.status(404).send({ message: 'User_Promotions not found' });
		}
		res.status(200).send({ message: 'Cập nhật User_Promotions thành công', updatedUser_Promotions });
	} catch (error) {
		res.status(500).send({ message: 'Lỗi server', error: error.message });
	};
};

exports.deleteUser_Promotions = async (req, res) => {
	try {
		const { id } = req.query;
		const deletedUser_Promotions = await User_Promotions.deleteUser_Promotions(id);
		if (!deletedUser_Promotions)
		{
			return res.status(404).send({message: 'User_Promotions not found' });
		}
		res.status(200).send({ message: 'Xóa User_Promotions  thành công', deletedUser_Promotions });
	} catch (error) {
		res.status(500).send({ message: 'Lỗi server', error: error.message });
	};
};

