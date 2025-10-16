import { findAuthenticatedUser } from '../db/user.js';

const unprotectedRoutes = [
	'/',
	'/hello',
	'/some-html',
	'/some-json',
	'/transaction',
	'/tasks',
	'/authenticate',
	'/register',
	'/exo-query-string',
	'/get-users'
];

const roleProtectedRoutes = [
	{ path: '/restricted2', roles: ['admin'] },
];

function matchPath(pathname, route) {
	return pathname === route || pathname.startsWith(route + '/');
}

function isUnprotectedRoute(pathname) {
	return unprotectedRoutes.some((route) => matchPath(pathname, route));
}

function hasPathRole(pathname, role) {
	const route = roleProtectedRoutes.find(({ path }) => matchPath(pathname, path));
	return !route || route.roles.includes(role);
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

	req.user = authenticatedUser;
	if (!hasPathRole(req.path, authenticatedUser.role)) {
		return res.status(403).json({ error: 'Forbidden' });
	}
	next();
}