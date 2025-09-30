const Acc = require("../models/acc");
const jwt = require('jsonwebtoken');
// const SendEmail = require('../middleware/email')
require('dotenv').config();
module.exports = {
    login: async (req, res) => {
        const { email, password } = req.body;
        const user = await Acc.login(email, password);
        const token = jwt.sign({
            id: user.id,
            email: user.email,
            role: user.role
        }, process.env.KEY, {
            expiresIn: '1d'
        });
        if (user) {
            return res.status(200).json({ user, token });
        } else {
            res.status(401).json({ message: "Sai email hoac mat khau" });
        }
    },
    register: async (req, res) => {
        const { name, email, password, phone, address } = req.body;
        const user = await Acc.regrister(name, email, password, phone, address);
        res.status(201).json(user);
    },
};