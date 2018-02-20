import React, {Component} from 'react';
import PropTypes from 'prop-types';
import fetch from 'isomorphic-unfetch';
import uuid from 'uuid';

import {blog} from '../domain/command';
import {provider} from '../framework/apollo';

import {BlogList} from '../components';

import styles from './style.css';

@provider
export default class extends Component {
	state = {
		input: '',
		items: []
	};

	updateInput = event =>
		this.setState({input: event.target.value});

	add = event => {
		const {input, items} = this.state;
		const blogData = {
			id: uuid.v4(),
			title: input
		};

		this.setState({
			input: '',
			items: [...items, blogData]
		});

		event.preventDefault();

		fetch('/command/dispatch', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(blog.addBlog(blogData))
		});
	};

	render() {
		return (
			<div className={styles.container}>
				<form onSubmit={this.add}>
					<input
						type="text"
						placeholder="Item Name"
						value={this.state.input}
						onChange={this.updateInput}
						/>
					<button type="submit">Add</button>
				</form>
				<BlogList/>
				<ul>
					{this.state.items.map(item => (
						<li key={item.id}>{item.title}</li>
					))}
				</ul>
			</div>
		);
	}
}
