-- Tạo database và sử dụng database đó
CREATE DATABASE IF NOT EXISTS dashboard_db;
USE dashboard_db;

-- Tạo bảng roles
CREATE TABLE IF NOT EXISTS roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) UNIQUE,
  description VARCHAR(255)
);

-- Chèn dữ liệu mặc định cho bảng roles
INSERT IGNORE INTO roles (name, description) VALUES ('admin', 'Administrator');
INSERT IGNORE INTO roles (name, description) VALUES ('user', 'Regular User');
INSERT IGNORE INTO roles (name, description) VALUES ('drivers', 'Regular drivers');


-- Tạo bảng users với khóa ngoại role_id tham chiếu bảng roles
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  role_id INT,
  FOREIGN KEY (role_id) REFERENCES roles(id)
);


ALTER TABLE users 
ADD COLUMN email VARCHAR(255) UNIQUE AFTER username,
ADD COLUMN full_name VARCHAR(255) AFTER email,
ADD COLUMN phone_number VARCHAR(20) AFTER full_name,
ADD COLUMN avatar VARCHAR(255) AFTER phone_number,
ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER avatar,
ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at;

-- Chèn dữ liệu vào bảng users với mật khẩu đã được hash
INSERT INTO users (username, password, role_id) 
VALUES 
  ('admin1', '$2b$10$ZKjEOWzIUtP9zxdmPDjZCuKqD.H0tN0UQFmqRlt59Lw6vF8jkXUem', 1);


select * from users;


CREATE TABLE drivers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    license_number VARCHAR(50) UNIQUE NOT NULL, -- Số bằng lái xe
    experience_years INT CHECK (experience_years >= 0),
    date_of_birth DATE NOT NULL,
    address VARCHAR(255) NULL,
    rating DECIMAL(3,2) DEFAULT 5.0,  -- Đánh giá tài xế (tối đa 5.0)
    status ENUM('Hoạt động', 'Tạm nghỉ', 'Đã nghỉ việc') DEFAULT 'Hoạt động',
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

ALTER TABLE drivers  
ADD COLUMN avatar VARCHAR(255) NULL;

INSERT INTO drivers (first_name, last_name, license_number, experience_years, date_of_birth, address, rating, status, user_id)
VALUES
('Nguyễn', 'Văn An', 'VN12345678', 5, '1985-06-15', 'Hà Nội, Việt Nam', 4.8, 'Hoạt động', 5),
('Trần', 'Đình Bá', 'VN87654321', 8, '1982-09-20', 'TP HCM, Việt Nam', 4.9, 'Hoạt động', 5),
('Lê', 'Thành Chó', 'VN56781234', 2, '1990-12-05', 'Đà Nẵng, Việt Nam', 4.5, 'Tạm nghỉ', 5),
('Phạm', 'Hữu Dũng', 'VN43218765', 10, '1978-04-22', 'Cần Thơ, Việt Nam', 4.7, 'Hoạt động', 5);


---------------------------------
-- 5. Bảng Xe (buses)
---------------------------------
CREATE TABLE buses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    license_plate VARCHAR(20) UNIQUE NOT NULL, -- Biển số xe
    bus_type ENUM('Ghế ngồi', 'Giường nằm', 'Limousine') NOT NULL,
    capacity INT NOT NULL, -- Số chỗ ngồi tối đa
    brand VARCHAR(100) NOT NULL, -- Hãng xe
    manufacture_year INT NOT NULL, -- Năm sản xuất
    status ENUM('Hoạt động', 'Bảo trì', 'Ngừng sử dụng') DEFAULT 'Hoạt động',
    driver_id INT NOT NULL,
    FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE CASCADE
);
ALTER TABLE buses
ADD COLUMN image VARCHAR(255);

SELECT id, first_name, last_name FROM drivers;


