import PropTypes from 'prop-types';

export default function createMessageFactory(type, schema) {
	const validatePayload = payload =>
		PropTypes.checkPropTypes(schema, payload, 'payload', type);
	const messageCreator = payload => {
		validatePayload(payload);

		return {
			type,
			payload
		}
	};

	messageCreator.type = type;
	messageCreator.validatePayload = validatePayload;

	return messageCreator;
}
