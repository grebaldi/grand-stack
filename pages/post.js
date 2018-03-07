import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import uuid from 'uuid';

import Link from 'next/link';

import {post} from '../domain/command';
import {provider} from '../framework/apollo';

@provider
@graphql(gql`
	query ($postId: ID!) {
		post (id: $postId) {
			title,
			text,
			blog {
				id,
				title
			}
		}
	}
`, {
	options: ({postId}) => ({
		variables: {postId}
	})
})
export default class extends Component {
	static propTypes = {
		postId: PropTypes.string.isRequired,
		data: PropTypes.shape({
			post: PropTypes.shape({
				title: PropTypes.string.isRequired,
				text: PropTypes.string.isRequired,
				blog: PropTypes.shape({
					id: PropTypes.string.isRequired,
					title: PropTypes.string.isRequired
				}).isRequired
			})
		})
	};

	static getInitialProps({query}) {
		return {
			postId: query.postId
		};
	}

	render() {
		const {post} = this.props.data;

		console.log(this.props.data);

		return post ? (
			<div>
				<h1>
					<small>
						<Link href={{pathname: '/blog', query: {id: post.blog.id}}}>
							<a>{post.blog.title}</a>
						</Link>
					</small>
					<br/>
					{post.title}
				</h1>

				<div>{post.text}</div>
			</div>
		) : null;
	}
}
