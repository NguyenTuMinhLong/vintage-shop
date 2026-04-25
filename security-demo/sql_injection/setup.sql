-- SQL Injection Security Demo - Database Setup
-- Run this to initialize the demo database

CREATE DATABASE IF NOT EXISTS security_demo;
USE security_demo;

-- Users table for login demo
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100)
);

-- Insert sample users (passwords are hashed)
INSERT INTO users (username, password, email) VALUES
('admin', 'admin123', 'admin@example.com'),
('user1', 'pass1', 'user1@example.com'),
('john', 'secret', 'john@example.com');

-- Products table for search demo
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    price DECIMAL(10,2)
);

-- Insert sample products
INSERT INTO products (name, category, price) VALUES
('Vintage Lamp', 'Lighting', 150.00),
('Old Book', 'Books', 25.00),
('Antique Clock', 'Collectibles', 300.00),
('Retro Radio', 'Electronics', 80.00),
('Classic Camera', 'Photography', 200.00);
