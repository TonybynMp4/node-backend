import bcrypt from 'bcrypt';
import db from './index.js';

const SALT_ROUNDS = 10;
const authenticatedUsers = new Map();

export async function newUserRegistered({ email, password, role }) {
	const normalizedEmail = email.trim().toLowerCase();
	if (typeof email !== 'string' || !normalizedEmail) {
		throw new Error('Email is required.');
	}

	if (typeof password !== 'string' || password.length < 6) {
		throw new Error('Password must be at least 6 characters long.');
	}

	const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
	try {
		const { rows } = await db.query(
			`INSERT INTO users (email, password${role ? ', role' : ''})
			 VALUES ($1, $2${role ? ', $3' : ''})
			 RETURNING id`,
			[normalizedEmail, passwordHash, role ?? null],
		);

		return rows[0] ?? null;
	} catch (error) {
		if (error.code === '23505') {
			throw new Error('Email is already registered.');
		}
		throw error;
	}
}

export async function checkCredentials(email, password) {
	if (typeof email !== 'string' || typeof password !== 'string') {
		return null;
	}

	const user = await findUserByEmail(email.trim().toLowerCase());
	if (!user) {
		return null;
	}

	const isValidPassword = await bcrypt.compare(password, user.password);
	if (!isValidPassword) {
		return null;
	}

	return {
		id: user.id,
		email: user.email,
		role: user.role,
	};
}

export async function getUsers() {
	const { rows } = await db.query('SELECT id, email, role FROM users ORDER BY id ASC');
	return rows;
}

export function registerAuthenticatedUser(token, user) {
	if (!token || !user) return;
	authenticatedUsers.set(token, user);
}

export function findAuthenticatedUser(token) {
	return authenticatedUsers.get(token) ?? null;
}

async function findUserByEmail(email) {
	const { rows } = await db.query(
		`SELECT id, email, password, role
		 FROM users
		 WHERE email = $1
		 LIMIT 1`,
		[email],
	);

	return rows[0] ?? null;
}