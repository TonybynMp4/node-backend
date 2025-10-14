import express from 'express';

const app = express();
const PORT = 3000;

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

app.listen(PORT, () => {
	console.log(`Example app listening on http://localhost:${PORT}`);
});