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
	query ($blogId: ID!) {
		blog (id: $blogId) {
			id,
			title,
			posts {
				title
			}
		}
	}
`, {
	options: ({blogId}) => ({
		variables: {blogId}
	})
})
export default class extends Component {
	static propTypes = {
		blogId: PropTypes.string.isRequired,
		data: PropTypes.shape({
			blog: PropTypes.shape({
				title: PropTypes.string.isRequired
			})
		})
	};

	static getInitialProps({query}) {
		return {
			blogId: query.blogId
		};
	}

	state = {
		post: {
			title: '',
			text: ''
		}
	};

	updateTitle = event =>
		this.setState({post: {...this.state.post, title: event.target.value}});

	updateText = event =>
		this.setState({post: {...this.state.post, text: event.target.value}});

	handleSubmit = event => {
		event.preventDefault();

		fetch('/command/dispatch', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(post.addPost({
				blogId: this.props.blogId,
				id: uuid.v4(),
				...this.state.post
			}))
		});
	};

	render() {
		const {blog} = this.props.data;
		const {post} = this.state;

		return blog ? (
			<form onSubmit={this.handleSubmit}>
				<h1>
					Create new post in
					<Link href={{pathname: '/blog', query: {id: blog.id}}}>
						<a>{blog.title}</a>
					</Link>
				</h1>

				<div style={{display: 'flex', flexDirection: 'column'}}>
					<input type="text" placeholder="Title" value={post.title} onChange={this.updateTitle}/>
					<textarea placeholder="Text" cols="30" rows="10" value={post.text} onChange={this.updateText}></textarea>
					<button type="submit">Save</button>
				</div>
			</form>
		) : null;
	}
}
