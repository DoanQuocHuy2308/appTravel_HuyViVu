const Combo_Items = require('../models/combo_items')

exports.getAllCombo_Items = async (req,res) => {
	try{

		const combo_items = await Combo_Items.getAllCombo_Items();
		res.status(200).send(combo_items);
	} catch (error) {

		res.status(500).send({ message: error.message });
	};
};

exports.getCombo_ItemsById = async (req, res) =>{
	try{

		const combo_items = await Combo_Items.getCombo_ItemsById(req.query.id);
		if (!combo_items) return res.status(404).send({ message: 'combo_items không tìm thấy' });
		res.status(200).send(combo_items);
	} catch (error) {

		res.status(500).send({ message: error.message });
	};
};

exports.createCombo_Items = async (req, res) => {
	try {
		const { combo_id, service_id } = req.body;
		if (!combo_id || !service_id) {
			return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin bắt buộc' });
		}
		const combo_itemsId = await Combo_Items.createCombo_Items( combo_id, service_id );
		res.status(201).send({ message: 'Tạo thành công', combo_itemsId });
	} catch (error) {
		res.status(500).send({ message: 'Lỗi server', error: error.message });
	};
};

exports.updateCombo_Items = async (req, res) => {
	try {
		const { id } = req.query;
		const { combo_id, service_id } = req.body;
		if (!combo_id ||!service_id) {
			return res.status(400).send({ message: 'Vui lòng cung cấp đầy đủ thông tin bắt buộc' });
		}
		const updatedCombo_Items = await Combo_Items.updateCombo_Items(id,combo_id, service_id);
		if (!updatedCombo_Items){
			return res.status(404).send({ message: 'Combo_Items not found' });
		}
		res.status(200).send({ message: 'Cập nhật Combo_Items thành công', updatedCombo_Items });
	} catch (error) {
		res.status(500).send({ message: 'Lỗi server', error: error.message });
	};
};

exports.deleteCombo_Items = async (req, res) => {
	try {
		const { id } = req.query;
		const deletedCombo_Items = await Combo_Items.deleteCombo_Items(id);
		if (!deletedCombo_Items)
		{
			return res.status(404).send({message: 'Combo_Items not found' });
		}
		res.status(200).send({ message: 'Xóa Combo_Items  thành công', deletedCombo_Items });
	} catch (error) {
		res.status(500).send({ message: 'Lỗi server', error: error.message });
	};
};

