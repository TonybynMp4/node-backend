import { Client } from 'pg';

const DEFAULT_HOST = process.env.DB_HOST ?? 'localhost';
const DEFAULT_PORT = Number.parseInt(process.env.DB_PORT ?? '5432', 10);

export function getConnection(username, password, database) {
	const user = username ?? process.env.DB_USER;
	const pwd = password ?? process.env.DB_PASSWORD ?? process.env.dbpwd;
	const dbName = database ?? process.env.DB_NAME;

	if (!user) {
		throw new Error('Database user is not defined. Set DB_USER or provide a username.');
	}

	if (!pwd) {
		throw new Error('Database password is not defined. Set DB_PASSWORD/dbpwd or provide a password.');
	}

	if (!dbName) {
		throw new Error('Database name is not defined. Set DB_NAME or provide a database name.');
	}

	return new Client({
		host: DEFAULT_HOST,
		port: DEFAULT_PORT,
		user,
		password: pwd,
		database: dbName,
	});
}

export async function getUsers(callback) {
	const client = getConnection("postgres", null, "mabase");

	try {
		await client.connect();
		const result = await client.query('SELECT id, email FROM "user" ORDER BY id ASC;');

		if (callback) {
			callback(null, result.rows);
		}

		return result.rows;
	} catch (error) {
		if (callback) {
			callback(error);
		}

		throw error;
	} finally {
		await client.end();
	}
}

export async function insert_user(user) {
	const client = getConnection();

	try {
		await client.connect();
		const result = await client.query('INSERT INTO "user" (email) VALUES ($1) RETURNING id, email;', [user?.email]);

		if (result.rowCount !== 1) {
			throw new Error('Insert did not affect any row.');
		}

		return result.rows[0];
	} finally {
		await client.end();
	}
}