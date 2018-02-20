import * as blog from '../model/blog';
import {createMessageHandler} from '../../framework/cqrs';

export default [
	createMessageHandler('@myapp/blog/command/add', (blogData, {session}) => {
		blog.repository.add(session, blogData);
	})
];
