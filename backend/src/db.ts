// db.ts
import { Pool } from 'pg';
const USRE = process.env.DB_USER || 'postgres';
const HOST = process.env.DB_HOST || 'localhost';
const PORT = parseInt(process.env.DB_PORT || '5432', 10);
const PASSWORD = process.env.DB_PASSWORD || '171021';
const DATABASE = process.env.DB_NAME || 'testdb';

const pool = new Pool({
    user: USRE,
    host: HOST,
    database: DATABASE,
    password: PASSWORD,
    port: PORT,
});

export default pool;