
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

function isTokenValid(headers) {
	return headers?.token === '42';
}

export default function firewall(req, res, next) {
	if (isUnprotectedRoute(req.path)) {
		return next();
	}

	const token = req.headers.token ?? req.headers.authorization;
	if (!token) {
		return res.status(403).json({ error: 'Forbidden' });
	}

	next();
}