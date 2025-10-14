import express from 'express';

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
	res.send('Hello from Express!');
});

app.get('/some-html', (req, res) => {
	res.send('<html><body><h1>bonjour html</h1></body></html>');
});

app.get('/some-json', (req, res) => {
	const user = { age: 22, nom: 'Jane' };
	console.log('Headers:', req.headers);
	console.log('Body:', req.body);
	res.json(user);
});

app.get('/transaction', (req, res) => {
	res.json([100, 2000, 3000]);
});

app.post('/data', (req, res) => {
	console.log('Body:', req.body);
	res.json(req.body);
});

app.get('/exo-query-string', (req, res) => {
	console.log('Query params:', req.query);
	const { age } = req.query;
	if (age) {
		res.send(`<h1>${age}</h1>`);
		return;
	}
	res.send('hello');
});

app.get('/get-user/:userId', (req, res) => {
	const { userId } = req.params;
	res.send(`User ID: ${userId}`);
});

app.listen(PORT, () => {
	console.log(`Example app listening on http://localhost:${PORT}`);
});