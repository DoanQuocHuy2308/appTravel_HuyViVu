const { sendEmail } = require('../middleware/email');

// Gửi email xác nhận đặt tour
exports.sendBookingConfirmation = async (req, res) => {
    try {
        const { to, subject, template, data } = req.body;
        
        // Tạo nội dung email
        const htmlContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #2c3e50;">Xác nhận đặt tour thành công!</h2>
                <p>Xin chào <strong>${data.user_name}</strong>,</p>
                <p>Chúng tôi đã nhận được đơn đặt tour của bạn với thông tin sau:</p>
                
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
                    <h3 style="color: #495057; margin-top: 0;">Thông tin đơn hàng</h3>
                    <p><strong>Mã đơn hàng:</strong> #${data.booking_id}</p>
                    <p><strong>Tour:</strong> ${data.tour_name}</p>
                    <p><strong>Ngày đặt:</strong> ${data.booking_date}</p>
                    <p><strong>Ngày khởi hành:</strong> ${data.start_date || 'Chưa xác định'}</p>
                    <p><strong>Ngày kết thúc:</strong> ${data.end_date || 'Chưa xác định'}</p>
                    <p><strong>Số khách:</strong> ${data.adults} người lớn, ${data.children} trẻ em, ${data.infants} em bé</p>
                    <p><strong>Tổng tiền:</strong> ${data.total_price ? data.total_price.toLocaleString('vi-VN') + ' VNĐ' : 'Chưa xác định'}</p>
                    <p><strong>Trạng thái:</strong> <span style="color: #28a745; font-weight: bold;">${data.status}</span></p>
                    ${data.notes ? `<p><strong>Ghi chú:</strong> ${data.notes}</p>` : ''}
                </div>
                
                <p>Cảm ơn bạn đã tin tưởng và lựa chọn dịch vụ của chúng tôi!</p>
                <p>Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi.</p>
                
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
                    <p style="color: #6c757d; font-size: 14px;">
                        Trân trọng,<br>
                        <strong>Đội ngũ Jeep Bicycle</strong>
                    </p>
                </div>
            </div>
        `;
        
        const result = await sendEmail(to, subject, htmlContent);
        
        if (result) {
            res.status(200).send({ message: 'Email sent successfully' });
        } else {
            res.status(500).send({ message: 'Failed to send email' });
        }
    } catch (error) {
        console.error('Send booking confirmation error:', error);
        res.status(500).send({ message: error.message });
    }
};

// Gửi email cập nhật đơn hàng
exports.sendBookingUpdate = async (req, res) => {
    try {
        const { to, subject, template, data } = req.body;
        
        // Tạo nội dung email
        const htmlContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #2c3e50;">Cập nhật thông tin đơn hàng</h2>
                <p>Xin chào <strong>${data.user_name}</strong>,</p>
                <p>Đơn hàng của bạn đã được cập nhật với thông tin mới:</p>
                
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
                    <h3 style="color: #495057; margin-top: 0;">Thông tin đơn hàng đã cập nhật</h3>
                    <p><strong>Mã đơn hàng:</strong> #${data.booking_id}</p>
                    <p><strong>Tour:</strong> ${data.tour_name}</p>
                    <p><strong>Ngày đặt:</strong> ${data.booking_date}</p>
                    <p><strong>Ngày khởi hành:</strong> ${data.start_date || 'Chưa xác định'}</p>
                    <p><strong>Ngày kết thúc:</strong> ${data.end_date || 'Chưa xác định'}</p>
                    <p><strong>Số khách:</strong> ${data.adults} người lớn, ${data.children} trẻ em, ${data.infants} em bé</p>
                    <p><strong>Tổng tiền:</strong> ${data.total_price ? data.total_price.toLocaleString('vi-VN') + ' VNĐ' : 'Chưa xác định'}</p>
                    <p><strong>Trạng thái:</strong> <span style="color: #007bff; font-weight: bold;">${data.status}</span></p>
                    ${data.notes ? `<p><strong>Ghi chú:</strong> ${data.notes}</p>` : ''}
                </div>
                
                <p>Nếu có bất kỳ thắc mắc nào về việc cập nhật này, vui lòng liên hệ với chúng tôi.</p>
                
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
                    <p style="color: #6c757d; font-size: 14px;">
                        Trân trọng,<br>
                        <strong>Đội ngũ Jeep Bicycle</strong>
                    </p>
                </div>
            </div>
        `;
        
        const result = await sendEmail(to, subject, htmlContent);
        
        if (result) {
            res.status(200).send({ message: 'Email sent successfully' });
        } else {
            res.status(500).send({ message: 'Failed to send email' });
        }
    } catch (error) {
        console.error('Send booking update error:', error);
        res.status(500).send({ message: error.message });
    }
};

// Gửi email hủy đơn hàng
exports.sendBookingCancellation = async (req, res) => {
    try {
        const { to, subject, template, data } = req.body;
        
        // Tạo nội dung email
        const htmlContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #dc3545;">Hủy đơn hàng</h2>
                <p>Xin chào <strong>${data.user_name}</strong>,</p>
                <p>Đơn hàng của bạn đã được hủy với thông tin sau:</p>
                
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
                    <h3 style="color: #495057; margin-top: 0;">Thông tin đơn hàng đã hủy</h3>
                    <p><strong>Mã đơn hàng:</strong> #${data.booking_id}</p>
                    <p><strong>Tour:</strong> ${data.tour_name}</p>
                    <p><strong>Ngày đặt:</strong> ${data.booking_date}</p>
                    <p><strong>Ngày khởi hành:</strong> ${data.start_date || 'Chưa xác định'}</p>
                    <p><strong>Ngày kết thúc:</strong> ${data.end_date || 'Chưa xác định'}</p>
                    <p><strong>Số khách:</strong> ${data.adults} người lớn, ${data.children} trẻ em, ${data.infants} em bé</p>
                    <p><strong>Tổng tiền:</strong> ${data.total_price ? data.total_price.toLocaleString('vi-VN') + ' VNĐ' : 'Chưa xác định'}</p>
                    <p><strong>Trạng thái:</strong> <span style="color: #dc3545; font-weight: bold;">${data.status}</span></p>
                    ${data.notes ? `<p><strong>Ghi chú:</strong> ${data.notes}</p>` : ''}
                </div>
                
                <p>Chúng tôi rất tiếc vì sự bất tiện này. Nếu bạn muốn đặt lại tour, vui lòng liên hệ với chúng tôi.</p>
                
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
                    <p style="color: #6c757d; font-size: 14px;">
                        Trân trọng,<br>
                        <strong>Đội ngũ Jeep Bicycle</strong>
                    </p>
                </div>
            </div>
        `;
        
        const result = await sendEmail(to, subject, htmlContent);
        
        if (result) {
            res.status(200).send({ message: 'Email sent successfully' });
        } else {
            res.status(500).send({ message: 'Failed to send email' });
        }
    } catch (error) {
        console.error('Send booking cancellation error:', error);
        res.status(500).send({ message: error.message });
    }
};
