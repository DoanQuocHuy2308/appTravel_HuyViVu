const Contact = require('../models/contact')

exports.getAllContact = async (req,res) => {
	try{

		const contact = await Contact.getAllContact();
		res.status(200).send(contact);
	} catch (error) {

		res.status(500).send({ message: error.message });
	};
};

exports.getContactById = async (req, res) =>{
	try{

		const contact = await Contact.getContactById(req.query.id);
		if (!contact) return res.status(404).send({ message: 'contact không tìm thấy' });
		res.status(200).send(contact);
	} catch (error) {

		res.status(500).send({ message: error.message });
	};
};

exports.createContact = async (req, res) => {
	try {
		const { user_id, subject, message, status } = req.body;
		if (!user_id || !subject || !message || !status) {
			return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin bắt buộc' });
		}
		const contactId = await Contact.createContact( user_id, subject, message, status );
		res.status(201).send({ message: 'Tạo thành công', contactId });
	} catch (error) {
		res.status(500).send({ message: 'Lỗi server', error: error.message });
	};
};

exports.updateContact = async (req, res) => {
	try {
		const { id } = req.query;
		const { user_id, subject, message, status } = req.body;
		if (!user_id ||!subject ||!message ||!status) {
			return res.status(400).send({ message: 'Vui lòng cung cấp đầy đủ thông tin bắt buộc' });
		}
		const updatedContact = await Contact.updateContact(id,user_id, subject, message, status);
		if (!updatedContact){
			return res.status(404).send({ message: 'Contact not found' });
		}
		res.status(200).send({ message: 'Cập nhật Contact thành công', updatedContact });
	} catch (error) {
		res.status(500).send({ message: 'Lỗi server', error: error.message });
	};
};

exports.deleteContact = async (req, res) => {
	try {
		const { id } = req.query;
		const deletedContact = await Contact.deleteContact(id);
		if (!deletedContact)
		{
			return res.status(404).send({message: 'Contact not found' });
		}
		res.status(200).send({ message: 'Xóa Contact  thành công', deletedContact });
	} catch (error) {
		res.status(500).send({ message: 'Lỗi server', error: error.message });
	};
};

