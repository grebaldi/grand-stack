import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';

import Link from 'next/link';

@graphql(gql`
	query ($blogId: ID!) {
		blog (id: $blogId) {
			id,
			title,
			posts {
				id,
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
		const {blog} = this.props.data;

		return blog ? (
			<div>
				<h1>{blog.title}</h1>
				<Link href={{pathname: '/post-add', query: {blogId: blog.id}}}>
					<a>+ Create new Post</a>
				</Link>

				<ul>
					{blog.posts.map(post => (
						<li>
							<Link href={{pathname: '/post', query: {postId: post.id}}}>
								<a>{post.title}</a>
							</Link>
						</li>
					))}
				</ul>
			</div>
		) : null;
	}
}
