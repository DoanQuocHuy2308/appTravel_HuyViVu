const Acc = require("../models/acc");
const jwt = require('jsonwebtoken');
// const SendEmail = require('../middleware/email')
require('dotenv').config();
module.exports = {
    login: async (req, res) => {
        const { email, password } = req.body;
        const result = await Acc.login(email, password);

        if (!result.success) {
            if (result.message === "Tài khoản không tồn tại") {
                return res.status(404).json({ message: result.message });
            } else if (result.message === "Sai mật khẩu") {
                return res.status(401).json({ message: result.message });
            }
        }

        const token = jwt.sign({
            id: result.user.id,
            email: result.user.email,
            role: result.user.role
        }, process.env.KEY, {
            expiresIn: '1d'
        });
        const dataUser = { ...result.user, token }
        res.status(200).json({ user: dataUser });
    },
    register: async (req, res) => {
        try {
            let image = "";
            const { name, email, password, phone, address } = req.body;
            if (req.file) {
                image = "/public/images/" + req.file.filename;
            } else {
                image = "/public/images/avatar.jpg";
            }
            const existing = await Acc.checkEmail(email);
            if (existing.length > 0) {
                return res.status(400).json({ message: "Email đã tồn tại!" });
            }

            const user = await Acc.register(name, email, password, phone, address, image);
            res.status(201).json(user);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Lỗi server" });
        }
    },

    checkEmail: async (req, res) => {
        try {
            const { email } = req.body;
            if (!email) {
                return res.status(400).json({ message: "Email là bắt buộc" });
            }

            const existing = await Acc.checkEmail(email);
            if (existing.length > 0) {
                return res.status(400).json({ message: "Email đã tồn tại!" });
            }

            res.status(200).json({ message: "Email có thể sử dụng" });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Lỗi server" });
        }
    }

};