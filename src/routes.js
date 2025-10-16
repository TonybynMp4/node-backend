import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import {
	checkCredentials,
	getUsers,
	newUserRegistered,
	registerAuthenticatedUser,
} from './db/user.js';

const tasks = [
	{
		id: 1,
		title: 'Apprendre Express',
		description: 'Lire la documentation officielle',
		isDone: false,
	},
];

let nextTaskId = tasks.length + 1;

export const router = Router();
router.get('/', (_, res) => {
	res.send('Hello from Express!');
});

router.get('/hello', (_, res) => {
	res.send('<h1>hello</h1>');
});

router.get('/some-html', (_, res) => {
	res.send('<html><body><h1>bonjour html</h1></body></html>');
});

router.get('/some-json', (req, res) => {
	const user = { age: 22, nom: 'Jane' };
	console.log('Headers:', req.headers);
	console.log('Body:', req.body);
	res.json(user);
});

router.get('/transaction', (_, res) => {
	res.json([100, 2000, 3000]);
});

router.get('/restricted1', (_, res) => {
	res.json({ message: 'topsecret' });
});

router.get('/restricted2', (_, res) => {
	res.send('<h1>Admin space</h1>');
});

router.post('/data', (req, res) => {
	console.log('Body:', req.body);
	res.json(req.body);
});

router.get('/tasks', (_, res) => {
	res.json(tasks);
});

router.post('/new-task', (req, res) => {
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

router.put('/update-task/:id', (req, res) => {
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

router.delete('/delete-task/:id', (req, res) => {
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

router.get('/exo-query-string', (req, res) => {
	console.log('Query params:', req.query);
	const { age } = req.query;
	if (age) {
		res.send(`<h1>${age}</h1>`);
		return;
	}
	res.send('hello');
});

router.get('/get-user/:userId', (req, res) => {
	const { userId } = req.params;
	res.send(`User ID: ${userId}`);
});

router.get('/get-users', async (_req, res) => {
	try {
		const users = await getUsers();
		res.json(users);
	} catch (error) {
		console.error('Unable to fetch users:', error);
		res.status(500).json({ error: 'Unable to fetch users.' });
	}
});

router.post('/register', async (req, res) => {
	const { email, password } = req.body ?? {};

	if (!email || typeof email !== 'string' || !password || typeof password !== 'string') {
		return res.status(400).json({ error: 'Email and password are required.' });
	}

	try {
		const user = await newUserRegistered({
			email: email.trim().toLowerCase(),
			password: password.trim(),
		});

		if (!user) {
			return res.status(500).json({ error: 'Unable to register user.' });
		}

		res.status(201).json(user);
	} catch (error) {
		return res.status(500).json({ error: error?.message });
	}
});

router.post('/authenticate', async (req, res) => {
	const { email, login, password } = req.body ?? {};
	const identifier = typeof email === 'string' ? email : login;

	if (typeof identifier !== 'string' || typeof password !== 'string') {
		return res.status(400).json({ error: 'Email (or login) and password are required.' });
	}

	try {
		const user = await checkCredentials(identifier, password);
		if (!user) {
			return res.status(403).json({ error: 'Invalid credentials.' });
		}

		const token = randomUUID();
		registerAuthenticatedUser(token, user);

		res.json({ token, user });
	} catch (error) {
		console.error('Authentication error:', error);
		res.status(500).json({ error: 'Internal server error.' });
	}
});