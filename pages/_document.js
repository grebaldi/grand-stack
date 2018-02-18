import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
	render() {
		return (
			<html>
				<Head>
					<script src="https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.26.0/polyfill.min.js"></script>
					<link rel="stylesheet" href="/_next/static/style.css" />
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</html>
		)
	}
}
