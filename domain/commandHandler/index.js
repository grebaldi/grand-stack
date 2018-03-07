import * as blog from '../model/blog';
import * as post from '../model/post';
import {createMessageHandler} from '../../framework/cqrs';

export default [
	createMessageHandler('@myapp/blog/command/add', (blogData, {session}) => {
		blog.repository.add(session, blogData);
	}),
	createMessageHandler('@myapp/post/command/add', ({blogId, ...postData}, {session}) => {
		post.repository.add(session, {id: blogId}, postData);
	})
];
