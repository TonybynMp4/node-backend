import 'dotenv/config';
import express from 'express';
import { router } from './src/routes.js';

const app = express();
const PORT = 3000;

app.use(express.json());

app.use('/', router);

app.listen(PORT, () => {
	console.log(`Example app listening on http://localhost:${PORT}`);
});