-- Thêm 5 dòng dữ liệu vào bảng buses
INSERT INTO buses (license_plate, bus_type, capacity, brand, manufacture_year, status, driver_id)
VALUES
('29B-12345', 'Ghế ngồi', 45, 'Thaco', 2015, 'Hoạt động', 19),
('29B-67890', 'Giường nằm', 35, 'Hyundai', 2018, 'Hoạt động', 20),
('29B-11223', 'Limousine', 20, 'Mercedes-Benz', 2020, 'Bảo trì', 21),
('29B-33445', 'Ghế ngồi', 50, 'Toyota', 2017, 'Hoạt động', 22),
('29B-55678', 'Giường nằm', 30, 'Ford', 2019, 'Ngừng sử dụng', 19);

select * from buses;





-- 6. Bảng Tuyến Đường (routes)

CREATE TABLE routes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    route_name VARCHAR(255) NOT NULL,
    start_location VARCHAR(255) NOT NULL,
    end_location VARCHAR(255) NOT NULL,
    distance_km DECIMAL(10,2) NOT NULL,
    expected_duration TIME NOT NULL,   -- Thời gian di chuyển dự kiến
    ticket_price DECIMAL(10,2) NOT NULL  -- Giá vé mặc định trên tuyến
);
			
-- Thêm dữ liệu vào bảng routes
INSERT INTO routes (route_name, start_location, end_location, distance_km, expected_duration, ticket_price)
VALUES 
('Hà Nội - Hải Phòng', 'Hà Nội', 'Hải Phòng', 120.00, '02:30:00', 150000),
('Hà Nội - Đà Nẵng', 'Hà Nội', 'Đà Nẵng', 765.00, '15:00:00', 600000),
('Hồ Chí Minh - Cần Thơ', 'Hồ Chí Minh', 'Cần Thơ', 165.00, '03:30:00', 180000),
('Đà Nẵng - Huế', 'Đà Nẵng', 'Huế', 100.00, '02:00:00', 120000),
('Hà Nội - Lào Cai', 'Hà Nội', 'Lào Cai', 300.00, '06:30:00', 250000);


-- 7. Bảng Điểm Dừng (route_stops)
CREATE TABLE route_stops (
    id INT AUTO_INCREMENT PRIMARY KEY,
    route_id INT NOT NULL,
    stop_name VARCHAR(255) NOT NULL,  -- Tên bến xe/trạm dừng
    stop_order INT NOT NULL,          -- Thứ tự điểm dừng trên tuyến
    estimated_arrival_time TIME NOT NULL, -- Giờ đến dự kiến tại điểm dừng
    FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE
);


-- Thêm dữ liệu vào bảng route_stops
INSERT INTO route_stops (route_id, stop_name, stop_order, estimated_arrival_time)
VALUES
(1, 'Bến xe Mỹ Đình', 1, '00:00:00'),
(1, 'Bến xe Hải Phòng', 2, '02:30:00'),

(2, 'Bến xe Mỹ Đình', 1, '00:00:00'),
(2, 'Bến xe Vinh', 2, '06:00:00'),
(2, 'Bến xe Đà Nẵng', 3, '15:00:00'),

(3, 'Bến xe Miền Tây', 1, '00:00:00'),
(3, 'Bến xe Cần Thơ', 2, '03:30:00'),

(4, 'Bến xe Đà Nẵng', 1, '00:00:00'),
(4, 'Bến xe Huế', 2, '02:00:00'),

(5, 'Bến xe Mỹ Đình', 1, '00:00:00'),
(5, 'Bến xe Yên Bái', 2, '03:30:00'),
(5, 'Bến xe Lào Cai', 3, '06:30:00');



-- 8. Bảng Lịch Trình Xe (schedules)

CREATE TABLE schedules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    route_id INT NOT NULL,
    bus_id INT NOT NULL,
    departure_time DATETIME NOT NULL,
    arrival_time DATETIME NOT NULL,
    estimated_duration TIME NOT NULL,
    status ENUM('Sắp khởi hành', 'Đang chạy', 'Hoàn thành', 'Hủy') DEFAULT 'Sắp khởi hành',
    FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE,
    FOREIGN KEY (bus_id) REFERENCES buses(id) ON DELETE CASCADE
);

