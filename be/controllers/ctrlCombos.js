const Combos = require('../models/combos')

exports.getAllCombos = async (req,res) => {
	try{

		const combos = await Combos.getAllCombos();
		res.status(200).send(combos);
	} catch (error) {

		res.status(500).send({ message: error.message });
	};
};

exports.getCombosById = async (req, res) =>{
	try{

		const combos = await Combos.getCombosById(req.query.id);
		if (!combos) return res.status(404).send({ message: 'combos không tìm thấy' });
		res.status(200).send(combos);
	} catch (error) {

		res.status(500).send({ message: error.message });
	};
};

exports.createCombos = async (req, res) => {
	try {
		const { name, tour_id, description, total_price, discount, start_date, end_date, status } = req.body;
		if (!name || !tour_id || !description || !total_price || !discount || !start_date || !end_date || !status) {
			return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin bắt buộc' });
		}
		const combosId = await Combos.createCombos( name, tour_id, description, total_price, discount, start_date, end_date, status );
		res.status(201).send({ message: 'Tạo thành công', combosId });
	} catch (error) {
		res.status(500).send({ message: 'Lỗi server', error: error.message });
	};
};

exports.updateCombos = async (req, res) => {
	try {
		const { id } = req.query;
		const { name, tour_id, description, total_price, discount, start_date, end_date, status } = req.body;
		if (!name ||!tour_id ||!description ||!total_price ||!discount ||!start_date ||!end_date ||!status) {
			return res.status(400).send({ message: 'Vui lòng cung cấp đầy đủ thông tin bắt buộc' });
		}
		const updatedCombos = await Combos.updateCombos(id,name, tour_id, description, total_price, discount, start_date, end_date, status);
		if (!updatedCombos){
			return res.status(404).send({ message: 'Combos not found' });
		}
		res.status(200).send({ message: 'Cập nhật Combos thành công', updatedCombos });
	} catch (error) {
		res.status(500).send({ message: 'Lỗi server', error: error.message });
	};
};

exports.deleteCombos = async (req, res) => {
	try {
		const { id } = req.query;
		const deletedCombos = await Combos.deleteCombos(id);
		if (!deletedCombos)
		{
			return res.status(404).send({message: 'Combos not found' });
		}
		res.status(200).send({ message: 'Xóa Combos  thành công', deletedCombos });
	} catch (error) {
		res.status(500).send({ message: 'Lỗi server', error: error.message });
	};
};

