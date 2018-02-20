import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {ApolloClient} from 'apollo-client';
import {ApolloProvider} from 'react-apollo';
import {HttpLink} from 'apollo-link-http';
import {InMemoryCache} from 'apollo-cache-inmemory';
import fetch from 'isomorphic-unfetch';

import Head from 'next/head';

let apolloClient = null;

if (!process.browser) {
	global.fetch = fetch;
}

const createApolloClient = initialState => new ApolloClient({
	connectToDevTools: process.browser,
	ssrMode: !process.browser,
	link: new HttpLink({
		uri: 'http://127.0.0.1:3000/graphql'
	}),
	cache: new InMemoryCache().restore(initialState || {})
});

export default ComposedComponent => class extends Component {
	static displayName = ApolloProvider.displayName;
	static propTypes = {
		serverState: PropTypes.object.isRequired
	};

	static async getInitialProps(context) {
		const apolloClient = createApolloClient();
		const initialPropsFromComposedComponent = ComposedComponent.getInitialProps ?
			await ComposedComponent.getInitialProps(context) : {};

		try {
			// Run all GraphQL queries
			await getDataFromTree(
				<ApolloProvider client={apolloClient}>
					<ComposedComponent {...initialPropsFromComposedComponent}/>
				</ApolloProvider>,
				{
					router: {
						asPath: ctx.asPath,
						pathname: ctx.pathname,
						query: ctx.query
					}
				}
			)
		} catch (error) {
			// Prevent Apollo Client GraphQL errors from crashing SSR.
			// Handle them in components via the data.error prop:
			// http://dev.apollodata.com/react/api-queries.html#graphql-query-data-error
		}

		if (!process.browser) {
			// getDataFromTree does not call componentWillUnmount
			// head side effect therefore need to be cleared manually
			Head.rewind();
		}

		return {
			serverState: {
				apollo: {
					data: apolloClient.cache.extract()
				}
			},
			...initialPropsFromComposedComponent
		}
	}

	constructor(props) {
		super(props)
		if (!process.browser) {
			this.apolloClient = createApolloClient(this.props.serverState.apollo.data);
		} else {
			if (!apolloClient) {
				apolloClient = createApolloClient(this.props.serverState.apollo.data);
			}

			this.apolloClient = apolloClient;
		}
	}

	render() {
		return (
			<ApolloProvider client={this.apolloClient}>
				<ComposedComponent {...this.props}/>
			</ApolloProvider>
		);
	}
}
