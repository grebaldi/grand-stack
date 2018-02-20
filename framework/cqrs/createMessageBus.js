import Rx from 'rxjs';

export default function createMessageBus({errorHandler}) {
	const bus = (new Rx.Subject()).observeOn(Rx.Scheduler.async);

	return {
		dispatch: (msg, context) => bus.next({msg, context}),
		subscribe: (type, handler) => bus.filter(({msg}) => msg.type === type).subscribe({
			next: ({msg, context}) => handler(msg.payload, context),
			error: errorHandler
		})
	}
}
