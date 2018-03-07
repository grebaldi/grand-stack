import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';

@graphql(gql`
	query ($blogId: ID!) {
		blog (id: $blogId) {
			title,
			posts {
				title
			}
		}
	}
`, {
	options: ({id}) => ({
		variables: {
			blogId: id
		}
	})
})
export default class extends Component {
	static propTypes = {
		data: PropTypes.shape({
			blog: PropTypes.shape({
				title: PropTypes.string.isRequired
			})
		})
	};

	render() {
		return this.props.data.blog ? (
			<h1>{this.props.data.blog.title}</h1>
		) : null;
	}
}
