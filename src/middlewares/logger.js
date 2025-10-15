export default function loggerMiddleware(text) {
	return (req, _res, next) => {
		console.log(`${text} `, req.body);
		next();
	};
}