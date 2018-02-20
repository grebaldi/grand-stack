export default function createMessageHandler(type, handlerFn) {
	const messageHandler = (payload, ...args) => handlerFn(payload, ...args);

	messageHandler.type = type;

	return messageHandler;
}
