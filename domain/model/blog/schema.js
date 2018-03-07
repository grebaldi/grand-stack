export default /* GraphQL */`
	type Blog {
		id: ID!
		title: String!
		posts: [Post!]
	}
`
