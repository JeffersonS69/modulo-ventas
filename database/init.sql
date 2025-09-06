-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS ventas_db;
USE ventas_db;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_name VARCHAR(255) NOT NULL,
  user_username VARCHAR(100) UNIQUE NOT NULL,
  user_role ENUM('asesor', 'supervisor', 'admin') NOT NULL,
  user_email VARCHAR(255) UNIQUE NOT NULL,
  user_password VARCHAR(255) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de ventas
CREATE TABLE IF NOT EXISTS ventas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cli_nombre VARCHAR(255) NOT NULL,
  cli_id VARCHAR(50) NOT NULL,
  cli_fec_nac DATE NOT NULL,
  cli_asesor VARCHAR(255) NOT NULL,
  inv_code VARCHAR(20) UNIQUE NOT NULL,
  inv_precio DOUBLE NOT NULL,
  inv_descuento DOUBLE DEFAULT 0,
  inv_desc_extra DOUBLE DEFAULT 0,
  inv_promo_desc DOUBLE DEFAULT 0,
  inv_total DOUBLE NOT NULL,
  venta_estado ENUM('Ingresada', 'Aprobada', 'Anulada') DEFAULT 'Ingresada',
  deleted BOOLEAN DEFAULT FALSE,
  date DATE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_venta_estado (venta_estado),
  INDEX idx_cli_asesor (cli_asesor),
  INDEX idx_date (date),
  INDEX idx_deleted (deleted)
);

-- Insertar usuarios de prueba (passwords: 'password123')
INSERT INTO users (user_name, user_username, user_role, user_email, user_password) VALUES
('Juan Pérez', 'asesor1', 'asesor', 'juan@empresa.com', '$2b$10$psWTGYSrBf1wURteATB6iOh0JYDWLrKGufdgtmhFNRlrDysggKwgi'),
('María García', 'supervisor1', 'supervisor', 'maria@empresa.com', '$2b$10$psWTGYSrBf1wURteATB6iOh0JYDWLrKGufdgtmhFNRlrDysggKwgi'),
('Admin User', 'admin1', 'admin', 'admin@empresa.com', '$2b$10$psWTGYSrBf1wURteATB6iOh0JYDWLrKGufdgtmhFNRlrDysggKwgi');

-- Insertar algunas ventas de ejemplo
INSERT INTO ventas (cli_nombre, cli_id, cli_fec_nac, cli_asesor, inv_code, inv_precio, inv_descuento, inv_desc_extra, inv_promo_desc, inv_total, venta_estado, date) VALUES
('Carlos Rodríguez', '12345678', '1990-05-15', 'Juan Pérez', 'F-M1-001', 1000.00, 100.00, 50.00, 0.00, 850.00, 'Ingresada', '2025-01-15'),
('Ana López', '87654321', '1985-08-22', 'Juan Pérez', 'F-M1-002', 1500.00, 150.00, 0.00, 100.00, 1250.00, 'Aprobada', '2025-01-16'),
('Pedro Martínez', '11223344', '1992-12-03', 'Juan Pérez', 'F-M1-003', 800.00, 80.00, 20.00, 0.00, 700.00, 'Ingresada', '2025-01-17');
