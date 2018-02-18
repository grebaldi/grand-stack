const express = require('express');
const bodyParser = require('body-parser');
const next = require('next');
const neo4j = require('neo4j-driver').v1;

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const driver = neo4j.driver('bolt://127.0.0.1:7687');

app.prepare().then(() => {
	const server = express();

	server.use(bodyParser.json());

	server.post('/add', async (req, res) => {
		const session = driver.session();
		const {input} = req.body;

		await session.run(
			`CREATE (item:Item {name: $name}) RETURN item`,
			{name: input}
		);

		session.close();
	});

	server.get('/list', async (req, res) => {
		const session = driver.session();
		const result = await session.run(
			`MATCH (item:Item) RETURN item.name`
		);

		res.setHeader('Content-Type', 'application/json');
    	res.send(JSON.stringify(result.records.map(record => record._fields[0])));
		session.close();
	});

	server.get('*', (req, res) => {
		return handle(req, res);
	});

	server.listen(port, (err) => {
		if (err) {
			throw err;
		}

		console.log(`> Ready on http://localhost:${port}`);
	})
});

const cleanup = () => {
	driver.close();
	process.exit();
};

process.on('SIGINT', cleanup);
process.on('SIGUSR1', cleanup);
process.on('SIGUSR2', cleanup);
process.on('uncaughtException', cleanup);
