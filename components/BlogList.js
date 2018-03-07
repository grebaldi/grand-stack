import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';

import Link from 'next/link';

const allBlogs = gql`
	query {
		blogs {
			id,
			title
		}
	}
`

@graphql(allBlogs)
export default class extends Component {
	static propTypes = {
		data: PropTypes.shape({
			blogs: PropTypes.arrayOf(
				PropTypes.shape({
					id: PropTypes.string.isRequired,
					title: PropTypes.string.isRequired
				})
			)
		})
	};

	render() {
		return (
			<ul>
				{this.props.data.blogs && this.props.data.blogs.map(blog => (
					<li key={blog.id}>
						<Link href={{pathname: '/blog', query: {id: blog.id}}}>
							<a>{blog.title}</a>
						</Link>
					</li>
				))}
			</ul>
		)
	}
}
