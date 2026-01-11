import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ems_db',
  port: Number(process.env.DB_PORT) || 3306,
  connectionLimit: 10
};

// Create connection pool
export const db = mysql.createPool(dbConfig);

// Test database connection
export const testConnection = async () => {
  try {
    const connection = await db.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
};

// Execute query helper
export const executeQuery = async (query: string, params?: any[]): Promise<any> => {
  try {
    const [rows] = await db.execute(query, params);
    return rows;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

// Execute multiple queries in transaction
export const executeTransaction = async (queries: { query: string; params?: any[] }[]) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const results = [];
    
    for (const { query, params } of queries) {
      const [result] = await connection.execute(query, params);
      results.push(result);
    }
    
    await connection.commit();
    return results;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
