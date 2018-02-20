import * as repository from './repository';

export const add = commandBus => commandBus.subscribe(
	'@myapp/blog/add',
	(blog, {session}) => {
		repository.add(session, blog);
	}
)
