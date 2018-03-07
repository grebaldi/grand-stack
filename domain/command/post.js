import PropTypes from 'prop-types';

import createMessageFactory from '../../framework/cqrs/createMessageFactory';

export const addPost = createMessageFactory('@myapp/post/command/add', {
	blogId: PropTypes.string.isRequired,
	id: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	text: PropTypes.string.isRequired
});

export default [
	addPost
];
