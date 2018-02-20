import PropTypes from 'prop-types';

import createMessageFactory from '../../framework/cqrs/createMessageFactory';

export const addBlog = createMessageFactory('@myapp/blog/command/add', {
	id: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired
});

export const renameBlog = createMessageFactory('@myapp/blog/command/rename', {
	id: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired
});

export const removeBlog = createMessageFactory('@myapp/blog/command/remove', {
	id: PropTypes.string.isRequired
});

export default [
	addBlog,
	renameBlog,
	removeBlog
];
