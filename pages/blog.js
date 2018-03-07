import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';

import {provider} from '../framework/apollo';

import {Blog} from '../components';

@provider
export default class extends Component {
	static getInitialProps({query}) {
		return {
			blogId: query.id
		};
	}

	render() {
		return (
			<Blog id={this.props.blogId}/>
		)
	}
}
