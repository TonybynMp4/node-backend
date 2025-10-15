export function bodyLogger(text) {
	return (req, _res, next) => {
		console.log(`${text} `, req.body);
		next();
	};
}

export function headersLogger(req, _res, next) {
	console.log('Request headers:', req.headers);
	next();
}
