import mysql from 'mysql2/promise';

const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ventas_db',
  port: parseInt(process.env.DB_PORT || '3306'),
});

export default connection;
