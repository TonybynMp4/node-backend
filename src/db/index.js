import { Pool } from 'pg';

const DB_HOST = process.env.DB_HOST ?? 'localhost';
const DB_PORT = Number.parseInt(process.env.DB_PORT ?? '5432', 10);
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD ?? process.env.dbpwd; // .env / shell variable
const DB_NAME = process.env.DB_NAME;

if (!DB_USER || !DB_PASSWORD || !DB_NAME) {
	throw new Error('Database configuration environment variables are not set.');
}

const pool = new Pool({
	host: DB_HOST,
	port: DB_PORT,
	user: DB_USER,
	password: DB_PASSWORD,
	database: DB_NAME,
	max: 20,
	idleTimeoutMillis: 30000,
});

pool.on('error', (err) => {
	console.error('Unexpected error', err);
	process.exit(-1);
});

const db = {
	query: (text, params, callback) => {
		return pool.query(text, params, callback);
	},
};
export default db;