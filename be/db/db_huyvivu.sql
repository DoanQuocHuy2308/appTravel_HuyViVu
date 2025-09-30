-- =========================
-- 0. KHỞI TẠO DATABASE
-- =========================
CREATE DATABASE IF NOT EXISTS huyvivu CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE huyvivu;

-- =========================
-- 1. NGƯỜI DÙNG
-- =========================
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role ENUM('customer','admin','staff','guide') DEFAULT 'customer',
    status ENUM('active','inactive') DEFAULT 'active',
    avatar VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =========================
-- 2. DANH MỤC TOUR
-- =========================
CREATE TABLE tour_categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    image VARCHAR(255) NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Nội dung mô tả thêm cho từng danh mục
CREATE TABLE category_contents (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    category_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    banner VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES tour_categories(id) ON DELETE CASCADE
);

-- =========================
-- 3. TOUR
-- =========================
CREATE TABLE tours (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    category_id BIGINT,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    duration_days INT NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    start_location VARCHAR(200),
    end_location VARCHAR(200),
    thumbnail VARCHAR(255) NULL COMMENT 'Ảnh đại diện của tour',
    tour_type ENUM('domestic','international') DEFAULT 'domestic' COMMENT 'Loại tour',
    country VARCHAR(150) NULL COMMENT 'Quốc gia nếu tour quốc tế',
    status ENUM('active','inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES tour_categories(id) ON DELETE SET NULL
);

-- =========================
-- 4. ẢNH TOUR
-- =========================
CREATE TABLE tour_images (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tour_id BIGINT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE
);

-- =========================
-- 5. LỊCH TRÌNH TOUR
-- =========================
CREATE TABLE tour_itineraries (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tour_id BIGINT NOT NULL,
    day_number INT NOT NULL COMMENT 'Ngày thứ mấy trong tour',
    title VARCHAR(200) NOT NULL,
    description TEXT,
    start_time TIME NULL,
    end_time TIME NULL,
    location VARCHAR(200) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE
);

-- =========================
-- 6. CHI PHÍ GỐC TOUR
-- =========================
CREATE TABLE tour_costs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tour_id BIGINT NOT NULL,
    cost_type VARCHAR(150) NOT NULL COMMENT 'Loại chi phí: xe, khách sạn, ăn uống, vé tham quan...',
    description TEXT,
    amount DECIMAL(12,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE
);

-- =========================
-- 7. MÃ GIẢM GIÁ (COUPONS)
-- =========================
CREATE TABLE coupons (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_type ENUM('percent','fixed') NOT NULL,
    discount_value DECIMAL(10,2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status ENUM('active','expired','disabled') DEFAULT 'active'
);

-- =========================
-- 8. VÍ VOUCHER CỦA NGƯỜI DÙNG
-- =========================
CREATE TABLE user_coupons (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    coupon_id BIGINT NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    used_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE CASCADE
);

-- =========================
-- 9. BOOKING (ĐẶT TOUR)
-- =========================
CREATE TABLE bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    tour_id BIGINT NOT NULL,
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    num_people INT NOT NULL,
    total_price DECIMAL(12,2) NOT NULL COMMENT 'Giá gốc chưa giảm',
    final_price DECIMAL(12,2) NOT NULL COMMENT 'Giá sau giảm',
    status ENUM('pending','confirmed','canceled','completed') DEFAULT 'pending',
    payment_status ENUM('unpaid','paid','refunded') DEFAULT 'unpaid',
    user_coupon_id BIGINT NULL COMMENT 'Mã giảm giá được chọn (nếu có)',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE,
    FOREIGN KEY (user_coupon_id) REFERENCES user_coupons(id) ON DELETE SET NULL
);

-- =========================
-- 10. DỊCH VỤ NGOÀI (EXTRA SERVICES)
-- =========================
CREATE TABLE extra_services (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(12,2) NOT NULL,
    thumbnail VARCHAR(255) NULL COMMENT 'Ảnh đại diện của dịch vụ',
    status ENUM('active','inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- 11. ẢNH DỊCH VỤ NGOÀI
-- =========================
CREATE TABLE service_images (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    service_id BIGINT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (service_id) REFERENCES extra_services(id) ON DELETE CASCADE
);

-- =========================
-- 12. DỊCH VỤ NGOÀI TRONG BOOKING
-- =========================
CREATE TABLE booking_services (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id BIGINT NOT NULL,
    service_id BIGINT NOT NULL,
    quantity INT DEFAULT 1,
    price DECIMAL(12,2) NOT NULL COMMENT 'Giá tại thời điểm đặt',
    total_price DECIMAL(12,2) NOT NULL,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES extra_services(id) ON DELETE CASCADE
);

-- =========================
-- 13. PHÂN CÔNG HƯỚNG DẪN VIÊN
-- =========================
CREATE TABLE tour_guides (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tour_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL COMMENT 'Người dùng có role = guide',
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    note VARCHAR(255) NULL,
    FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =========================
-- 14. FEEDBACK (ĐÁNH GIÁ TOUR)
-- =========================
CREATE TABLE feedbacks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    tour_id BIGINT NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE
);

-- =========================
-- 15. CONTACT (LIÊN HỆ)
-- =========================
CREATE TABLE contacts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(200),
    message TEXT NOT NULL,
    status ENUM('pending','processed','resolved') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
