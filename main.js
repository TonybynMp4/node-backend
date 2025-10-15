import 'dotenv/config';
import express from 'express';
import loggerMiddleware from './src/middlewares/logger.js';
import headersLogger from './src/middlewares/headersLogger.js';
import { router } from './src/routes.js';

const app = express();
const PORT = 3000;

app.use(headersLogger);
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