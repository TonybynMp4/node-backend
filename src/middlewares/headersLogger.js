export default function headersLogger(req, _res, next) {
	console.log('Request headers:', req.headers);
	next();
}
