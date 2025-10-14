import express from 'express';

const app = express();
const PORT = 3000;

app.use(express.json());

const tasks = [
	{
		id: 1,
		title: 'Apprendre Express',
		description: 'Lire la documentation officielle',
		isDone: false,
	},
];

let nextTaskId = tasks.length + 1;

app.get('/', (_, res) => {
	res.send('Hello from Express!');
});

app.get('/some-html', (_, res) => {
	res.send('<html><body><h1>bonjour html</h1></body></html>');
});

app.get('/some-json', (req, res) => {
	const user = { age: 22, nom: 'Jane' };
	console.log('Headers:', req.headers);
	console.log('Body:', req.body);
	res.json(user);
});

app.get('/transaction', (_, res) => {
	res.json([100, 2000, 3000]);
});

app.post('/data', (req, res) => {
	console.log('Body:', req.body);
	res.json(req.body);
});

app.get('/tasks', (_, res) => {
	res.json(tasks);
});

app.post('/new-task', (req, res) => {
	const { title, description, isDone } = req.body ?? {};

	if (typeof title !== 'string' || typeof description !== 'string') {
		return res.status(400).json({ error: 'Invalid task payload.' });
	}

	const newTask = {
		id: nextTaskId++,
		title,
		description,
		isDone: isDone ?? false,
	};

	tasks.push(newTask);
	res.status(201).json(newTask);
});

app.put('/update-task/:id', (req, res) => {
	const taskId = Number.parseInt(req.params.id, 10);
	const task = tasks.find((t) => t.id === taskId);

	if (!Number.isInteger(taskId)) return res.status(400).json({ error: 'Invalid task ID.' });
	if (!task) return res.status(404).json({ error: 'Task not found.' });

	const { title, description, isDone } = req.body ?? {};

	if (title !== undefined) {
		if (typeof title !== 'string') {
			return res.status(400).json({ error: 'Title must be a string.' });
		}
		task.title = title;
	}

	if (description !== undefined) {
		if (typeof description !== 'string') {
			return res.status(400).json({ error: 'Description must be a string.' });
		}
		task.description = description;
	}

	if (isDone !== undefined) {
		if (typeof isDone !== 'boolean') {
			return res.status(400).json({ error: 'isDone must be a boolean.' });
		}
		task.isDone = isDone;
	}

	res.json(task);
});

app.delete('/delete-task/:id', (req, res) => {
	const taskId = Number.parseInt(req.params.id, 10);

	if (!Number.isInteger(taskId)) {
		return res.status(400).json({ error: 'Task id must be an integer.' });
	}
	const index = tasks.findIndex((t) => t.id === taskId);

	if (index === -1) {
		return res.status(404).json({ error: 'Task not found.' });
	}

	const [deletedTask] = tasks.splice(index, 1);
	res.json({ deleted: deletedTask });
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