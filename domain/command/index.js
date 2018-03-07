import blogCommands from './blog';
import postCommands from './post';
import * as blog from './blog';
import * as post from './post';

export {
	blog,
	post
};

export default [
	...blogCommands,
	...postCommands
];
