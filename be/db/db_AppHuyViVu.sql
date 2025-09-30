use apphuyvivu;
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    description TEXT NOT NULL,
    role ENUM('customer', 'admin', 'staff', 'guide') DEFAULT 'customer',
    points INT DEFAULT 0,
    image VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE tour_guides (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id int,
    experience_years INT DEFAULT 0,
    language VARCHAR(50),     
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Bảng vùng miền
CREATE TABLE regions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,  
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE locations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    city VARCHAR(100),
    country VARCHAR(100),
    image VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE tour_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT
);

CREATE TABLE tours (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    tour_type_id INT,
    start_location_id INT,
    end_location_id INT,
    description TEXT,
    notes TEXT,                   
    max_customers INT DEFAULT 0,   
    duration_days VARCHAR(50),            
    start_date DATE,             
    guide_id INT,      
    location text,
    ideal_time VARCHAR(50),      
    transportation VARCHAR(255),            
    suitable_for TEXT,            
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tour_type_id) REFERENCES tour_types(id),
    FOREIGN KEY (start_location_id) REFERENCES locations(id),
    FOREIGN KEY (end_location_id) REFERENCES locations(id),
    FOREIGN KEY (guide_id) REFERENCES tour_guides(id)
);

CREATE TABLE Image_tour(
	id INT AUTO_INCREMENT PRIMARY KEY,
    tour_id INT,
    image VARCHAR(255),
    FOREIGN KEY (tour_id) REFERENCES tours(id),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tour_schedule (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tour_id INT,
    day_number INT,
    title VARCHAR(255),
    description TEXT,
    FOREIGN KEY (tour_id) REFERENCES tours(id)
);

CREATE TABLE ticket_prices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tour_id INT,
    customer_type ENUM('adult','child','infant') DEFAULT 'adult',
    price DECIMAL(10,2),
    FOREIGN KEY (tour_id) REFERENCES tours(id)
);

CREATE TABLE tour_prices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tour_id INT,
    start_date DATE,
    end_date DATE,
    price DECIMAL(10,2),
    FOREIGN KEY (tour_id) REFERENCES tours(id)
);

CREATE TABLE services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    service_type ENUM('hotel','flight','car','other'),
    description TEXT,
    price DECIMAL(10,2),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    tour_id INT,
    booking_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    start_date DATE,
    end_date DATE,
    total_price DECIMAL(10,2),
    status ENUM('pending','confirmed','canceled') DEFAULT 'pending',
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (tour_id) REFERENCES tours(id)
);

CREATE TABLE booking_services (
    id INT AUTO_INCREMENT PRIMARY KEY,
     user_id INT,
    service_id INT,
    quantity INT DEFAULT 1,
    price DECIMAL(10,2),
    location text,
    booking_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (service_id) REFERENCES services(id)
);
CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    tour_id INT,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    image VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (tour_id) REFERENCES tours(id)
);
CREATE TABLE banners (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100),
    image VARCHAR(255),
    status ENUM('active','inactive') DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE promotions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) UNIQUE,
    description TEXT,
    discount DECIMAL(5,2),
    start_date DATE,
    end_date DATE,
    status ENUM('active','inactive') DEFAULT 'active'
);
CREATE TABLE user_promotions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    promotion_id INT,
    used BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (promotion_id) REFERENCES promotions(id)
);
CREATE TABLE contact (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    subject VARCHAR(255),
    message TEXT,
    status ENUM('pending','answered','closed') DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE TABLE favorite_tours (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    tour_id INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE,
    UNIQUE (user_id, tour_id)
);

CREATE TABLE user_points (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    booking_id INT,
    points_change INT NOT NULL,
    reason VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL
);
