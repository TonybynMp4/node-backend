import { findAuthenticatedUser } from "../security/userTokens.js";

const unprotectedRoutes = [
	'/',
	'/hello',
	'/some-html',
	'/some-json',
	'/transaction',
	'/tasks',
	'/authenticate',
	'/exo-query-string',
	'/get-users'
];

function isUnprotectedRoute(pathname) {
	return unprotectedRoutes.some((route) => {
		return route === pathname || pathname.startsWith(route + '/') || pathname.startsWith(route + '?');
	});
}

export default function firewall(req, res, next) {
	if (isUnprotectedRoute(req.path)) {
		return next();
	}

	const token = req.headers.token ?? req.headers.authorization;
	if (!token) {
		return res.status(403).json({ error: 'Forbidden' });
	}

	const authenticatedUser = findAuthenticatedUser(token);
	if (!authenticatedUser) {
		return res.status(403).json({ error: 'Forbidden' });
	}

	req.authenticatedUser = authenticatedUser;
	next();
}