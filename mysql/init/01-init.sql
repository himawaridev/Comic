-- Tạo database nếu chưa tồn tại
CREATE DATABASE IF NOT EXISTS comic CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Sử dụng database
USE comic;

-- Tạo user và cấp quyền (nếu chưa có)
CREATE USER IF NOT EXISTS 'comic_user'@'%' IDENTIFIED BY 'comic_pass';
GRANT ALL PRIVILEGES ON comic.* TO 'comic_user'@'%';
FLUSH PRIVILEGES;

-- Tạo bảng logs nếu cần
CREATE TABLE IF NOT EXISTS application_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    level VARCHAR(10) NOT NULL,
    message TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    service VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo index cho performance
CREATE INDEX idx_logs_timestamp ON application_logs(timestamp);
CREATE INDEX idx_logs_level ON application_logs(level);
CREATE INDEX idx_logs_service ON application_logs(service); 