select * from routes;
select * from buses;
select * from schedules;


INSERT INTO schedules (route_id, bus_id, departure_time, arrival_time, estimated_duration, status)
VALUES 
(1, 6, '2025-04-06 06:00:00', '2025-04-06 08:30:00', '02:30:00', 'Sắp khởi hành'),
(2, 7, '2025-04-06 05:00:00', '2025-04-06 20:00:00', '15:00:00', 'Sắp khởi hành'),
(3, 8, '2025-04-06 07:00:00', '2025-04-06 10:30:00', '03:30:00', 'Sắp khởi hành');

-- 9. Bảng Đặt Vé (bookings)

CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('Đang xử lý', 'Thành công', 'Thất bại') DEFAULT 'Đang xử lý',
    pickup_location VARCHAR(255) NOT NULL,   -- Nơi đón khách
    dropoff_location VARCHAR(255) NOT NULL,    -- Nơi trả khách
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);
-- 10. Bảng Vé Xe (tickets)

CREATE TABLE tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    schedule_id INT NOT NULL,
    seat_number VARCHAR(10) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    status ENUM('Đã đặt', 'Đã thanh toán', 'Đã sử dụng', 'Hủy') DEFAULT 'Đã đặt',
    qr_code TEXT NULL,         -- Mã QR của vé điện tử
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    passenger_name VARCHAR(255) NOT NULL,
    passenger_phone VARCHAR(20) NOT NULL,
    passenger_id_number VARCHAR(20) NULL, -- CMND/CCCD
    seat_class ENUM('Thường', 'VIP', 'Deluxe') NOT NULL,
    FOREIGN KEY (schedule_id) REFERENCES schedules(id) ON DELETE CASCADE
);

select * from schedules;

INSERT INTO tickets (
    schedule_id, seat_number, price, status, qr_code,
    passenger_name, passenger_phone, passenger_id_number, seat_class
)
VALUES
-- Vé cho lịch trình 1
(4, 'A1', 200000, 'Đã thanh toán', 'QR123ABC',
 'Nguyễn Văn An', '0909123456', '012345678', 'Thường'),
(4, 'A2', 200000, 'Đã đặt', NULL,
 'Trần Thị B', '0911123456', '023456789', 'VIP'),

-- Vé cho lịch trình 2
(5, 'B1', 500000, 'Đã sử dụng', 'QR456DEF',
 'Lê Văn Chí', '0922123456', '034567890', 'Deluxe'),
(5, 'B2', 500000, 'Đã đặt', NULL,
 'Phạm Thị D', '0933123456', '045678901', 'Thường'),

-- Vé cho lịch trình 3
(6, 'C1', 300000, 'Hủy', 'QR789GHI',
 'Hoàng Văn Thụ', '0944123456', '056789012', 'VIP'),
(6, 'C2', 300000, 'Đã thanh toán', 'QR101JKL',
 'Đặng Thị Hằng', '0955123456', '067890123', 'Thường');





select * from customers;


-- 11. Bảng Trung Gian Giữa Booking và Ticket (booking_tickets)

CREATE TABLE booking_tickets (
    booking_id INT NOT NULL,
    ticket_id INT NOT NULL,
    PRIMARY KEY (booking_id, ticket_id),
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE
);

-- Tạo đơn đặt vé mới
INSERT INTO bookings (customer_id, total_amount, status, pickup_location, dropoff_location)
VALUES (1, 400000, 'Thành công', 'Bến xe Mỹ Đình', 'Bến xe Hải Phòng');

INSERT INTO booking_tickets (booking_id, ticket_id)
VALUES (2, 7);


select * from tickets;
select * from bookings;

