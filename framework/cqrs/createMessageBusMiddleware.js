const express = require('express');
const bodyParser = require('body-parser');

const createMessageBus = require('./createMessageBus');

export default ({creators, messageBus, contextFactory}) => {
	const router = express.Router();
	const findCreator = type => {
		const [creator] = creators.filter(creator => creator.type === type);

		if (!creator) {
			throw new Error(`${type} is not a valid message.`);
		}

		return creator;
	}

	router.use(bodyParser.json());
	router.post('/dispatch', (req, res) => {
		const context = contextFactory ? contextFactory(req, res) : {};
		const {type, payload} = req.body;

		res.setHeader('Content-Type', 'application/json');

		try {
			const creator = findCreator(type);
			const message = creator(payload);

			messageBus.dispatch(message, context);

			res.status(202);
	    	res.send(JSON.stringify({success: `${type} accepted.`}));
		} catch (err) {
			res.status(400);
	    	res.send(JSON.stringify({error: err.message}));
		}
	});

	return router;
};
