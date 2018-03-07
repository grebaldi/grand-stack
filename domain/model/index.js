import * as blog from './blog';
import * as post from './post';

export const repository = {
	blog: blog.repository,
	post: post.repository
};

export const typeDefs = /* GraphQL */`
	type Query {
		blogs: [Blog],
		blog(id: ID!): Blog
	}
	${blog.schema}
	${post.schema}
`;

export const resolvers = {
	Query: {
		blogs: (_, args, {session}) => blog.repository.findAll(session),
		blog: (_, {id}, {session}) => blog.repository.findOneById(session, id)
	},
	Blog: {
		posts: (blog, args, {session}) => post.repository.findAllByBlog(session, blog)
	}
};
