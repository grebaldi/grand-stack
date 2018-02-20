import PropTypes from 'prop-types';

import {createMessage} from '../../../framework/cqrs';

export const add = createMessage('@myapp/blog/command/add', {
	id: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired
});

export const rename = createMessage('@myapp/blog/command/rename', {
	id: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired
});

export const remove = createMessage('@myapp/blog/command/remove', {
	id: PropTypes.string.isRequired
});
