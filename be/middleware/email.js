const nodemailer = require('nodemailer');
require("dotenv").config();

const sendEmail = async (email, subject, message) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            secure: true,
            port: 587,
            tls: { rejectUnauthorized: false },
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        });

        const mailOptions = {
            from: `Admin: Doan Quoc Huy From Jeep Bicycle`,
            to: email,
            subject: subject,
            html: message
        };

        const result = await transporter.sendMail(mailOptions);
        console.log(result.response);
        return true;
    } catch (error) {
        console.error(" Lỗi khi gửi email:", error); 
        return false;
    }
};

module.exports = {
    sendEmail,
};