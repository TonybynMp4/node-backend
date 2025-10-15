import 'dotenv/config';
import express from 'express';
import firewall from './src/middlewares/firewall.js';
import { bodyLogger, headersLogger } from './src/middlewares/loggers.js';
import { router } from './src/routes.js';

const app = express();
const PORT = 3000;

app.use(headersLogger);
app.use(bodyLogger('before json'));
app.use(express.json());
app.use(bodyLogger('after json'));

app.use(express.static('./templates'));
// inclus le dossier public pour que le css s'applique
app.use(express.static('./public'));

app.use(firewall);

app.use('/', router);

app.listen(PORT, () => {
	console.log(`Example app listening on http://localhost:${PORT}`);
});