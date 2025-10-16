export const authenticatedUsers = {};
const registeredUsers = [
	{ email: 'admin@example.com', password: 'admin123' },
	{ email: 'user@example.com', password: 'user123' },
];

export function registerAuthenticatedUser(token, email) {
	authenticatedUsers[token] = { email };
}

export function findAuthenticatedUser(token) {
	return authenticatedUsers[token] ?? null;
}

export function getRegisteredUsers() {
	return registeredUsers;
}

export function checkCredentials(email, password) {
	return registeredUsers.find(
		(user) => user.email === email && user.password === password,
	);
}
