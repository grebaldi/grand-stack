const express = require('express');
const bodyParser = require('body-parser');
const next = require('next');
const cors = require('cors');
const neo4j = require('neo4j-driver').v1;
const graphqlHTTP = require('express-graphql');
const {makeExecutableSchema} = require('graphql-tools');

const {createMessageBus, createMessageBusMiddleware} = require('./framework/cqrs');

const {typeDefs, resolvers} = require('./domain/model');
const commandCreators = require('./domain/command').default;
const commandHandlers = require('./domain/commandHandler').default;

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const driver = neo4j.driver('bolt://127.0.0.1:7687');
const graphqlSchema = makeExecutableSchema({typeDefs, resolvers});
const commandBus = createMessageBus({
	errorHandler: () => {}
});

commandHandlers.forEach(commandHandler => commandBus.subscribe(commandHandler.type, commandHandler));

app.prepare().then(() => {
	const server = express();

	server.use(bodyParser.json());

	server.use('/graphql', cors(), graphqlHTTP(request => {
		const session = driver.session();
		return {
			schema: graphqlSchema,
			graphiql: dev,
			context: {session}
		};
	}));

	server.use('/command', createMessageBusMiddleware({
		creators: commandCreators,
		messageBus: commandBus,
		contextFactory: () => {
			const session = driver.session();

			return {session};
		}
	}));

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
process.on('uncaughtException', (ex) => {
	console.error(ex);
	cleanup();
});
