const express = require('express');
const bodyParser = require('body-parser');
const next = require('next');
const neo4j = require('neo4j-driver').v1;
const graphqlHTTP = require('express-graphql');
const {makeExecutableSchema} = require('graphql-tools');

const {typeDefs, resolvers} = require('./domain/model');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const driver = neo4j.driver('bolt://127.0.0.1:7687');
const schema =

app.prepare().then(() => {
	const server = express();

	server.use(bodyParser.json());

	server.use('/graphql', graphqlHTTP(request => {
		const session = driver.session();
		return {
			schema: makeExecutableSchema({typeDefs, resolvers}),
			graphiql: true,
			context: {session}
		};
	}));

	server.post('/add', async (req, res) => {
		const session = driver.session();
		const {input} = req.body;

		await session.run(
			`CREATE (blog:Blog {title: $name}) RETURN blog`,
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
