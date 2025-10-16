export const authenticatedUsers = {};

export function registerAuthenticatedUser(token, email) {
	authenticatedUsers[token] = { email };
}

export function findAuthenticatedUser(token) {
	return authenticatedUsers[token] ?? null;
}
