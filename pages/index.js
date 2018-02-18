import React, {Component} from 'react';
import fetch from 'isomorphic-unfetch';

import styles from './style.css';

export default class extends Component {
	static async getInitialProps() {
		const res = await fetch('http://127.0.0.1:3000/list');
		const statusCode = res.statusCode > 200 ? res.statusCode : false;
		const json = await res.json();

		return {statusCode, items: json};
	}

	state = {
		input: '',
		items: this.props.items
	};

	updateInput = event =>
		this.setState({input: event.target.value});

	add = event => {
		const {input, items} = this.state;

		this.setState({
			input: '',
			items: [...items, input]
		});

		event.preventDefault();

		fetch('/add', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({input})
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
				<ul>
					{this.state.items.map(item => (
						<li key={item}>{item}</li>
					))}
				</ul>
			</div>
		);
	}
}
