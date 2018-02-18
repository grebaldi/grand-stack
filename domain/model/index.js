import * as blog from './blog';

export const repository = {
	blog: blog.repository
};

export const typeDefs = /* GraphQL */`
	type Query {
		blogs: [Blog]
	}
	${blog.schema}
`;

export const resolvers = {
	Query: {
		blogs: (_, args, {session}) => blog.repository.findAll(session)
	}
};
