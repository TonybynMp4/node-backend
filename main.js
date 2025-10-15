import 'dotenv/config';
import express from 'express';
import { router } from './src/routes.js';

const app = express();
const PORT = 3000;

function loggerMiddleware(text) {
	return (req, _res, next) => {
		console.log(`${text} `, req.body);
		next();
	};
}

app.use(loggerMiddleware('before json'));
app.use(express.json());
app.use(loggerMiddleware('after json'));

app.use(express.static('./templates'));
// inclus le dossier public pour que le css s'applique
app.use(express.static('./public'));

app.use('/', router);

app.listen(PORT, () => {
	console.log(`Example app listening on http://localhost:${PORT}`);
});